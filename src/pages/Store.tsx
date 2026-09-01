import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckIcon, Rotate3dIcon, ShoppingBagIcon, XIcon } from 'lucide-react';
import { BlueprintFrame } from '../components/BlueprintFrame';
import { ModelViewer } from '../components/three/ModelViewer';
import { SplitText } from '../components/motion/SplitText';
import { Reveal } from '../components/motion/Reveal';
import { useCart } from '../contexts/CartContext';
import { isBackendConnected } from '../lib/shop/api';
import {
  cheapestVariant,
  formatPrice,
  isInStock,
  productFamilies,
  type Product } from
'../lib/shop/types';

function ProductCard({ product, index }: {product: Product;index: number;}) {
  const reduced = useReducedMotion();
  const { add } = useCart();
  const [variantId, setVariantId] = useState(() => cheapestVariant(product).id);
  const [inspecting, setInspecting] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const available = isInStock(variant);

  const addToCart = () => {
    add(product.id, variant.id);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <Reveal as="li" delay={index * 0.08} className="flex flex-col">
      <div className="relative">
        <AnimatePresence mode="wait">
          {inspecting && product.model ?
          <motion.div
            key="viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}>

              <ModelViewer
              url={product.model}
              poster={product.image}
              label={product.ref}
              spec="Live model"
              aspect="aspect-square"
              bleed="6%" />

            </motion.div> :

          <motion.div
            key="still"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}>

              <BlueprintFrame label={product.ref}>
                <div className="overflow-hidden bg-surface/40">
                  <motion.img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="aspect-square w-full object-contain p-6"
                  whileHover={reduced ? undefined : { scale: 1.06 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} />

                </div>
              </BlueprintFrame>
            </motion.div>
          }
        </AnimatePresence>

        {product.model ?
        <button
          type="button"
          onClick={() => setInspecting((v) => !v)}
          className="absolute -bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 border border-line bg-bg px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-ink hover:text-ink">

            {inspecting ?
          <>
                <XIcon className="h-3 w-3" aria-hidden="true" />
                Close 3D
              </> :

          <>
                <Rotate3dIcon className="h-3 w-3" aria-hidden="true" />
                Inspect in 3D
              </>
          }
          </button> :
        null}
      </div>

      <div className="mt-8 flex flex-1 flex-col">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {product.kind}
        </span>
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <h2 className="font-display text-sm tracking-tight">
            {product.name.toUpperCase()}
          </h2>
          <span className="font-mono text-sm">
            {formatPrice(variant.priceCents, product.currency)}
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-muted">{product.blurb}</p>
        <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted">
          {product.spec}
        </p>

        {/* Variants carry their own price and stock, so picking one changes
            both the figure above and whether the button is live. */}
        <fieldset className="mt-4">
          <legend className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {product.variants.length > 1 ? 'Size' : 'Edition'}
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const active = v.id === variant.id;
              const sold = !isInStock(v);
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  aria-pressed={active}
                  className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                  active ?
                  'border-ink text-ink' :
                  'border-line text-muted hover:border-ink hover:text-ink'} ${

                  sold ? 'line-through opacity-50' : ''}`}>

                  {v.label}
                </button>);

            })}
          </div>
        </fieldset>

        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {available ?
          variant.stock === null ?
          product.leadTime :
          `${variant.stock} left · ${product.leadTime}` :
          'Sold out in this size'}
        </p>

        <button
          type="button"
          onClick={addToCart}
          disabled={!available}
          className="group relative mt-4 flex items-center justify-center gap-2 overflow-hidden rounded-full border border-ink px-5 py-2.5 text-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-40">

          <span
            aria-hidden="true"
            className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-y-100 group-disabled:scale-y-0" />

          {justAdded ?
          <>
              <CheckIcon
              className="relative h-4 w-4 transition-colors group-hover:text-bg"
              aria-hidden="true" />

              <span className="relative transition-colors group-hover:text-bg">
                Added
              </span>
            </> :

          <>
              <ShoppingBagIcon
              className="relative h-4 w-4 transition-colors group-hover:text-bg"
              aria-hidden="true" />

              <span className="relative transition-colors group-hover:text-bg">
                {available ? 'Add to cart' : 'Sold out'}
              </span>
            </>
          }
        </button>
      </div>
    </Reveal>);

}

/**
 * Stripe sends the buyer back to /store?checkout=success|cancelled. Read it
 * once, scrub the URL so refreshes stay clean, and clear the cart only on a
 * success — a cancelled checkout keeps the basket for a second try.
 */
function useCheckoutReturn(clear: () => void): 'success' | 'cancelled' | null {
  const [outcome] = useState<'success' | 'cancelled' | null>(() => {
    const value = new URLSearchParams(window.location.search).get('checkout');
    return value === 'success' || value === 'cancelled' ? value : null;
  });

  useEffect(() => {
    if (!outcome) return;
    if (outcome === 'success') clear();
    const url = new URL(window.location.href);
    url.searchParams.delete('checkout');
    window.history.replaceState(null, '', url);
    // Runs once for the value read at mount; `clear` is stable in context.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  return outcome;
}

export function Store() {
  const { products, loading, error, clear } = useCart();
  const checkoutOutcome = useCheckoutReturn(clear);
  const [filter, setFilter] = useState<string>('All');

  // The whole vocabulary, not just what is in stock today, so the shelves the
  // shop is meant to carry are visible even before every one of them is full.
  const filters = useMemo(() => ['All', ...productFamilies], []);
  const visible = useMemo(
    () =>
    filter === 'All' ?
    products :
    products.filter((product) => product.family === filter),
    [filter, products]
  );

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
      <header className="border-b border-line pb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          Index / Sheet 03
        </span>
        <SplitText
          as="h1"
          by="letter"
          text="STORE"
          className="mt-3 font-display text-3xl tracking-tight sm:text-5xl" />

        <Reveal delay={0.15}>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Prints, figurines and dioramas — produced in small numbered batches
            from my own files, shipped from Toulouse. Turn any of them over in
            3D before you decide.
          </p>
        </Reveal>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-line py-4">
        {filters.map((family) => {
          const active = family === filter;
          return (
            <button
              key={family}
              type="button"
              onClick={() => setFilter(family)}
              aria-pressed={active}
              className={`relative rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${
              active ?
              'border-ink text-bg' :
              'border-line text-muted hover:border-ink hover:text-ink'}`
              }>

              {active ?
              <motion.span
                layoutId="store-filter-pill"
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }} /> :

              null}
              <span className="relative">{family}</span>
            </button>);

        })}
        <span className="ml-auto font-mono text-[11px] text-muted">
          {visible.length.toString().padStart(2, '0')} items
        </span>
      </div>

      {checkoutOutcome ?
      <p
        role="status"
        className="mt-6 border border-line px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">

          {checkoutOutcome === 'success' ?
        'Order received — a confirmation is on its way to your inbox. Thank you.' :
        'Checkout cancelled — your cart is untouched.'}
        </p> :
      null}

      {!isBackendConnected ?
      <p
        role="status"
        className="mt-6 border border-line px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">

          Storefront preview — the cart works, but no payment backend is
          connected yet, so orders cannot be placed.
        </p> :
      null}

      {error ?
      <p
        role="alert"
        className="py-24 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted">

          {error}
        </p> :
      loading ?
      <ul className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) =>
        <li key={i} className="animate-pulse">
              <div className="aspect-square w-full border border-line bg-surface/40" />
              <div className="mt-8 h-3 w-1/3 bg-line" />
              <div className="mt-3 h-3 w-2/3 bg-line" />
            </li>
        )}
        </ul> :

      visible.length === 0 ?
      <p className="py-24 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Nothing on this shelf yet.
        </p> :

      <ul className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product, i) =>
        <ProductCard key={product.id} product={product} index={i} />
        )}
        </ul>
      }

      <p className="border-t border-line py-8 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        More pieces in production — check back soon.
      </p>
    </main>);

}
