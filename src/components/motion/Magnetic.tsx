import React, { useCallback, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

interface MagneticProps {
  children: React.ReactNode;
  /** How far the element is allowed to lean toward the pointer, in px. */
  strength?: number;
  className?: string;
}

/**
 * Pulls its child a little toward the cursor. Pointer-driven only — it never
 * runs on touch, where there is no hover to respond to.
 */
export function Magnetic({ children, strength = 14, className }: MagneticProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 180, damping: 15, mass: 0.4 });

  const onMove = useCallback(
    (event: React.PointerEvent) => {
      if (reduced || event.pointerType !== 'mouse') return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      x.set((dx / (rect.width / 2)) * strength);
      y.set((dy / (rect.height / 2)) * strength);
    },
    [reduced, strength, x, y]
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      style={{ x: springX, y: springY }}>

      {children}
    </motion.div>);

}
