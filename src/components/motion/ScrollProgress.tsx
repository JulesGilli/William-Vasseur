import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * The hairline under the header that fills as the sheet is read. Sits on the
 * header's own border so it reads as that line being inked in.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.span
      aria-hidden="true"
      className="absolute -bottom-px left-0 right-0 h-px origin-left bg-ink"
      style={{ scaleX }} />);


}
