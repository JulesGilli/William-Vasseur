import { Suspense, lazy } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useInView } from '../../hooks/useInView';

// ogl only ships to visitors who actually reach a section that uses this.
const Topography = lazy(() => import('./Topography'));

interface TopographyBackdropProps {
  /** Contour density. Lower reads calmer behind body copy. */
  bands?: number;
  opacity?: number;
  /** How far the field drifts against the page scroll, as % of its own height. */
  parallax?: number;
  className?: string;
}

/**
 * Drop-in replacement for the `blueprint-grid` background on a section.
 *
 * Paints an opaque plate first so the page-wide grid does not show through and
 * collide with the contours, then lays the shader over it on a layer that
 * drifts against the scroll, which reads as depth behind the content.
 */
export function TopographyBackdrop({
  bands = 2.5,
  opacity = 0.5,
  parallax = 8,
  className = '',
}: TopographyBackdropProps) {
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '300px 0px', once: true });
  const dark = theme === 'dark';

  // 0 as the section enters from the bottom, 1 as it leaves past the top.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ['0%', '0%'] : [`-${parallax}%`, `${parallax}%`]
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      // Deliberately hit-testable: the cursor bump in the shader needs
      // mousemove. Content sits on a `relative` layer above, so links, buttons
      // and text selection are unaffected.
      className={`absolute inset-0 overflow-hidden bg-bg ${className}`}>

      {/* Overscanned well past the drift range so no edge is ever exposed. */}
      <motion.div className="absolute inset-x-0 -inset-y-[20%]" style={{ y }}>
        {inView ?
        <Suspense fallback={null}>
            <Topography
            // Ridges take the ink colour, valleys fade toward the muted tone,
            // so the field reads as drawn in the same pen as the rest.
            lowColor={dark ? '#f1f1f1' : '#0c0c0c'}
            midColor={dark ? '#6a6a6a' : '#9a9a9a'}
            highColor={dark ? '#f1f1f1' : '#0c0c0c'}
            speed={0.35}
            morphAmount={2.4}
            morphSpeed={0.05}
            bands={bands}
            thickness={0.01}
            scale={1.0}
            pixelSize={1.0}
            glow={0.5}
            colorMode="elevation"
            contrast={3.0}
            brightness={dark ? 0.8 : 1.0}
            fillBands={false}
            // Dark ink on the light sheet carries far more contrast than light
            // ink on the dark one, so it needs pulling back off the body copy.
            opacity={dark ? opacity : opacity * 0.6}
            grain
            grainIntensity={0.05}
            mouseInteraction
            mouseRadius={0.3}
            mouseStrength={0.4} />

          </Suspense> :
        null}
      </motion.div>
    </div>);

}
