import { asset } from '../asset';
import { products } from '../../data/products';
import { site } from '../../data/content';
import { lang, localize, t } from '../../i18n';
import type { CartLine, CheckoutResult, Product, ShipCountry, ShippingRates, ShopApi } from './types';

/**
 * The one file to replace when a backend exists.
 *
 * Everything the shop needs from a server is behind `ShopApi`, so the UI never
 * imports the catalogue directly and never assumes the data is local. Swapping
 * this for `fetch` calls changes nothing above it.
 */

/** Set to a backend origin to switch over, e.g. VITE_SHOP_API=https://api.example.com */
const API_BASE = import.meta.env.VITE_SHOP_API as string | undefined;

const NO_FEES: ShippingRates = { franceCents: 0, europeCents: 0, freeFromCents: 0 };

const localApi: ShopApi = {
  async listProducts() {
    return products;
  },

  async getShipping() {
    return site.shipping ?? NO_FEES;
  },

  async createCheckout() {
    // Deliberately not faked. Prices and stock have to be re-checked server
    // side and a payment session created there — a client cannot do either,
    // and pretending otherwise would hide the missing half of the feature.
    return {
      status: 'unavailable',
      reason: t.cart.noBackend,
    };
  },
};

const remoteApi = (base: string): ShopApi => ({
  async listProducts() {
    const res = await fetch(`${base}/products`);
    if (!res.ok) throw new Error(`${t.store.unavailable} (${res.status})`);
    // Served with every translation alongside; folded to this visit's.
    const items = localize((await res.json()) as Product[], lang);
    // The backend stores either a repository path ("/models/…") or, for what
    // William uploaded, a storage key. Publishing copies every upload into
    // the site under /media/ — optimising 3D on the way — so a key resolves
    // to that copy, never to the raw multi-megabyte upload in storage.
    const media = (ref: string) => asset(ref.startsWith('/') ? ref : `/media/${ref}`);
    return items.map((p) => ({
      ...p,
      image: media(p.image),
      model: p.model ? media(p.model) : undefined,
    }));
  },

  async getShipping() {
    const res = await fetch(`${base}/shipping`);
    // A failed lookup must not block the shop; the payment page states the
    // real fee either way.
    return res.ok ? ((await res.json()) as ShippingRates) : site.shipping ?? NO_FEES;
  },

  async createCheckout(lines: CartLine[], country: ShipCountry) {
    const res = await fetch(`${base}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Only identifiers and quantities travel: the server prices the order.
      // The language rides along so the payment page and its line items
      // read the same as the shop did.
      body: JSON.stringify({ lines, country, lang }),
    });
    if (!res.ok) {
      return { status: 'unavailable', reason: t.cart.refused(res.status) };
    }
    const { url } = (await res.json()) as { url: string };
    return { status: 'redirect', url };
  },
});

export const shopApi: ShopApi = API_BASE ? remoteApi(API_BASE) : localApi;

export const isBackendConnected = Boolean(API_BASE);

export type { CheckoutResult };
