import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckIcon, ShoppingBagIcon, XIcon } from 'lucide-react';
import { ModelViewer } from '../three/ModelViewer';
import { useCart } from '../../contexts/CartContext';
import {
  cheapestVariant,
  formatPrice,
  isInStock,
  type Product } from
'../../lib/shop/types';

interface ProductDialogProps {
  product: Product | null;
  onClose: () => void;
}

/**
 * The detail view for one piece, over the shop rather than beside it.
 *
 * In a portal, like the lightbox: the cards it opens from sit inside animated,
 * clipped containers, and an overlay rendered in there would be trapped by the
 * first ancestor carrying a transform.
 */
export function ProductDialog({ product, onClose }: ProductDialogProps) {
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = product !== null;

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    // Freeze the shop behind, and put focus somewhere useful inside.
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {product ?
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0.01 : 0.3 }}
        onClick={onClose}
        // Darkened and blurred, so the shop stays there as context without
        // competing with the piece being read.
        className="fixed inset-0 z-[100] overflow-y-auto bg-bg/80 backdrop-blur-xl">

          <motion.div
          key={product.id}
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.01 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="mx-auto my-6 w-full max-w-[1100px] border border-line bg-bg px-4 py-4 sm:px-6 sm:py-6">

            <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                {product.ref} — {product.kind}
              </span>
              <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink">

                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <Detail product={product} />
          </motion.div>
        </motion.div> :
      null}
    </AnimatePresence>,
    document.body
  );
}

/** Split out so its variant choice resets whenever a different piece opens. */
function Detail({ product }: {product: Product;}) {
  const { add } = useCart();
  const [variantId, setVariantId] = useState(() => cheapestVariant(product).id);
  const [justAdded, setJustAdded] = useState(false);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const available = isInStock(variant);

  const addToCart = () => {
    add(product.id, variant.id);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="grid gap-8 pt-6 lg:grid-cols-2 lg:gap-12">
      <div>
        {product.model ?
        <ModelViewer
          url={product.model}
          poster={product.image}
          label={product.ref}
          spec="Live model"
          aspect="aspect-square"
          bleed="4%" /> :

        <div className="relative border border-line bg-surface/40">
            <span
            aria-hidden="true"
            className="absolute -left-px -top-px z-20 h-6 w-6 border-b border-r border-line bg-bg" />

            <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full object-contain p-8" />

          </div>
        }
      </div>

      <div className="flex flex-col">
        <h2 className="font-display text-xl tracking-tight sm:text-2xl">
          {product.name.toUpperCase()}
        </h2>
        <span className="mt-2 font-mono text-lg">
          {formatPrice(variant.priceCents, product.currency)}
        </span>

        <p className="mt-5 text-sm leading-relaxed text-muted">{product.blurb}</p>

        <dl className="mt-6 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
          {[
          ['Finish', product.spec],
          ['Dispatch', product.leadTime]].
          map(([term, value]) =>
          <div key={term} className="bg-bg px-4 py-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                {term}
              </dt>
              <dd className="mt-1 text-xs leading-relaxed">{value}</dd>
            </div>
          )}
        </dl>

        <fieldset className="mt-6">
          <legend className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {product.variants.length > 1 ? 'Size' : 'Edition'}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const active = v.id === variant.id;
              const sold = !isInStock(v);
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  aria-pressed={active}
                  className={`border px-3 py-2 font-mono text-[11px] tracking-[0.12em] transition-colors ${
                  active ?
                  'border-ink text-ink' :
                  'border-line text-muted hover:border-ink hover:text-ink'} ${
                  sold ? 'line-through opacity-50' : ''}`}>

                  {v.label}
                </button>);

            })}
          </div>
        </fieldset>

        {/* Stock is per variant, so it is stated beside the button that acts on
            that variant rather than once for the whole piece. */}
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {variant.stock === null ?
          'Made to order' :
          available ?
          `${variant.stock} in stock` :
          'Sold out'}
        </p>

        <button
          type="button"
          onClick={addToCart}
          disabled={!available}
          className="group relative mt-4 flex items-center justify-center gap-2 overflow-hidden rounded-full border border-ink px-5 py-3 text-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-40">

          <span
            aria-hidden="true"
            className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-y-100 group-disabled:scale-y-0" />

          {justAdded ?
          <>
              <CheckIcon
              className="relative h-4 w-4 transition-colors group-hover:text-bg"
              aria-hidden="true" />

              <span className="relative transition-colors group-hover:text-bg">
                Added to cart
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
    </div>);

}
