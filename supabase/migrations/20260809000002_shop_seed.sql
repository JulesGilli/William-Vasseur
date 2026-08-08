-- Initial catalogue, mirroring src/data/products.ts at the moment the shop
-- goes live. From then on the database is the source of truth and stock is
-- edited in Supabase, not in the code.

insert into public.products (id, ref, name, kind, blurb, spec, image, model, currency, lead_time, position) values
(
  'canal-arches-print',
  'ART—01',
  'Canal Arches of Seville',
  'Poster · Fine art print',
  'Terraced arcades over still water, printed with a wide gamut so the reds in the stonework survive the paper.',
  '250 g matte fine art paper · solid oak frame · signed',
  '/models/posters/canal-arches.webp',
  '/models/canal-arches.glb',
  'EUR',
  'Printed to order · ships in 5–7 days',
  0
),
(
  'colossus-figurine',
  'ART—02',
  'Clockwork Colossus',
  'Figurine · Resin print',
  'Six limbs, pressure tanks and hose runs, printed at a layer height fine enough to hold the panel lines.',
  'Unpainted grey resin · numbered base · hand-finished',
  '/models/posters/clockwork-colossus.webp',
  '/models/clockwork-colossus.glb',
  'EUR',
  'Cast in small batches · ships in 2–3 weeks',
  1
),
(
  'crash-landed-diorama',
  'ART—03',
  'Crash Landed / Planet Unknown',
  'Diorama · Scale 1/144',
  'A freighter down on dead rock, hand-painted and weathered, mounted on an engraved plate.',
  '24 × 18 cm · hand-painted resin · engraved plate',
  '/models/posters/crash-landed.webp',
  '/models/crash-landed.glb',
  'EUR',
  'Built to order · ships in 4–6 weeks',
  2
);

insert into public.variants (sku, product_id, id, label, price_cents, stock, position) values
('WV-ART01-A3', 'canal-arches-print', 'a3', '30 × 40 cm', 4000, null, 0),
('WV-ART01-A2', 'canal-arches-print', 'a2', '50 × 70 cm', 6000, null, 1),
('WV-ART01-A1', 'canal-arches-print', 'a1', '70 × 100 cm', 9500, null, 2),
('WV-ART02-12', 'colossus-figurine', '12cm', '12 cm', 6500, 6, 0),
('WV-ART02-18', 'colossus-figurine', '18cm', '18 cm', 8500, 2, 1),
('WV-ART02-28', 'colossus-figurine', '28cm', '28 cm', 16000, 0, 2),
('WV-ART03-STD', 'crash-landed-diorama', 'standard', 'Standard finish', 18000, 3, 0),
('WV-ART03-LIT', 'crash-landed-diorama', 'lit', 'Lit edition', 24000, 1, 1);
