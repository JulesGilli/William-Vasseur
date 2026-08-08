-- Shop schema: catalogue, stock and orders.
--
-- Everything is read and written exclusively by the edge functions using the
-- service role. RLS is enabled with no policies, so the anon key can reach
-- nothing directly — the functions are the only door.

create table public.products (
  id text primary key,
  ref text not null,
  name text not null,
  kind text not null,
  blurb text not null,
  spec text not null,
  -- Site-relative path ('/models/posters/x.webp'); the front prefixes its base.
  image text not null,
  model text,
  currency text not null default 'EUR',
  lead_time text not null,
  position int not null default 0
);

create table public.variants (
  sku text primary key,
  product_id text not null references public.products(id) on delete cascade,
  -- Variant id within its product ('a3', '12cm', 'lit').
  id text not null,
  label text not null,
  price_cents int not null check (price_cents >= 0),
  -- Null means made to order rather than unlimited.
  stock int,
  position int not null default 0,
  unique (product_id, id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'canceled')),
  email text,
  amount_total_cents int,
  currency text not null default 'EUR',
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table public.order_items (
  order_id uuid not null references public.orders(id) on delete cascade,
  sku text not null references public.variants(sku),
  quantity int not null check (quantity > 0),
  -- Price at the moment of ordering, so later catalogue edits keep history.
  unit_price_cents int not null,
  primary key (order_id, sku)
);

alter table public.products enable row level security;
alter table public.variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Called by the webhook once payment is confirmed. Clamped at zero: a race
-- between two buyers oversells at Stripe, not into negative inventory.
create or replace function public.consume_stock(p_order uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update variants v
  set stock = greatest(v.stock - oi.quantity, 0)
  from order_items oi
  where oi.order_id = p_order
    and oi.sku = v.sku
    and v.stock is not null;
$$;
