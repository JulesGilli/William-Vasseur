import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface MarqueeProps {
  items: string[];
  /** Seconds for one copy of the list to pass, so speed is independent of how
   *  many copies it takes to fill the screen. */
  duration?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * A seamless ticker.
 *
 * The loop works by translating the track by exactly one copy's width, which
 * means the number of copies has to be known — and it has to be enough to
 * cover the viewport, or the tail of the list leaves a gap on wide screens.
 * Both are measured rather than assumed.
 */
export function Marquee({
  items,
  duration = 18,
  reverse = false,
  className = '',
}: MarqueeProps) {
  const reduced = useReducedMotion();
  const viewport = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const measure = () => {
      const groupWidth = group.current?.getBoundingClientRect().width ?? 0;
      const viewWidth = viewport.current?.getBoundingClientRect().width ?? 0;
      if (groupWidth <= 0) return;
      // One spare copy beyond what covers the viewport: the seam has to happen
      // off-screen, otherwise the jump back is visible.
      setCopies(Math.max(2, Math.ceil(viewWidth / groupWidth) + 1));
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (viewport.current) observer.observe(viewport.current);
    if (group.current) observer.observe(group.current);
    return () => observer.disconnect();
  }, [items]);

  const shift = 100 / copies;

  return (
    <div
      ref={viewport}
      className={`relative flex overflow-hidden ${className}`}
      // Feather both ends so the band dissolves instead of being cut off.
      style={{
        maskImage:
        'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
        'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}>

      <motion.div
        className="flex"
        animate={
        reduced ?
        undefined :
        { x: reverse ? [`-${shift}%`, '0%'] : ['0%', `-${shift}%`] }
        }
        transition={{ duration, repeat: Infinity, ease: 'linear' }}>

        {Array.from({ length: copies }, (_, copy) =>
        <div
          key={copy}
          // Only the first copy is real content; the rest are padding for the
          // eye and would otherwise be read out repeatedly.
          ref={copy === 0 ? group : undefined}
          aria-hidden={copy > 0}
          className="flex shrink-0 items-center">

            {items.map((item) =>
          <span key={item} className="flex shrink-0 items-center gap-8 pr-8">
                <span className="font-display text-sm tracking-tight text-muted sm:text-base">
                  {item}
                </span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ink/30" />
              </span>
          )}
          </div>
        )}
      </motion.div>
    </div>);

}
