import { asset } from '../lib/asset';
import type { Product } from '../lib/shop/types';

/**
 * The catalogue as the front end sees it. Shaped exactly like the payload a
 * backend would return, so `listProducts` can start fetching without any of
 * the UI changing.
 */
export const products: Product[] = [
{
  id: 'canal-arches-print',
  ref: 'ART—01',
  name: 'Canal Arches of Seville',
  kind: 'Poster · Fine art print',
  family: 'Poster',
  blurb:
  'Terraced arcades over still water, printed with a wide gamut so the reds in the stonework survive the paper.',
  spec: '250 g matte fine art paper · solid oak frame · signed',
  image: asset('/models/posters/canal-arches.webp'),
  // No `model`: a poster is a flat print, and offering to turn it around in
  // 3D sells the scene rather than the thing in the frame. The mesh belongs
  // to the artwork on the projects sheet.
  currency: 'EUR',
  leadTime: 'Printed to order · ships in 5–7 days',
  variants: [
  { id: 'a3', label: '30 × 40 cm', priceCents: 4000, sku: 'WV-ART01-A3', stock: null },
  { id: 'a2', label: '50 × 70 cm', priceCents: 6000, sku: 'WV-ART01-A2', stock: null },
  { id: 'a1', label: '70 × 100 cm', priceCents: 9500, sku: 'WV-ART01-A1', stock: null }]

},
{
  id: 'colossus-figurine',
  ref: 'ART—02',
  name: 'Clockwork Colossus',
  kind: 'Figurine · Resin print',
  family: 'Figurine',
  blurb:
  'Six limbs, pressure tanks and hose runs, printed at a layer height fine enough to hold the panel lines.',
  spec: 'Unpainted grey resin · numbered base · hand-finished',
  image: asset('/models/posters/clockwork-colossus.webp'),
  model: asset('/models/clockwork-colossus.glb'),
  currency: 'EUR',
  leadTime: 'Cast in small batches · ships in 2–3 weeks',
  variants: [
  { id: '12cm', label: '12 cm', priceCents: 6500, sku: 'WV-ART02-12', stock: 6 },
  { id: '18cm', label: '18 cm', priceCents: 8500, sku: 'WV-ART02-18', stock: 2 },
  { id: '28cm', label: '28 cm', priceCents: 16000, sku: 'WV-ART02-28', stock: 0 }]

},
{
  id: 'crash-landed-diorama',
  ref: 'ART—03',
  name: 'Crash Landed / Planet Unknown',
  kind: 'Diorama · Scale 1/144',
  family: 'Diorama',
  blurb:
  'A freighter down on dead rock, hand-painted and weathered, mounted on an engraved plate.',
  spec: '24 × 18 cm · hand-painted resin · engraved plate',
  image: asset('/models/posters/crash-landed.webp'),
  model: asset('/models/crash-landed.glb'),
  currency: 'EUR',
  leadTime: 'Built to order · ships in 4–6 weeks',
  variants: [
  { id: 'standard', label: 'Standard finish', priceCents: 18000, sku: 'WV-ART03-STD', stock: 3 },
  { id: 'lit', label: 'Lit edition', priceCents: 24000, sku: 'WV-ART03-LIT', stock: 1 }]

}];
