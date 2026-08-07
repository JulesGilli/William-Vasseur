import { motion, useReducedMotion } from 'framer-motion';
import { SplitText } from './motion/SplitText';

interface SectionHeadingProps {
  index: string;
  title: string;
  align?: 'left' | 'right';
  id?: string;
}

export function SectionHeading({
  index,
  title,
  align = 'left',
  id
}: SectionHeadingProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`flex flex-col gap-2 ${
      align === 'right' ? 'items-end text-right' : 'items-start text-left'}`
      }>

      <motion.span
        className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: reduced ? 0.01 : 0.6 }}>

        {index}
      </motion.span>

      <SplitText
        id={id}
        text={title}
        delay={0.08}
        className="font-display text-2xl leading-tight tracking-tight sm:text-3xl" />


      {/* The rule inks itself in from whichever edge the heading is anchored to. */}
      <motion.span
        aria-hidden="true"
        className={`h-px w-16 bg-ink opacity-40 ${
        align === 'right' ? 'origin-right' : 'origin-left'}`
        }
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: reduced ? 0.01 : 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }} />

    </div>);

}
