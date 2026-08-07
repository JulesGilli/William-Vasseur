import { motion, useReducedMotion } from 'framer-motion';

interface MarqueeProps {
  items: string[];
  /** Seconds for one full pass. Larger is slower. */
  duration?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * A slow ticker band. The list is rendered twice and translated by exactly
 * -50%, so the seam lands where the copy repeats and the loop is invisible.
 */
export function Marquee({
  items,
  duration = 34,
  reverse = false,
  className = '',
}: MarqueeProps) {
  const reduced = useReducedMotion();
  const track = [...items, ...items];

  return (
    <div
      className={`relative flex overflow-hidden ${className}`}
      // Feather both ends so the band dissolves instead of being cut off.
      style={{
        maskImage:
        'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
        'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}>

      <motion.div
        className="flex shrink-0 items-center gap-8 pr-8"
        animate={reduced ? undefined : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}>

        {track.map((item, i) =>
        <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-8">
            <span className="font-display text-sm tracking-tight text-muted sm:text-base">
              {item}
            </span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ink/30" />
          </span>
        )}
      </motion.div>
    </div>);

}
