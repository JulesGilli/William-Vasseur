/**
 * Shop domain types.
 *
 * Money is integer minor units (cents) throughout — never a float, and never a
 * pre-formatted string. Formatting happens at the edge, in `formatPrice`.
 */

export type Currency = 'EUR';

export interface ProductVariant {
  id: string;
  /** What the buyer picks between, e.g. "50 × 70 cm". */
  label: string;
  priceCents: number;
  sku: string;
  /** Units on hand. `null` means made to order rather than unlimited. */
  stock: number | null;
}

export interface Product {
  id: string;
  ref: string;
  name: string;
  /** Category line, e.g. "Poster · Fine art print". */
  kind: string;
  blurb: string;
  /** Materials and finish, shown under the name. */
  spec: string;
  image: string;
  /** Present when the piece can be turned around in 3D before buying. */
  model?: string;
  currency: Currency;
  variants: ProductVariant[];
  /** Free-text dispatch estimate, e.g. "Ships in 5–7 days". */
  leadTime: string;
}

/** A line as the cart stores it: identifiers and a quantity, nothing derived. */
export interface CartLine {
  productId: string;
  variantId: string;
  quantity: number;
}

/** A line joined back to its product and variant, ready to render. */
export interface ResolvedCartLine extends CartLine {
  product: Product;
  variant: ProductVariant;
  lineTotalCents: number;
}

export interface CartTotals {
  itemCount: number;
  subtotalCents: number;
  currency: Currency;
}

export type CheckoutResult =
{status: 'redirect';url: string;} |
{status: 'unavailable';reason: string;};

/**
 * The seam a real backend plugs into. Everything the UI needs from a server
 * goes through here, so swapping the mock for an API is one implementation.
 */
export interface ShopApi {
  listProducts(): Promise<Product[]>;
  /** Server-side price and stock check; the client's totals are never trusted. */
  createCheckout(lines: CartLine[]): Promise<CheckoutResult>;
}

const LOCALE = 'fr-FR';

export function formatPrice(cents: number, currency: Currency = 'EUR'): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency,
    // Whole-euro prices read better without trailing zeroes.
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function cheapestVariant(product: Product): ProductVariant {
  return product.variants.reduce((a, b) => a.priceCents <= b.priceCents ? a : b);
}

export function isInStock(variant: ProductVariant): boolean {
  return variant.stock === null || variant.stock > 0;
}

export function lineKey(line: CartLine): string {
  return `${line.productId}:${line.variantId}`;
}
