import { useCallback, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ExpandIcon } from 'lucide-react';
import type { GalleryImage } from '../data/projects';
import { Lightbox } from './Lightbox';

interface ProjectGalleryProps {
  images: GalleryImage[];
  title: string;
  /** Frame reference, e.g. "PRJ—002". */
  label: string;
  spec?: string;
  /** Shape of the frame. Every still is fitted inside it, whatever its own. */
  aspect?: string;
}

/**
 * The stills counterpart to the 3D viewer: same frame, but paging through a
 * project's finished artwork, any of which opens full-bleed and downloadable.
 */
export function ProjectGallery({
  images,
  title,
  label,
  spec,
  aspect = 'aspect-[5/4]'
}: ProjectGalleryProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  // Which way the last move went, so the slide leaves the way it came.
  const [direction, setDirection] = useState(0);

  const many = images.length > 1;
  const current = images[index];

  const go = useCallback(
    (step: number) => {
      setDirection(step);
      setIndex((i) => (i + step + images.length) % images.length);
    },
    [images.length]
  );

  const offset = reduced ? 0 : 40;

  return (
    <>
      <figure className="group relative">
        {/* One frame, one size, whatever is in it. Sizing the box to each
            image meant the page reflowed as you paged through a project, and
            a portrait still ran taller than the screen it was read on. The
            stills are fitted inside a fixed frame instead, at their own
            scale, so paging changes the picture and nothing else. */}
        <div className={`relative w-full ${aspect}`}>
          <span
            aria-hidden="true"
            className="absolute inset-0 z-0 border border-line bg-surface/40" />


          <span
            aria-hidden="true"
            className="absolute -left-px -top-px z-30 h-6 w-6 border-b border-r border-line bg-bg" />


          <figcaption className="pointer-events-none absolute left-8 top-2 z-30 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {label}
          </figcaption>

          <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={current.src}
                src={current.src}
                alt={`${title} — ${current.label}`}
                loading="lazy"
                custom={direction}
                initial={{ opacity: 0, x: direction * offset }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -offset }}
                transition={{ duration: reduced ? 0.01 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setZoomed(true)}
                className="absolute inset-0 h-full w-full cursor-zoom-in object-contain p-4" />

            </AnimatePresence>
          </div>

          {/* Sit outside the border, as in the design. */}
          {many ?
          <>
              <Arrow side="left" onClick={() => go(-1)} />
              <Arrow side="right" onClick={() => go(1)} />
            </> :
          null}

          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label={`View ${title} — ${current.label} full size`}
            className="absolute right-2 top-2 z-30 flex h-7 w-7 items-center justify-center border border-line bg-bg/80 text-muted opacity-0 backdrop-blur-sm transition-all duration-300 hover:border-ink hover:text-ink focus-visible:opacity-100 group-hover:opacity-100">

            <ExpandIcon className="h-3 w-3" aria-hidden="true" />
          </button>

          {/* Reports the image on screen, not the project — they differ once a
              gallery mixes formats. */}
          <span className="pointer-events-none absolute bottom-2 right-3 z-30 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {current.size || spec}
          </span>
        </div>

        {many ?
        <div className="mt-3 flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {current.label}
            </span>
            <span className="flex flex-1 gap-1" aria-hidden="true">
              {images.map((img, i) =>
            <button
              key={img.src}
              type="button"
              tabIndex={-1}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`h-px flex-1 transition-colors ${
              i === index ? 'bg-ink' : 'bg-line hover:bg-muted'}`
              } />

            )}
            </span>
            <span className="font-mono text-[10px] text-muted">
              {String(index + 1).padStart(2, '0')}/{String(images.length).padStart(2, '0')}
            </span>
          </div> :
        null}
      </figure>

      <Lightbox
        image={zoomed ? current : null}
        title={title}
        onClose={() => setZoomed(false)}
        onPrev={many ? () => go(-1) : undefined}
        onNext={many ? () => go(1) : undefined} />

    </>);

}

function Arrow({ side, onClick }: {side: 'left' | 'right';onClick: () => void;}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous image' : 'Next image'}
      className={`absolute top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-line bg-bg text-muted transition-colors hover:border-ink hover:text-ink ${
      side === 'left' ? '-left-4' : '-right-4'}`
      }>

      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path d={side === 'left' ? 'M15 5 8 12l7 7' : 'M9 5l7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>);

}
