import { Suspense, lazy, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { OrbitIcon, PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useInView } from '../../hooks/useInView';

// three.js, fiber and drei all land in this chunk and nowhere else.
const ModelScene = lazy(() => import('./ModelScene'));

/** How far the drawn border sits inside the viewer's box. */
const FRAME = { top: '9%', bottom: '9%', left: '7%', right: '7%' } as const;

interface ModelViewerProps {
  url: string;
  /** Still frame shown until the canvas takes over. */
  poster?: string;
  label?: string;
  /** Small technical caption, e.g. "GLB · 26K TRIS". */
  spec?: string;
  className?: string;
  /** Tailwind aspect utility for the canvas box. */
  aspect?: string;
}

export function ModelViewer({
  url,
  poster,
  label = 'Model',
  spec,
  className = '',
  aspect = 'aspect-[4/3]',
}: ModelViewerProps) {
  const { theme } = useTheme();
  // Start work a screen early so the model is usually ready on arrival.
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '400px 0px' });
  const [ready, setReady] = useState(false);
  const [spinning, setSpinning] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [touched, setTouched] = useState(false);

  const onReady = useCallback(() => setReady(true), []);

  return (
    <figure ref={ref} className={`group relative ${className}`}>
      <div className={`relative ${aspect} w-full`}>
        {/* The frame is inset rather than the canvas being blown up: the mesh
            reads as breaking past the border either way, but this costs no
            extra hit area from whatever sits alongside the viewer. */}
        <span
          aria-hidden="true"
          className="absolute z-0 border border-line bg-surface/40"
          style={FRAME} />


        {/* Frame furniture, repeated at the same inset so it tracks the border,
            and lifted above the model. */}
        <div className="pointer-events-none absolute z-30" style={FRAME}>
          {/* Notched corner — the same tell as BlueprintFrame. */}
          <span
            aria-hidden="true"
            className="absolute -left-px -top-px h-6 w-6 border-b border-r border-line bg-bg" />


          <figcaption className="absolute left-8 top-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {label}
          </figcaption>
        </div>

        {/* Canvas fills the cell and is never clipped, so the mesh spills over
            the inset border. */}
        <div
          className="absolute inset-0 z-10"
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
              onReady={onReady} />

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
            // Matches the border, so the loading state fills the frame the
            // model is about to break out of rather than the whole cell.
            style={FRAME}
            className="absolute z-20 flex items-center justify-center bg-bg">

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
          className="absolute right-2 top-2 z-30 flex gap-1">

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
            style={{ bottom: `calc(${FRAME.bottom} + 30px)` }}
            className="pointer-events-none absolute left-1/2 z-30 whitespace-nowrap border border-line bg-bg/80 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-muted backdrop-blur-sm">

              Drag to orbit · scroll to zoom
            </motion.span> :
          null}
        </AnimatePresence>

        {spec ?
        <span
          className="pointer-events-none absolute z-30 font-mono text-[10px] uppercase tracking-[0.18em] text-muted"
          style={{ bottom: `calc(${FRAME.bottom} + 8px)`, right: `calc(${FRAME.right} + 12px)` }}>

            {spec}
          </span> :
        null}
      </div>
    </figure>);

}
