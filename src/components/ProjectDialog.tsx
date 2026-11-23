import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRightIcon, ShoppingBagIcon, XIcon } from 'lucide-react';
import { ModelViewer } from './three/ModelViewer';
import { Lightbox } from './Lightbox';
import type { GalleryImage, Project } from '../data/projects';
import { t } from '../i18n';

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
}

/**
 * The whole of one project at once: the finished work, every stage of how it
 * was made with its picture, and the way to the shop.
 *
 * The sheet itself stays a quick read — a frame and a slider per piece — and
 * this is where a visitor goes to look properly. In a portal like the other
 * overlays, so no animated or clipped ancestor on the sheet can trap it.
 */
export function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = project !== null;

  // Every picture in the pop-up enlarges: the renders, then the stages, as
  // one sequence the arrows walk through.
  const [zoomed, setZoomed] = useState<number | null>(null);
  const pictures: GalleryImage[] = project ?
  [
  ...(project.model ? [] : project.gallery ?? [{ src: project.image, label: t.projects.still, size: project.spec }]),
  ...(project.stages ?? []).map((stage) => ({ src: stage.image, label: stage.label, size: '' }))] :

  [];
  const enlarge = (src: string) => setZoomed(pictures.findIndex((p) => p.src === src));
  useEffect(() => setZoomed(null), [project]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    // Freeze the sheet behind, and put focus somewhere useful inside.
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {project ?
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0.01 : 0.3 }}
        onClick={onClose}
        // Darkened and blurred, so the sheet stays there as context without
        // competing with the piece being read.
        className="fixed inset-0 z-[100] overflow-y-auto bg-bg/80 backdrop-blur-xl">

          <motion.article
          key={project.id}
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.01 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="mx-auto my-6 w-full max-w-[1100px] border border-line bg-bg px-4 py-4 sm:px-8 sm:py-6">

            <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                {project.ref} — {t.projects.categories[project.category] ?? project.category} · {project.year}
              </span>
              <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t.projects.close}
              className="flex h-8 w-8 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink">

                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <header className="grid gap-6 pt-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="font-display text-2xl leading-tight tracking-tight sm:text-4xl">
                  {project.title.toUpperCase()}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  {project.software}
                </p>
              </div>
              <ShopLinks project={project} />
            </header>

            <section className="pt-10" aria-labelledby="dialog-work">
              <SectionLabel id="dialog-work">{t.projects.finished}</SectionLabel>
              <Work project={project} onEnlarge={enlarge} />
            </section>

            {project.stages?.length ?
          <section className="pt-12" aria-labelledby="dialog-process">
                <SectionLabel id="dialog-process">{t.projects.how}</SectionLabel>
                {/* A real sequence, so the numbers carry meaning: each stage
                    was done after the one above it. */}
                <ol className="mt-5 flex flex-col gap-10">
                  {project.stages.map((stage) =>
              <li
                key={stage.index}
                className="grid gap-5 border-t border-line pt-5 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-8">

                      <button
                  type="button"
                  onClick={() => enlarge(stage.image)}
                  aria-label={t.gallery.enlarge(project.title, stage.label)}
                  className="relative block cursor-zoom-in border border-line bg-surface/40">

                        <img
                    src={stage.image}
                    alt={`${project.title} — ${stage.label}`}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-contain p-3" />

                      </button>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                          {stage.index} — {stage.tool}
                        </span>
                        <h3 className="mt-2 font-display text-lg tracking-tight">
                          {stage.label.toUpperCase()}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted">{stage.caption}</p>
                      </div>
                    </li>
              )}
                </ol>
              </section> :
          null}

            {/* Asked again at the end: whoever scrolled this far is the most
                likely to want one on the wall. */}
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {t.projects.shipped}
              </span>
              <ShopLinks project={project} />
            </div>
          </motion.article>
        </motion.div> :
      null}
      {project ?
      <Lightbox
        key="lightbox"
        image={zoomed !== null && zoomed >= 0 ? pictures[zoomed] : null}
        title={project.title}
        onClose={() => setZoomed(null)}
        onPrev={pictures.length > 1 ? () => setZoomed((i) => ((i ?? 0) - 1 + pictures.length) % pictures.length) : undefined}
        onNext={pictures.length > 1 ? () => setZoomed((i) => ((i ?? 0) + 1) % pictures.length) : undefined} /> :
      null}
    </AnimatePresence>,
    document.body
  );
}

function SectionLabel({ id, children }: {id: string;children: React.ReactNode;}) {
  return (
    <h3 id={id} className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
      {children}
    </h3>);

}

/** The piece itself: turnable where there is a mesh, otherwise its renders. */
function Work({ project, onEnlarge }: {project: Project;onEnlarge: (src: string) => void;}) {
  if (project.model) {
    return (
      <div className="mt-5">
        <ModelViewer
          url={project.model}
          poster={project.image}
          label={project.ref}
          spec={project.spec}
          aspect="aspect-[16/9]"
          bleed="3%" />

      </div>);

  }

  const renders = project.gallery ?? [{ src: project.image, label: t.projects.still, size: project.spec }];
  return (
    <div className={`mt-5 grid gap-5 ${renders.length > 1 ? 'md:grid-cols-2' : ''}`}>
      {renders.map((render) =>
      <figure key={render.src} className="border border-line bg-surface/40">
          <button
          type="button"
          onClick={() => onEnlarge(render.src)}
          aria-label={t.gallery.enlarge(project.title, render.label)}
          className="block w-full cursor-zoom-in">

            <img
            src={render.src}
            alt={`${project.title} — ${render.label}`}
            className="max-h-[75vh] w-full object-contain p-3" />

          </button>

          <figcaption className="flex justify-between gap-4 border-t border-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            <span>{render.label}</span>
            <span>{render.size}</span>
          </figcaption>
        </figure>
      )}
    </div>);

}

/**
 * Straight to the product when the piece is sold as one, otherwise to the
 * shop. Always something: a project page with no way to the shelves is a dead
 * end for the visitor most likely to buy.
 */
function ShopLinks({ project }: {project: Project;}) {
  const links = [
  project.shop?.poster ?
  { to: `/store?product=${project.shop.poster}`, label: t.projects.shopPoster } :
  null,
  project.shop?.figurine ?
  { to: `/store?product=${project.shop.figurine}`, label: t.projects.shopFigurine } :
  null].
  filter((l): l is {to: string;label: string;} => l !== null);

  const items = links.length > 0 ? links : [{ to: '/store', label: t.projects.visitStore }];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((link) =>
      <Link
        key={link.to}
        to={link.to}
        className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-display text-sm tracking-tight text-bg transition-opacity hover:opacity-85">

          <ShoppingBagIcon className="h-4 w-4" aria-hidden="true" />
          {link.label}
          <ArrowRightIcon
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true" />

        </Link>
      )}
    </div>);

}
