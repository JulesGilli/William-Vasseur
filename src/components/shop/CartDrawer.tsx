import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MinusIcon, PlusIcon, ShoppingBagIcon, XIcon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { shopApi } from '../../lib/shop/api';
import { formatPrice, isInStock } from '../../lib/shop/types';

export function CartDrawer() {
  const reduced = useReducedMotion();
  const { isOpen, close, lines, totals, setQuantity, remove } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [isOpen, close]);

  // A stale message from a previous attempt would be misleading next time.
  useEffect(() => {
    if (!isOpen) setNotice(null);
  }, [isOpen]);

  const checkout = async () => {
    setCheckingOut(true);
    setNotice(null);
    try {
      // Only identifiers and quantities go out; the server does the pricing.
      const result = await shopApi.createCheckout(
        lines.map(({ productId, variantId, quantity }) => ({
          productId,
          variantId,
          quantity,
        }))
      );
      if (result.status === 'redirect') {
        window.location.href = result.url;
      } else {
        setNotice(result.reason);
      }
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'Checkout could not be started.');
    } finally {
      setCheckingOut(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen ?
      <motion.div
        className="fixed inset-0 z-[90]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0.01 : 0.25 }}>

          <div
          className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
          onClick={close}
          aria-hidden="true" />


          <motion.aside
          role="dialog"
          aria-modal="true"
          aria-label="Cart"
          initial={{ x: reduced ? 0 : '100%' }}
          animate={{ x: 0 }}
          exit={{ x: reduced ? 0 : '100%' }}
          transition={{ duration: reduced ? 0.01 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-bg">

            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                Cart · {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
              </span>
              <button
              type="button"
              onClick={close}
              aria-label="Close the cart"
              className="flex h-8 w-8 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink">

                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            {lines.length === 0 ?
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                <ShoppingBagIcon className="h-6 w-6 text-muted" aria-hidden="true" />
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  Nothing in the cart yet
                </p>
              </div> :

          <ul className="flex-1 divide-y divide-line overflow-y-auto">
                {lines.map((line) =>
            <li key={`${line.productId}:${line.variantId}`} className="flex gap-4 p-5">
                    <div className="h-20 w-20 shrink-0 border border-line bg-surface/40">
                      <img
                  src={line.product.image}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain p-1.5" />

                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-display text-sm tracking-tight">
                          {line.product.name.toUpperCase()}
                        </span>
                        <span className="font-mono text-sm">
                          {formatPrice(line.lineTotalCents, line.product.currency)}
                        </span>
                      </div>

                      <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                        {line.variant.label} ·{' '}
                        {formatPrice(line.variant.priceCents, line.product.currency)} each
                      </span>

                      {!isInStock(line.variant) ?
                <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink">
                          Out of stock — will be removed at checkout
                        </span> :
                null}

                      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <div className="flex items-center border border-line">
                          <Step
                    label={`Decrease ${line.product.name}`}
                    onClick={() =>
                    setQuantity(line.productId, line.variantId, line.quantity - 1)
                    }>

                            <MinusIcon className="h-3 w-3" aria-hidden="true" />
                          </Step>
                          <span className="min-w-8 text-center font-mono text-xs">
                            {line.quantity}
                          </span>
                          <Step
                    label={`Increase ${line.product.name}`}
                    disabled={
                    line.variant.stock !== null &&
                    line.quantity >= line.variant.stock
                    }
                    onClick={() =>
                    setQuantity(line.productId, line.variantId, line.quantity + 1)
                    }>

                            <PlusIcon className="h-3 w-3" aria-hidden="true" />
                          </Step>
                        </div>

                        <button
                  type="button"
                  onClick={() => remove(line.productId, line.variantId)}
                  className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted underline-offset-4 transition-colors hover:text-ink hover:underline">

                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
            )}
              </ul>
          }

            <footer className="border-t border-line p-5">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                  Subtotal
                </span>
                <span className="font-display text-lg tracking-tight">
                  {formatPrice(totals.subtotalCents, totals.currency)}
                </span>
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                Shipping and taxes calculated at checkout
              </p>

              {notice ?
            <p
              role="status"
              className="mt-4 border border-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">

                  {notice}
                </p> :
            null}

              <button
              type="button"
              onClick={checkout}
              disabled={lines.length === 0 || checkingOut}
              className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-ink px-6 py-3.5 font-display text-sm tracking-tight text-bg transition-opacity disabled:cursor-not-allowed disabled:opacity-40">

                <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-muted/30 transition-transform duration-500 ease-out group-hover:translate-x-0" />

                <span className="relative">
                  {checkingOut ? 'STARTING CHECKOUT…' : 'CHECKOUT'}
                </span>
              </button>
            </footer>
          </motion.aside>
        </motion.div> :
      null}
    </AnimatePresence>,
    document.body
  );
}

function Step({
  children,
  label,
  onClick,
  disabled
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center text-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-30">

      {children}
    </button>);

}
