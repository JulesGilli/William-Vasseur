-- Four languages, shipping fees and the seller's legal details.
--
-- Translations travel with the thing they translate. Inside jsonb content
-- (site_content values, a project's renders and stages) each object carries
-- its own "_i18n": { fr: {…}, de: {…}, es: {…} } — so reordering a list in
-- the editor moves the translations with the items. Rows that are columns
-- rather than jsonb get the same overlay in an "i18n" column. English is the
-- base; a missing translation falls back to it.

alter table public.projects add column i18n jsonb not null default '{}';
alter table public.products add column i18n jsonb not null default '{}';
alter table public.variants add column i18n jsonb not null default '{}';

-- Sets a value at any depth, creating the objects on the way down, which
-- jsonb_set alone refuses to do. Used by the translation seed.
create or replace function private.jsonb_put(target jsonb, path text[], val jsonb)
returns jsonb
language plpgsql
immutable
as $$
begin
  if array_length(path, 1) = 1 then
    return jsonb_set(coalesce(target, '{}'), path, val, true);
  end if;
  return jsonb_set(
    coalesce(target, '{}'),
    path[1:1],
    private.jsonb_put(target #> path[1:1], path[2:], val),
    true
  );
end;
$$;

-- Shipping: one fee for France, one for the rest of Europe, and an order
-- value from which it is free (0 = never). Cents, like every other amount.
-- All zero until William sets them, which is what checkout charged before.
insert into public.site_content (key, value) values
  ('shipping', '{"franceCents": 0, "europeCents": 0, "freeFromCents": 0}'),
  -- Who is selling: required on a French shop's legal pages. Empty until
  -- William fills them in; the site keeps the pages out of its footer until
  -- the name, SIRET and address are there.
  ('legal', '{"name": "", "siret": "", "address": "", "email": "", "mediator": "", "mediatorUrl": ""}')
on conflict (key) do nothing;

-- The country the buyer chose in the cart, and what shipping cost them.
alter table public.orders add column country text;
alter table public.orders add column shipping_cents int;
