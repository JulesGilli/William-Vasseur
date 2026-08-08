import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState } from
'react';
import { shopApi } from '../lib/shop/api';
import {
  lineKey,
  type CartLine,
  type CartTotals,
  type Product,
  type ResolvedCartLine } from
'../lib/shop/types';

const STORAGE_KEY = 'wv.cart.v1';

interface CartContextValue {
  products: Product[];
  loading: boolean;
  /** Catalogue failed to load; the shop shows this rather than an empty grid. */
  error: string | null;
  lines: ResolvedCartLine[];
  totals: CartTotals;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (productId: string, variantId: string, quantity?: number) => void;
  setQuantity: (productId: string, variantId: string, quantity: number) => void;
  remove: (productId: string, variantId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function readStored(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Anything malformed is dropped rather than trusted: this survived a page
    // reload, and the catalogue may have changed underneath it since.
    return parsed.filter(
      (l): l is CartLine =>
      typeof l?.productId === 'string' &&
      typeof l?.variantId === 'string' &&
      Number.isFinite(l?.quantity) &&
      l.quantity > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: {children: React.ReactNode;}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<CartLine[]>(readStored);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    shopApi.
    listProducts().
    then((list) => {
      if (alive) setProducts(list);
    }).
    catch((e: unknown) => {
      if (alive) setError(e instanceof Error ? e.message : 'Catalogue unavailable');
    }).
    finally(() => {
      if (alive) setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {
      // Private browsing and full quotas both land here; losing persistence is
      // not worth breaking the cart over.
    }
  }, [raw]);

  // Joining here means a line whose product or variant has since disappeared
  // simply stops rendering, instead of crashing the drawer.
  const lines = useMemo<ResolvedCartLine[]>(() => {
    return raw.
    map((line) => {
      const product = products.find((p) => p.id === line.productId);
      const variant = product?.variants.find((v) => v.id === line.variantId);
      if (!product || !variant) return null;
      return {
        ...line,
        product,
        variant,
        lineTotalCents: variant.priceCents * line.quantity,
      };
    }).
    filter((l): l is ResolvedCartLine => l !== null);
  }, [raw, products]);

  const totals = useMemo<CartTotals>(
    () => ({
      itemCount: lines.reduce((n, l) => n + l.quantity, 0),
      subtotalCents: lines.reduce((n, l) => n + l.lineTotalCents, 0),
      currency: lines[0]?.product.currency ?? 'EUR',
    }),
    [lines]
  );

  const add = useCallback(
    (productId: string, variantId: string, quantity = 1) => {
      setRaw((prev) => {
        const key = lineKey({ productId, variantId, quantity });
        const existing = prev.find((l) => lineKey(l) === key);
        if (existing) {
          return prev.map((l) =>
          lineKey(l) === key ? { ...l, quantity: l.quantity + quantity } : l
          );
        }
        return [...prev, { productId, variantId, quantity }];
      });
      setIsOpen(true);
    },
    []
  );

  const setQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      const key = lineKey({ productId, variantId, quantity });
      setRaw((prev) =>
      quantity <= 0 ?
      prev.filter((l) => lineKey(l) !== key) :
      prev.map((l) => lineKey(l) === key ? { ...l, quantity } : l)
      );
    },
    []
  );

  const remove = useCallback((productId: string, variantId: string) => {
    const key = lineKey({ productId, variantId, quantity: 0 });
    setRaw((prev) => prev.filter((l) => lineKey(l) !== key));
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      products,
      loading,
      error,
      lines,
      totals,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQuantity,
      remove,
      clear: () => setRaw([]),
    }),
    [products, loading, error, lines, totals, isOpen, add, setQuantity, remove]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
