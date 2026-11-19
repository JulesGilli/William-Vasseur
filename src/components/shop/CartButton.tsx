import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBagIcon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { t } from '../../i18n';

export function CartButton() {
  const { totals, open } = useCart();
  const count = totals.itemCount;

  return (
    <button
      type="button"
      onClick={open}
      aria-label={
      count === 0 ? t.cart.buttonEmpty : t.cart.button(count)
      }
      className="relative flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-ink">

      <ShoppingBagIcon className="h-[18px] w-[18px]" aria-hidden="true" />

      <AnimatePresence>
        {count > 0 ?
        <motion.span
          key={count}
          aria-hidden="true"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 480, damping: 24 }}
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 font-mono text-[9px] leading-none text-bg">

            {count}
          </motion.span> :
        null}
      </AnimatePresence>
    </button>);

}
