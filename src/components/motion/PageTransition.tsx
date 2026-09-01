import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/**
 * Wraps each route so navigation fades in instead of snapping, and resets
 * the scroll position — which the router does not do on its own.
 */
export function PageTransition({ children }: {children: React.ReactNode;}) {
  const reduced = useReducedMotion();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.01 : 0.45, ease: [0.16, 1, 0.3, 1] }}>

      {children}
    </motion.div>);

}
