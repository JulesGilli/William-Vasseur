import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { OrbitIcon, PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useInView } from '../../hooks/useInView';

// three.js, fiber and drei all land in this chunk and nowhere else.
const ModelScene = lazy(() => import('./ModelScene'));

interface ModelViewerProps {
  url: string;
  /** Still frame shown until the canvas takes over. */
  poster?: string;
  label?: string;
  /** Small technical caption, e.g. "GLB · 26K TRIS". */
  spec?: string;
  className?: string;
  /** Tailwind aspect utility for the frame. */
  aspect?: string;
  /**
   * How far the canvas spills past the frame, as a CSS length. The mesh is
   * fitted to the canvas, so this is what makes it break the border — and it
   * is the overhang that overlaps whatever sits alongside, which is the point.
   */
  bleed?: string;
  /** How much of the canvas the mesh fills. Below 1 over-fills; needs bleed. */
  fit?: number;
}

export function ModelViewer({
  url,
  poster,
  label = 'Model',
  spec,
  className = '',
  aspect = 'aspect-[4/3]',
  bleed = '8%',
  fit = 1.18,
}: ModelViewerProps) {
  const { theme } = useTheme();
  // Start work a screen early so the model is usually ready on arrival.
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '400px 0px' });
  const [ready, setReady] = useState(false);
  const [spinning, setSpinning] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [touched, setTouched] = useState(false);

  const onReady = useCallback(() => setReady(true), []);

  const stage = useRef<HTMLDivElement>(null);
  // OrbitControls listens for `wheel` on the canvas, so a viewer sitting in the
  // middle of the page swallows the scroll and the visitor gets stuck on it.
  // Stopping the event one level above, in the capture phase, means the controls
  // never see it and the page scrolls normally. Nothing is prevented, and pinch
  // zoom arrives through the pointer path rather than this one, so it survives.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const swallow = (e: WheelEvent) => e.stopPropagation();
    el.addEventListener('wheel', swallow, { capture: true });
    return () => el.removeEventListener('wheel', swallow, { capture: true });
  }, []);

  return (
    <figure ref={ref} className={`group relative ${className}`}>
      <div className={`relative ${aspect} w-full`}>
        {/* Border sits on the box; the canvas is what grows past it. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 z-0 border border-line bg-surface/40" />


        {/* Notched corner — the same tell as BlueprintFrame. */}
        <span
          aria-hidden="true"
          className="absolute -left-px -top-px z-30 h-6 w-6 border-b border-r border-line bg-bg" />


        <figcaption className="pointer-events-none absolute left-8 top-2 z-30 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {label}
        </figcaption>

        {/* Overspills the frame on every side and is never clipped, so the mesh
            — fitted to the canvas, not the frame — breaks the border and lands
            over whatever sits alongside. */}
        <div
          ref={stage}
          className="absolute z-10"
          style={{ top: `-${bleed}`, right: `-${bleed}`, bottom: `-${bleed}`, left: `-${bleed}` }}
          // Taking hold of the model hands control over: stop spinning it.
          onPointerDown={() => {
            setTouched(true);
            setSpinning(false);
          }}>

          {inView ?
          <Suspense fallback={null}>
              <ModelScene
              url={url}
              theme={theme}
              active={inView}
              autoRotate={spinning}
              resetKey={resetKey}
              onReady={onReady}
              fit={fit} />

            </Suspense> :
          null}
        </div>

        {/* Poster + blueprint scan hold the frame until the mesh is live. */}
        <AnimatePresence>
          {!ready ?
          <motion.div
            key="placeholder"
            initial={{ opacity: 1 }}
            // AnimatePresence needs a resolved `animate` state to exit from;
            // without it the exit never runs and this stays over the canvas.
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            // Fills the frame the model is about to break out of.
            className="absolute inset-0 z-20 flex items-center justify-center bg-bg">

              {poster ?
            <img
              src={poster}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-contain opacity-30 blur-[2px]" /> :

            null}

              <span
              aria-hidden="true"
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                'linear-gradient(to right, var(--grid) 1px, transparent 1px), linear-gradient(to bottom, var(--grid) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} />


              <motion.span
              aria-hidden="true"
              className="absolute left-0 right-0 h-px bg-ink/30"
              animate={{ top: ['12%', '88%', '12%'] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} />


              <span className="relative flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                <OrbitIcon className="h-3.5 w-3.5 animate-spin [animation-duration:3s]" aria-hidden="true" />
                Loading mesh
              </span>
            </motion.div> :
          null}
        </AnimatePresence>

        {/* Controls fade in only once there is something to control. */}
        <motion.div
          initial={false}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          // Above the frame's top-right corner, clear of the mesh.
          className="absolute -top-9 right-0 z-30 flex gap-1">

          <button
            type="button"
            onClick={() => setSpinning((v) => !v)}
            aria-pressed={spinning}
            aria-label={spinning ? 'Pause the rotation' : 'Resume the rotation'}
            className="flex h-7 w-7 items-center justify-center border border-line bg-bg/80 text-muted backdrop-blur-sm transition-colors hover:border-ink hover:text-ink">

            {spinning ?
            <PauseIcon className="h-3 w-3" aria-hidden="true" /> :
            <PlayIcon className="h-3 w-3" aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => setResetKey((k) => k + 1)}
            aria-label="Reset the view"
            className="flex h-7 w-7 items-center justify-center border border-line bg-bg/80 text-muted backdrop-blur-sm transition-colors hover:border-ink hover:text-ink">

            <RotateCcwIcon className="h-3 w-3" aria-hidden="true" />
          </button>
        </motion.div>

        {/* Nudge the visitor once, then get out of the way for good. */}
        <AnimatePresence>
          {ready && !touched ?
          <motion.span
            key="hint"
            // The -50% centring lives in the motion transform, not a Tailwind
            // class: framer writes `transform` inline and would overwrite it.
            initial={{ opacity: 0, y: 6, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 6, x: '-50%' }}
            transition={{ duration: 0.5, delay: 0.4 }}
            // Inside the border, and clear of the spec caption below it.
            className="pointer-events-none absolute bottom-8 left-1/2 z-30 whitespace-nowrap border border-line bg-bg/80 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-muted backdrop-blur-sm">

              Drag to orbit · scroll to zoom
            </motion.span> :
          null}
        </AnimatePresence>

        {spec ?
        <span className="pointer-events-none absolute bottom-2 right-3 z-30 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {spec}
          </span> :
        null}
      </div>
    </figure>);

}
