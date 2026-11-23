import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import type { GalleryImage } from '../data/projects';
import { t } from '../i18n';

interface LightboxProps {
  image: GalleryImage | null;
  title: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

/**
 * Full-bleed image viewer. Rendered in a portal so no ancestor's transform,
 * overflow or stacking context can clip or trap it — the project rows it opens
 * from are inside animated, overflowing containers.
 */
export function Lightbox({ image, title, onClose, onPrev, onNext }: LightboxProps) {
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = image !== null;

  useEffect(() => {
    if (!open) return;

    // Caught on the way down and stopped there: opened from the project
    // pop-up, Escape must close the image and leave the pop-up behind it.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      if (e.key === 'ArrowLeft') onPrev?.();
      if (e.key === 'ArrowRight') onNext?.();
    };
    window.addEventListener('keydown', onKey, { capture: true });

    // Freeze the page behind, and put focus somewhere useful inside.
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey, { capture: true });
      document.body.style.overflow = overflow;
    };
  }, [open, onClose, onPrev, onNext]);

  return createPortal(
    <AnimatePresence>
      {image ?
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${title} — ${image.label}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0.01 : 0.3 }}
        onClick={onClose}
        // Darkened and blurred: the sheet stays legible underneath as
        // context, without competing with the artwork.
        className="fixed inset-0 z-[100] flex flex-col bg-bg/80 backdrop-blur-xl">

          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              {title} — {image.label} · {image.size}
            </span>

            {/* No download button: William would rather people bought the
                print than printed the file. */}
            <div className="flex items-center gap-2">
              <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t.projects.close}
              className="flex h-8 w-8 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink">

                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center gap-3 px-4 pb-6 sm:px-6">
            {onPrev ?
          <ArrowButton side="left" onClick={onPrev} /> :
          null}

            <motion.img
            key={image.src}
            src={image.src}
            alt={`${title} — ${image.label}`}
            initial={{ opacity: 0, scale: reduced ? 1 : 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? 0.01 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full min-h-0 max-w-full flex-1 object-contain" />


            {onNext ?
          <ArrowButton side="right" onClick={onNext} /> :
          null}
          </div>
        </motion.div> :
      null}
    </AnimatePresence>,
    document.body
  );
}

function ArrowButton({
  side,
  onClick
}: {
  side: 'left' | 'right';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={side === 'left' ? t.gallery.previous : t.gallery.next}
      className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink">

      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path d={side === 'left' ? 'M15 5 8 12l7 7' : 'M9 5l7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>);

}
