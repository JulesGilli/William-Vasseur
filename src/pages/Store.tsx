import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRightIcon, CheckIcon, Rotate3dIcon, ShoppingBagIcon, XIcon } from 'lucide-react';
import { BlueprintFrame } from '../components/BlueprintFrame';
import { ModelViewer } from '../components/three/ModelViewer';
import { ProductDialog } from '../components/shop/ProductDialog';
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
import { t } from '../i18n';
import { site } from '../data/content';

function ProductCard({
  product,
  index,
  onOpen
}: {
  product: Product;
  index: number;
  onOpen: (product: Product) => void;
}) {
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
    // Each card is eight rows of the shelf's own grid (subgrid), so the size
    // picker, the stock line and the buttons sit at the same height on every
    // card in a row, however long each description runs.
    <Reveal as="li" delay={index * 0.08} className="row-span-8 grid grid-rows-subgrid gap-y-0 pb-14">
      <div className="group relative">
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
              spec={t.viewer.live}
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

        {/* Sits over the still rather than wrapping it: the frame contains
            the 3D canvas and its own controls once inspecting, and a button
            cannot hold buttons. Hidden while inspecting so the canvas keeps
            the pointer. */}
        {!inspecting ?
        <button
          type="button"
          onClick={() => onOpen(product)}
          aria-label={t.store.details(product.name)}
          className="absolute inset-0 z-20 flex items-end justify-center pb-6">

            <span className="border border-line bg-bg/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              {t.store.viewDetails}
            </span>
          </button> :
        null}

        {product.model ?
        <button
          type="button"
          onClick={() => setInspecting((v) => !v)}
          className="absolute -bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 border border-line bg-bg px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-ink hover:text-ink">

            {inspecting ?
          <>
                <XIcon className="h-3 w-3" aria-hidden="true" />
                {t.store.close3d}
              </> :

          <>
                <Rotate3dIcon className="h-3 w-3" aria-hidden="true" />
                {t.store.inspect3d}
              </>
          }
          </button> :
        null}
      </div>

        <span className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
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
            {product.variants.length > 1 ? t.store.size : t.store.edition}
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
          t.store.left(variant.stock, product.leadTime) :
          t.store.soldOutSize}
        </p>

        <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onOpen(product)}
          className="rounded-full border border-line px-4 py-2.5 text-sm text-muted transition-colors hover:border-ink hover:text-ink">

          {t.store.viewDetails}
        </button>
        <button
          type="button"
          onClick={addToCart}
          disabled={!available}
          className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full border border-ink px-5 py-2.5 text-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-40">

          <span
            aria-hidden="true"
            className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-y-100 group-disabled:scale-y-0" />

          {justAdded ?
          <>
              <CheckIcon
              className="relative h-4 w-4 transition-colors group-hover:text-bg"
              aria-hidden="true" />

              <span className="relative transition-colors group-hover:text-bg">
                {t.store.added}
              </span>
            </> :

          <>
              <ShoppingBagIcon
              className="relative h-4 w-4 transition-colors group-hover:text-bg"
              aria-hidden="true" />

              <span className="relative transition-colors group-hover:text-bg">
                {available ? t.store.addToCart : t.store.soldOut}
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

/**
 * The made-to-measure offer, closing the shop. William writes it in the
 * editor (Boutique → Projet sur mesure); until he has, nothing shows.
 */
function Commission() {
  const custom = site.custom;
  if (!custom?.title) return null;
  const email = site.contact.email;
  const subject = encodeURIComponent(custom.title);

  return (
    <section aria-labelledby="commission-title" className="mb-16">
      <BlueprintFrame label={t.store.commission} className="bg-surface/30">
        <div className="grid gap-8 px-6 pb-10 pt-14 sm:px-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16 lg:px-14 lg:pb-14 lg:pt-20">
          <div>
            <h2 id="commission-title" className="font-display text-2xl leading-tight tracking-tight sm:text-4xl">
              {custom.title}
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">{custom.text}</p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <a
              href={`mailto:${email}?subject=${subject}`}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-7 py-3.5 font-display text-sm tracking-tight text-bg">

              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-muted/30 transition-transform duration-500 ease-out group-hover:translate-x-0" />

              <span className="relative">{custom.button}</span>
              <ArrowRightIcon className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </a>
            {/* The address in plain text too: a mail link does nothing on a
                computer without a mail app set up. */}
            <span className="select-all font-mono text-[11px] text-muted">{email}</span>
          </div>
        </div>
      </BlueprintFrame>
    </section>);

}

export function Store() {
  const { products, loading, error, clear } = useCart();
  const checkoutOutcome = useCheckoutReturn(clear);
  const [filter, setFilter] = useState<string>('All');
  const [detail, setDetail] = useState<Product | null>(null);

  // /store?product=<id> opens straight onto a piece, which is what a "shop
  // this poster" link from a project needs to land on. Read once the
  // catalogue is in, and scrubbed from the URL so a refresh is not a
  // different page from a reload.
  const wanted = new URLSearchParams(window.location.search).get('product');
  useEffect(() => {
    if (!wanted || loading) return;
    const match = products.find((product) => product.id === wanted);
    if (match) setDetail(match);
    const url = new URL(window.location.href);
    url.searchParams.delete('product');
    window.history.replaceState({}, '', url);
  }, [wanted, loading, products]);

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
          {t.store.sheet}
        </span>
        <SplitText
          as="h1"
          by="letter"
          text={t.store.title}
          className="mt-3 font-display text-3xl tracking-tight sm:text-5xl" />

        <Reveal delay={0.15}>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            {t.store.intro}
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
              <span className="relative">{family === 'All' ? t.projects.all : t.store.families[family] ?? family}</span>
            </button>);

        })}
        <span className="ml-auto font-mono text-[11px] text-muted">
          {t.projects.items(visible.length.toString().padStart(2, '0'))}
        </span>
      </div>

      {checkoutOutcome ?
      <p
        role="status"
        className="mt-6 border border-line px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">

          {checkoutOutcome === 'success' ?
        t.store.success :
        t.store.cancelled}
        </p> :
      null}

      {!isBackendConnected ?
      <p
        role="status"
        className="mt-6 border border-line px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">

          {t.store.preview}
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
          {t.store.emptyShelf}
        </p> :

      <ul className="grid gap-x-10 gap-y-0 pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product, i) =>
        <ProductCard
          key={product.id}
          product={product}
          index={i}
          onOpen={setDetail} />

        )}
        </ul>
      }

      <p className="border-t border-line py-8 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        {t.store.more}
      </p>

      <Commission />

      <ProductDialog product={detail} onClose={() => setDetail(null)} />
    </main>);

}
