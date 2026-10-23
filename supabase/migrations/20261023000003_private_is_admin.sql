-- Move is_admin() out of the API.
--
-- In "public" it was reachable at /rest/v1/rpc/is_admin. It only ever told a
-- caller whether they themselves are an admin, but nothing needs to call it
-- over HTTP: only the access policies do. A schema the API does not expose
-- keeps it callable from policies and invisible to the network. The policy
-- roles still need USAGE and EXECUTE, because policies run as the caller.

create schema if not exists private;
grant usage on schema private to anon, authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke execute on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

alter policy "anyone reads published projects" on public.projects
  using (published or private.is_admin());
alter policy "admins write projects" on public.projects
  using (private.is_admin()) with check (private.is_admin());
alter policy "admins write site content" on public.site_content
  using (private.is_admin()) with check (private.is_admin());
alter policy "admins manage products" on public.products
  using (private.is_admin()) with check (private.is_admin());
alter policy "admins manage variants" on public.variants
  using (private.is_admin()) with check (private.is_admin());
alter policy "admins read orders" on public.orders
  using (private.is_admin());
alter policy "admins mark orders shipped" on public.orders
  using (private.is_admin()) with check (private.is_admin());
alter policy "admins read order items" on public.order_items
  using (private.is_admin());
alter policy "admins upload media" on storage.objects
  with check (bucket_id = 'media' and private.is_admin());
alter policy "admins replace media" on storage.objects
  using (bucket_id = 'media' and private.is_admin());
alter policy "admins delete media" on storage.objects
  using (bucket_id = 'media' and private.is_admin());

drop function public.is_admin();
