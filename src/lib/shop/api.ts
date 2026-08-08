import { products } from '../../data/products';
import type { CartLine, CheckoutResult, Product, ShopApi } from './types';

/**
 * The one file to replace when a backend exists.
 *
 * Everything the shop needs from a server is behind `ShopApi`, so the UI never
 * imports the catalogue directly and never assumes the data is local. Swapping
 * this for `fetch` calls changes nothing above it.
 */

/** Set to a backend origin to switch over, e.g. VITE_SHOP_API=https://api.example.com */
const API_BASE = import.meta.env.VITE_SHOP_API as string | undefined;

const localApi: ShopApi = {
  async listProducts() {
    return products;
  },

  async createCheckout() {
    // Deliberately not faked. Prices and stock have to be re-checked server
    // side and a payment session created there — a client cannot do either,
    // and pretending otherwise would hide the missing half of the feature.
    return {
      status: 'unavailable',
      reason: 'No payment backend is connected yet.',
    };
  },
};

const remoteApi = (base: string): ShopApi => ({
  async listProducts() {
    const res = await fetch(`${base}/products`);
    if (!res.ok) throw new Error(`Catalogue unavailable (${res.status})`);
    return (await res.json()) as Product[];
  },

  async createCheckout(lines: CartLine[]) {
    const res = await fetch(`${base}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Only identifiers and quantities travel: the server prices the order.
      body: JSON.stringify({ lines }),
    });
    if (!res.ok) {
      return { status: 'unavailable', reason: `Checkout failed (${res.status})` };
    }
    const { url } = (await res.json()) as { url: string };
    return { status: 'redirect', url };
  },
});

export const shopApi: ShopApi = API_BASE ? remoteApi(API_BASE) : localApi;

export const isBackendConnected = Boolean(API_BASE);

export type { CheckoutResult };
