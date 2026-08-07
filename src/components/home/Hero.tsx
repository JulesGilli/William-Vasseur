import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownIcon } from 'lucide-react';
import { ModelViewer } from '../three/ModelViewer';
import { projects } from '../../data/projects';

const SIGNATURE = projects[0];

export function Hero() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  // The type drifts up a touch slower than the page, so the two layers separate.
  const titleY = useTransform(scrollY, [0, 600], [0, reduced ? 0 : -70]);
  const titleOpacity = useTransform(scrollY, [0, 480], [1, reduced ? 1 : 0.15]);

  return (
    <section className="relative border-b border-line" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        {/* min-w-0 stops the oversized display type from starving the viewer
            column — fr tracks otherwise refuse to shrink below min-content. */}
        <motion.div className="min-w-0" style={{ y: titleY, opacity: titleOpacity }}>
          <h1
            id="hero-title"
            // Bruno Ace runs ~7.3em wide for these seven letters, and the
            // per-line overflow-hidden used by the reveal would clip any spill,
            // so the sizes below are capped to always fit the column.
            className="font-display text-[12vw] leading-[0.92] tracking-tight sm:text-[9vw] lg:text-[clamp(3rem,6.1vw,5.5rem)]"
            aria-label="William Vasseur">

            {['WILLIAM', 'VASSEUR'].map((line, row) =>
            <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                aria-hidden="true"
                className="block"
                initial={{ y: reduced ? 0 : '110%' }}
                animate={{ y: '0%' }}
                transition={{
                  duration: reduced ? 0.01 : 1,
                  delay: reduced ? 0 : 0.1 + row * 0.11,
                  ease: [0.16, 1, 0.3, 1]
                }}>

                  {line}
                </motion.span>
              </span>
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-5 max-w-md text-sm text-muted lg:ml-[6vw]">

            3D Artist — science-fiction environments, characters and the objects
            they leave behind.
            <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.2em]">
              Toulouse, France
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-14 flex items-center gap-4">

            <span className="flex h-16 w-6 items-center justify-center rounded-full border border-line">
              <span className="rotate-90 font-mono text-[9px] uppercase tracking-[0.28em] text-muted">
                Scroll
              </span>
            </span>
            <motion.span
              animate={reduced ? undefined : { y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-ink"
              aria-hidden="true">

              <ArrowDownIcon className="h-6 w-6" />
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div
          className="min-w-0"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>

          <ModelViewer
            url={SIGNATURE.model}
            poster={SIGNATURE.image}
            label={`${SIGNATURE.ref} — ${SIGNATURE.title}`}
            spec={SIGNATURE.spec}
            aspect="aspect-[4/3]" />


          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Live model · not a render
            </span>
            <div className="flex gap-2" aria-hidden="true">
              {[0, 1, 2].map((dot) =>
              <motion.span
                key={dot}
                className="h-1.5 w-1.5 rounded-full border border-line"
                animate={reduced ? undefined : { opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: dot * 0.3,
                  ease: 'easeInOut'
                }} />

              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}
