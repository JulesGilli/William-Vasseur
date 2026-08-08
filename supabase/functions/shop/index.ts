/**
 * Public shop API — the backend half of src/lib/shop/api.ts.
 *
 *   GET  …/functions/v1/shop/products  → Product[] shaped for the front
 *   POST …/functions/v1/shop/checkout  → { url } to a Stripe Checkout session
 *
 * Deployed with verify_jwt off: both routes are public by design (a shop
 * without an account system), and nothing here trusts the client — prices
 * and stock always come from the database.
 *
 * Secrets expected (supabase secrets set …):
 *   STRIPE_SECRET_KEY  — sk_test_… then sk_live_…
 *   SITE_URL           — where Stripe sends the buyer back
 *                        (default https://julesgilli.github.io/William-Vasseur)
 */
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });

const db = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

interface VariantRow {
  sku: string;
  product_id: string;
  id: string;
  label: string;
  price_cents: number;
  stock: number | null;
  position: number;
}

interface ProductRow {
  id: string;
  ref: string;
  name: string;
  kind: string;
  blurb: string;
  spec: string;
  image: string;
  model: string | null;
  currency: string;
  lead_time: string;
  position: number;
  variants: VariantRow[];
}

async function listProducts(): Promise<Response> {
  const { data, error } = await db
    .from('products')
    .select('*, variants(*)')
    .order('position')
    .order('position', { referencedTable: 'variants' });
  if (error) return json({ error: 'Catalogue unavailable' }, 500);

  const products = (data as ProductRow[]).map((p) => ({
    id: p.id,
    ref: p.ref,
    name: p.name,
    kind: p.kind,
    blurb: p.blurb,
    spec: p.spec,
    image: p.image,
    model: p.model ?? undefined,
    currency: p.currency,
    leadTime: p.lead_time,
    variants: p.variants.map((v) => ({
      id: v.id,
      label: v.label,
      priceCents: v.price_cents,
      sku: v.sku,
      stock: v.stock,
    })),
  }));
  return json(products);
}

interface CartLine {
  productId: string;
  variantId: string;
  quantity: number;
}

function parseLines(body: unknown): CartLine[] | null {
  if (typeof body !== 'object' || body === null) return null;
  const { lines } = body as { lines?: unknown };
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > 50) return null;
  const out: CartLine[] = [];
  for (const raw of lines) {
    const l = raw as Partial<CartLine>;
    if (
      typeof l.productId !== 'string' ||
      typeof l.variantId !== 'string' ||
      typeof l.quantity !== 'number' ||
      !Number.isInteger(l.quantity) ||
      l.quantity < 1 ||
      l.quantity > 99
    ) {
      return null;
    }
    out.push({ productId: l.productId, variantId: l.variantId, quantity: l.quantity });
  }
  return out;
}

async function checkout(req: Request): Promise<Response> {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeKey) return json({ error: 'Payments are not configured yet' }, 503);

  const lines = parseLines(await req.json().catch(() => null));
  if (!lines) return json({ error: 'Invalid order' }, 400);

  // Price every line from the database; the client only sent identifiers.
  const { data: variantRows, error } = await db
    .from('variants')
    .select('sku, product_id, id, label, price_cents, stock, products(name)')
    .in('product_id', lines.map((l) => l.productId));
  if (error) return json({ error: 'Catalogue unavailable' }, 500);

  type Row = VariantRow & { products: { name: string } };
  const priced = lines.map((line) => {
    const v = (variantRows as Row[]).find(
      (r) => r.product_id === line.productId && r.id === line.variantId,
    );
    return v ? { line, variant: v } : null;
  });
  if (priced.some((p) => p === null)) return json({ error: 'Unknown item in cart' }, 400);

  for (const { line, variant } of priced as NonNullable<(typeof priced)[number]>[]) {
    if (variant.stock !== null && variant.stock < line.quantity) {
      return json(
        { error: `Not enough stock for ${variant.products.name} — ${variant.label}` },
        409,
      );
    }
  }

  // Record the order first so the webhook has something to confirm.
  const { data: order, error: orderErr } = await db
    .from('orders')
    .insert({ status: 'pending' })
    .select('id')
    .single();
  if (orderErr) return json({ error: 'Could not create order' }, 500);

  const items = (priced as NonNullable<(typeof priced)[number]>[]).map(({ line, variant }) => ({
    order_id: order.id,
    sku: variant.sku,
    quantity: line.quantity,
    unit_price_cents: variant.price_cents,
  }));
  const { error: itemsErr } = await db.from('order_items').insert(items);
  if (itemsErr) return json({ error: 'Could not create order' }, 500);

  // Stripe's REST API takes form-encoded bodies; no SDK needed for one call.
  const site = Deno.env.get('SITE_URL') ?? 'https://julesgilli.github.io/William-Vasseur';
  const form = new URLSearchParams();
  form.set('mode', 'payment');
  form.set('success_url', `${site}/store?checkout=success`);
  form.set('cancel_url', `${site}/store?checkout=cancelled`);
  form.set('metadata[order_id]', order.id);
  ['FR', 'BE', 'LU', 'DE', 'ES', 'IT', 'NL', 'PT', 'AT', 'IE'].forEach((c, i) =>
    form.set(`shipping_address_collection[allowed_countries][${i}]`, c),
  );
  (priced as NonNullable<(typeof priced)[number]>[]).forEach(({ line, variant }, i) => {
    form.set(`line_items[${i}][quantity]`, String(line.quantity));
    form.set(`line_items[${i}][price_data][currency]`, 'eur');
    form.set(`line_items[${i}][price_data][unit_amount]`, String(variant.price_cents));
    form.set(
      `line_items[${i}][price_data][product_data][name]`,
      `${variant.products.name} — ${variant.label}`,
    );
  });

  const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form,
  });
  if (!stripeRes.ok) {
    console.error('stripe error', stripeRes.status, await stripeRes.text());
    return json({ error: 'Payment provider refused the order' }, 502);
  }
  const session = (await stripeRes.json()) as { id: string; url: string };

  await db.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id);

  return json({ url: session.url });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  const route = new URL(req.url).pathname.split('/').filter(Boolean).pop();
  if (req.method === 'GET' && route === 'products') return await listProducts();
  if (req.method === 'POST' && route === 'checkout') return await checkout(req);
  return json({ error: 'Not found' }, 404);
});
