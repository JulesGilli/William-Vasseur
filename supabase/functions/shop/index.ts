/**
 * Public shop API — the backend half of src/lib/shop/api.ts.
 *
 *   GET  …/functions/v1/shop/products  → Product[] shaped for the front
 *   GET  …/functions/v1/shop/shipping  → the shipping fees, in cents
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

/** Translations of a row's text, by language: { fr: { name: '…' }, … }. */
type I18n = Record<string, Record<string, string>>;

interface VariantRow {
  sku: string;
  product_id: string;
  id: string;
  label: string;
  price_cents: number;
  stock: number | null;
  position: number;
  i18n: I18n;
}

interface ProductRow {
  id: string;
  ref: string;
  name: string;
  kind: string;
  family: 'Poster' | 'Figurine' | 'Diorama';
  blurb: string;
  spec: string;
  image: string;
  model: string | null;
  currency: string;
  lead_time: string;
  position: number;
  i18n: I18n;
  variants: VariantRow[];
}

/** Where the shop delivers. France has its own fee; the rest share one. */
const COUNTRIES = ['FR', 'BE', 'LU', 'DE', 'ES', 'IT', 'NL', 'PT', 'AT', 'IE'];
const LANGS = ['en', 'fr', 'de', 'es'];

interface ShippingRates {
  franceCents: number;
  europeCents: number;
  /** Order value from which shipping is free; 0 means never. */
  freeFromCents: number;
}

/** Read live, like prices: what William last saved is what gets charged. */
async function shippingRates(): Promise<ShippingRates> {
  const { data } = await db.from('site_content').select('value').eq('key', 'shipping').maybeSingle();
  const v = (data?.value ?? {}) as Partial<ShippingRates>;
  const cents = (n: unknown) => (Number.isInteger(n) && (n as number) > 0 ? (n as number) : 0);
  return {
    franceCents: cents(v.franceCents),
    europeCents: cents(v.europeCents),
    freeFromCents: cents(v.freeFromCents),
  };
}

/** The database says lead_time, the front says leadTime. */
function productI18n(i18n: I18n): I18n {
  return Object.fromEntries(
    Object.entries(i18n ?? {}).map(([lang, { lead_time, ...rest }]) => [
      lang,
      lead_time ? { ...rest, leadTime: lead_time } : rest,
    ]),
  );
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
    family: p.family,
    blurb: p.blurb,
    spec: p.spec,
    image: p.image,
    model: p.model ?? undefined,
    currency: p.currency,
    leadTime: p.lead_time,
    _i18n: productI18n(p.i18n),
    variants: p.variants.map((v) => ({
      id: v.id,
      label: v.label,
      priceCents: v.price_cents,
      sku: v.sku,
      stock: v.stock,
      _i18n: v.i18n ?? {},
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

  const body = await req.json().catch(() => null);
  const lines = parseLines(body);
  if (!lines) return json({ error: 'Invalid order' }, 400);

  // The buyer picks their country in the cart, because the fee depends on
  // it; the payment page is then held to that one country, so the address
  // cannot quietly end up somewhere the fee did not cover.
  const { country, lang: wantedLang } = body as { country?: unknown; lang?: unknown };
  if (typeof country !== 'string' || !COUNTRIES.includes(country)) {
    return json({ error: 'Unknown delivery country' }, 400);
  }
  const lang = typeof wantedLang === 'string' && LANGS.includes(wantedLang) ? wantedLang : 'en';

  // Price every line from the database; the client only sent identifiers.
  const { data: variantRows, error } = await db
    .from('variants')
    .select('sku, product_id, id, label, price_cents, stock, i18n, products(name, i18n)')
    .in('product_id', lines.map((l) => l.productId));
  if (error) return json({ error: 'Catalogue unavailable' }, 500);

  type Row = VariantRow & { products: { name: string; i18n: I18n } };
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

  const subtotal = (priced as NonNullable<(typeof priced)[number]>[]).reduce(
    (sum, { line, variant }) => sum + variant.price_cents * line.quantity,
    0,
  );
  const rates = await shippingRates();
  const shipping =
    rates.freeFromCents > 0 && subtotal >= rates.freeFromCents
      ? 0
      : country === 'FR'
        ? rates.franceCents
        : rates.europeCents;

  // Record the order first so the webhook has something to confirm.
  const { data: order, error: orderErr } = await db
    .from('orders')
    .insert({ status: 'pending', country, shipping_cents: shipping })
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
  form.set('locale', lang);
  form.set('shipping_address_collection[allowed_countries][0]', country);
  // Always stated, even at zero, so the payment page says "free" rather than
  // saying nothing about delivery.
  form.set('shipping_options[0][shipping_rate_data][type]', 'fixed_amount');
  form.set('shipping_options[0][shipping_rate_data][fixed_amount][amount]', String(shipping));
  form.set('shipping_options[0][shipping_rate_data][fixed_amount][currency]', 'eur');
  form.set(
    'shipping_options[0][shipping_rate_data][display_name]',
    { en: 'Shipping', fr: 'Livraison', de: 'Versand', es: 'Envío' }[lang] ?? 'Shipping',
  );
  (priced as NonNullable<(typeof priced)[number]>[]).forEach(({ line, variant }, i) => {
    form.set(`line_items[${i}][quantity]`, String(line.quantity));
    form.set(`line_items[${i}][price_data][currency]`, 'eur');
    form.set(`line_items[${i}][price_data][unit_amount]`, String(variant.price_cents));
    form.set(
      `line_items[${i}][price_data][product_data][name]`,
      `${variant.products.i18n?.[lang]?.name || variant.products.name} — ${variant.i18n?.[lang]?.label || variant.label}`,
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
  if (req.method === 'GET' && route === 'shipping') return json(await shippingRates());
  if (req.method === 'POST' && route === 'checkout') return await checkout(req);
  return json({ error: 'Not found' }, 404);
});
