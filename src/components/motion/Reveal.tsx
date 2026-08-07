import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  /** Seconds of hold before this element starts. */
  delay?: number;
  /** Direction the element travels in from. */
  from?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article' | 'span';
}

const OFFSET = {
  up: { y: 26, x: 0 },
  down: { y: -26, x: 0 },
  left: { x: 30, y: 0 },
  right: { x: -30, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * The house scroll-in. Everything on the site enters the same way so the page
 * reads as one continuous sheet being drawn rather than a pile of effects.
 */
export function Reveal({
  children,
  delay = 0,
  from = 'up',
  className,
  as = 'div',
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];
  const offset = reduced ? OFFSET.none : OFFSET[from];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
      transition={{
        duration: reduced ? 0.01 : 0.75,
        delay: reduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}>

      {children}
    </Component>);

}
