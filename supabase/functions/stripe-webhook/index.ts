/**
 * Stripe webhook — the only writer that can mark an order paid.
 *
 * Deployed with verify_jwt off because Stripe cannot send a Supabase JWT;
 * authentication is the Stripe signature header instead, verified against
 * STRIPE_WEBHOOK_SECRET (whsec_…, shown when the endpoint is registered in
 * the Stripe dashboard → Developers → Webhooks).
 *
 * Listens for checkout.session.completed: flips the order to paid, records
 * the buyer's email and total, and decrements stock.
 */
import { createClient } from 'npm:@supabase/supabase-js@2';

const db = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const encoder = new TextEncoder();

/** Constant-time hex comparison, so signature checks leak nothing by timing. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Verify Stripe's `t=…,v1=…` signature scheme over the raw body. */
async function verifySignature(
  payload: string,
  header: string | null,
  secret: string,
): Promise<boolean> {
  if (!header) return false;
  const parts = new Map(
    header.split(',').map((p) => p.split('=', 2) as [string, string]),
  );
  const t = parts.get('t');
  const v1 = parts.get('v1');
  if (!t || !v1) return false;

  // Reject events older than five minutes to blunt replay attacks.
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(`${t}.${payload}`));
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return timingSafeEqual(expected, v1);
}

Deno.serve(async (req: Request) => {
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!secret) return new Response('Webhook not configured', { status: 503 });

  const payload = await req.text();
  const valid = await verifySignature(payload, req.headers.get('stripe-signature'), secret);
  if (!valid) return new Response('Bad signature', { status: 400 });

  const event = JSON.parse(payload) as {
    type: string;
    data: {
      object: {
        id: string;
        amount_total: number | null;
        metadata?: { order_id?: string };
        customer_details?: { email?: string | null };
      };
    };
  };

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;
    if (!orderId) return new Response('No order reference', { status: 400 });

    // `status = pending` guard makes redelivered events harmless: the first
    // delivery wins, the retry matches nothing and skips the stock decrement.
    const { data: updated, error } = await db
      .from('orders')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        email: session.customer_details?.email ?? null,
        amount_total_cents: session.amount_total,
      })
      .eq('id', orderId)
      .eq('status', 'pending')
      .select('id');
    if (error) return new Response('Database error', { status: 500 });

    if (updated && updated.length > 0) {
      const { error: stockErr } = await db.rpc('consume_stock', { p_order: orderId });
      if (stockErr) console.error('stock decrement failed', stockErr);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
