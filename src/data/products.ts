import { asset } from '../lib/asset';

export interface Product {
  id: string;
  ref: string;
  name: string;
  kind: string;
  spec: string;
  price: string;
  image: string;
}

export const products: Product[] = [
{
  id: 'poster',
  ref: 'ART—01',
  name: 'Overgrown Archway',
  kind: 'Poster · Fine art print',
  spec: '50 × 70 cm · 250 g matte paper · wooden frame',
  price: '€60',
  image: asset("/e1e17ece-3536-4658-8366-054d1a488184.jpg")

},
{
  id: 'figurine',
  ref: 'ART—02',
  name: 'Multi-Armed Sentinel',
  kind: 'Figurine · Resin print',
  spec: '18 cm · unpainted grey resin · numbered base',
  price: '€85',
  image: asset("/7ab25f06-90b6-4850-afe4-4681b4a891d1.jpg")

},
{
  id: 'diorama',
  ref: 'ART—03',
  name: 'Crash Site / DUSK',
  kind: 'Diorama · Resin print',
  spec: '24 × 16 cm · hand painted · display base',
  price: '€140',
  image: asset("/bb37fb43-04fa-4d66-a777-0f4f54580530.jpg")

}];