-- Editable content: projects, the home page's text, and the media they use.
--
-- William edits through the admin app; the public site is rebuilt from this
-- content when he presses Publish, so it stays static and keeps working even
-- while the database sleeps. Reading published content is open to anyone —
-- it is exactly what the site shows. Writing is for admins only.

-- Who may edit. One row per admin user; William's account is added by hand.
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- An admin can see the list, so the app can tell him he is one.
create policy "admins read themselves" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- Media references, in every column below that holds one: a value starting
-- with "/" is a file already shipped in the repository (public/…); anything
-- else is an object key in the "media" storage bucket, which the build
-- downloads at publish time.

create table public.projects (
  id text primary key,
  ref text not null,
  title text not null,
  category text not null check (category in ('Nature', 'Civilisation', 'Characters')),
  year text not null,
  software text not null,
  description text not null,
  -- Technical caption in the frame chrome, e.g. "Still · 1920 × 1080".
  spec text not null,
  -- Still shown while a model loads, and the project's thumbnail.
  poster text not null,
  -- Raw or optimised .glb; raw uploads are optimised by the build.
  model text,
  -- [{ "src", "label", "size" }] — finished renders only, in order.
  renders jsonb not null default '[]',
  -- [{ "index", "label", "tool", "caption", "image" }] — in order.
  stages jsonb not null default '[]',
  -- Product ids the finished render is sold as, if any.
  shop_poster text references public.products (id) on delete set null,
  shop_figurine text references public.products (id) on delete set null,
  position int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;

create policy "anyone reads published projects" on public.projects
  for select to anon, authenticated using (published or public.is_admin());
create policy "admins write projects" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- The home page, one row per section: hero, band, about, tools, process,
-- physical, cta, contact. The shape of each value is fixed by the site's
-- SiteContent type; the admin app edits one block per screen.
create table public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;

create policy "anyone reads site content" on public.site_content
  for select to anon, authenticated using (true);
create policy "admins write site content" on public.site_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- The shop: admins manage the catalogue and read orders. The public still
-- reaches none of it directly — the shop function stays the only door.
create policy "admins manage products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage variants" on public.variants
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read orders" on public.orders
  for select to authenticated using (public.is_admin());
create policy "admins read order items" on public.order_items
  for select to authenticated using (public.is_admin());

-- Fulfilment is separate from payment: status stays what Stripe said, and
-- shipping is recorded beside it.
alter table public.orders add column shipped_at timestamptz;
create policy "admins mark orders shipped" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Media: public to read, since everything in it ends up on the site anyway.
-- 50MB per file is the Free plan's ceiling, and a raw Blender export fits.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 52428800,
  array['image/webp', 'image/png', 'image/jpeg', 'model/gltf-binary', 'application/octet-stream', 'video/mp4']
);

create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "admins replace media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "anyone reads media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');
