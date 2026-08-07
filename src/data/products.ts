import { asset } from '../lib/asset';

export interface Product {
  id: string;
  ref: string;
  name: string;
  kind: string;
  spec: string;
  price: string;
  image: string;
  /** Present when the piece can be inspected in 3D before buying. */
  model?: string;
}

export const products: Product[] = [
{
  id: 'canal-arches-print',
  ref: 'ART—01',
  name: 'Canal Arches of Seville',
  kind: 'Poster · Fine art print',
  spec: '50 × 70 cm · 250 g matte paper · solid oak frame',
  price: '€60',
  image: asset('/models/posters/canal-arches.webp'),
  model: asset('/models/canal-arches.glb')
},
{
  id: 'colossus-figurine',
  ref: 'ART—02',
  name: 'Clockwork Colossus',
  kind: 'Figurine · Resin print',
  spec: '18 cm · unpainted grey resin · numbered base',
  price: '€85',
  image: asset('/models/posters/clockwork-colossus.webp'),
  model: asset('/models/clockwork-colossus.glb')
},
{
  id: 'crash-landed-diorama',
  ref: 'ART—03',
  name: 'Crash Landed / Planet Unknown',
  kind: 'Diorama · Scale 1/144',
  spec: '24 × 18 cm · hand-painted resin · engraved plate',
  price: '€180',
  image: asset('/models/posters/crash-landed.webp'),
  model: asset('/models/crash-landed.glb')
}];
