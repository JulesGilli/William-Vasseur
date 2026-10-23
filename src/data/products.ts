import { asset } from '../lib/asset';
import { content } from './content';
import type { Product } from '../lib/shop/types';

/**
 * The catalogue as William last published it, shaped exactly like the
 * payload the shop function returns — so the static store and the live one
 * render the same thing, and switching between them changes nothing above.
 *
 * Prices and stock here are a snapshot for display. Checkout always re-reads
 * both from the database, so a sale can never go through at a stale price.
 */
export const products: Product[] = content.products.map((p) => ({
  ...p,
  image: asset(p.image),
  model: p.model ? asset(p.model) : undefined
}));
