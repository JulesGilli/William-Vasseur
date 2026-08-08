import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { OrbitIcon, XIcon } from 'lucide-react';
import type { SplatWorld } from '../../data/projects';

// PlayCanvas only reaches visitors who actually open a world.
const WorldScene = lazy(() => import('./WorldScene'));

interface WorldViewerProps {
  world: SplatWorld | null;
  title: string;
  onClose: () => void;
}

/**
 * Full-screen splat viewer. Portalled to the body: the project rows it opens
 * from sit inside animated, overflowing containers that would otherwise clip
 * it or trap it in the wrong stacking context.
 */
export function WorldViewer({ world, title, onClose }: WorldViewerProps) {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback((m: string) => setError(m), []);

  // Reset between openings, or a second visit starts already "ready".
  useEffect(() => {
    if (!world) {
      setReady(false);
      setError(null);
    }
  }, [world]);

  useEffect(() => {
    if (!world) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [world, onClose]);

  return createPortal(
    <AnimatePresence>
      {world ?
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${title} — explore in 3D`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0.01 : 0.35 }}
        className="fixed inset-0 z-[100] bg-bg">

          <Suspense fallback={null}>
            <WorldScene
              src={world.src}
              upright={world.upright}
              travel={world.travel}
              onReady={onReady}
              onError={onError} />
          </Suspense>

          {/* Chrome sits above the canvas but never swallows the drag. */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="border border-line bg-bg/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted backdrop-blur-sm">
                {title} — Gaussian splat
              </span>
              <button
              type="button"
              onClick={onClose}
              aria-label="Leave this world"
              className="pointer-events-auto flex h-9 w-9 items-center justify-center border border-line bg-bg/70 text-muted backdrop-blur-sm transition-colors hover:border-ink hover:text-ink">

                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <span className="mx-auto border border-line bg-bg/70 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-muted backdrop-blur-sm">
              Drag to look · ZQSD / WASD to walk · Esc to leave
            </span>
          </div>

          <AnimatePresence>
            {!ready || error ?
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg">

                <span
              aria-hidden="true"
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                'linear-gradient(to right, var(--grid) 1px, transparent 1px), linear-gradient(to bottom, var(--grid) 1px, transparent 1px)',
                backgroundSize: '48px 48px'
              }} />


                {error ?
            <span className="relative max-w-sm px-6 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                    This world could not be loaded.
                    <span className="mt-2 block normal-case tracking-normal opacity-70">
                      {error}
                    </span>
                  </span> :

            <span className="relative flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
                    <OrbitIcon
                className="h-4 w-4 animate-spin [animation-duration:3s]"
                aria-hidden="true" />

                    Entering {title}
                  </span>
            }
              </motion.div> :
          null}
          </AnimatePresence>
        </motion.div> :
      null}
    </AnimatePresence>,
    document.body
  );
}
