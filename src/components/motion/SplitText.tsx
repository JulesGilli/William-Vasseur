import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  /** Words rise one after another; letters is tighter, for short headings. */
  by?: 'word' | 'letter';
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  id?: string;
}

/**
 * Headline reveal: each token is clipped by its own overflow-hidden line box
 * and slides up, which reads like type being set rather than a plain fade.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  by = 'word',
  as = 'h2',
  id,
}: SplitTextProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  const tokens = useMemo(
    () => by === 'word' ? text.split(' ') : Array.from(text),
    [text, by]
  );

  if (reduced) {
    const Plain = as;
    return (
      <Plain id={id} className={className}>
        {text}
      </Plain>);

  }

  return (
    <Component
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ staggerChildren: by === 'word' ? 0.07 : 0.028, delayChildren: delay }}
      aria-label={text}>

      {tokens.map((token, i) =>
      <span
        key={`${token}-${i}`}
        aria-hidden="true"
        className="inline-block overflow-hidden align-bottom"
        // Keeps the descenders of the previous line from being clipped.
        style={{ paddingBottom: '0.08em' }}>

          <motion.span
          className="inline-block"
          variants={{
            hidden: { y: '110%', opacity: 0 },
            visible: { y: '0%', opacity: 1 }
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>

            {token === ' ' ? ' ' : token}
            {by === 'word' && i < tokens.length - 1 ? ' ' : null}
          </motion.span>
        </span>
      )}
    </Component>);

}
