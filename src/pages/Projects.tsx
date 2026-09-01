import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Rotate3dIcon } from 'lucide-react';
import { Magnetic } from '../components/motion/Magnetic';
import { WorldViewer } from '../components/world/WorldViewer';
import type { Project } from '../data/projects';
import { ModelViewer } from '../components/three/ModelViewer';
import { ProcessScrubber } from '../components/ProcessScrubber';
import { ProjectGallery } from '../components/ProjectGallery';
import { SplitText } from '../components/motion/SplitText';
import { Reveal } from '../components/motion/Reveal';
import { categories, projects } from '../data/projects';

export function Projects() {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState('All');
  const [world, setWorld] = useState<Project | null>(null);

  // The full vocabulary, not just what is currently on the sheet: a family with
  // no work in it yet still gets its chip, and says so when opened.
  const filters = useMemo(() => ['All', ...categories], []);

  const visible = useMemo(
    () =>
    filter === 'All' ?
    projects :
    projects.filter((project) => project.category === filter),
    [filter]
  );

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
      <header className="border-b border-line pb-8">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">

          Index / Sheet 02
        </motion.span>
        <SplitText
          as="h1"
          by="letter"
          text="PROJECTS"
          className="mt-3 font-display text-3xl tracking-tight sm:text-5xl" />

        <Reveal delay={0.15}>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Environments, characters and props — each one modelled, shaded and
            rendered in-house. Every piece below is the real mesh: drag it,
            spin it, look underneath.
          </p>
        </Reveal>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-line py-4">
        {filters.map((category) => {
          const active = category === filter;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={active}
              className={`relative rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${
              active ?
              'border-ink text-bg' :
              'border-line text-muted hover:border-ink hover:text-ink'}`
              }>

              {/* One shared pill slides between the chips instead of blinking. */}
              {active ?
              <motion.span
                layoutId="filter-pill"
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }} /> :

              null}
              <span className="relative">{category}</span>
            </button>);

        })}
        <span className="ml-auto font-mono text-[11px] text-muted">
          {visible.length.toString().padStart(2, '0')} items
        </span>
      </div>

      <ul className="divide-y divide-line">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, index) => {
            const flipped = index % 2 === 1;
            return (
              <motion.li
                key={project.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{
                  duration: reduced ? 0.01 : 0.6,
                  delay: reduced ? 0 : index * 0.06,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="py-10 lg:py-14">

                <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                  <div className={flipped ? 'lg:order-2' : undefined}>
                    {project.model ?
                    <ModelViewer
                      url={project.model}
                      poster={project.image}
                      label={project.ref}
                      spec={project.spec}
                      aspect="aspect-[5/4]" /> :

                    // Stills-only pieces get the same frame, browsable instead.
                    <ProjectGallery
                      images={
                      project.gallery ?? [
                      { src: project.image, label: 'Still', size: project.spec }]
                      }
                      title={project.title}
                      label={project.ref}
                      spec={project.spec}
                      shop={project.shop} />

                    }
                  </div>

                  <div className={flipped ? 'lg:order-1 lg:pr-[8%]' : 'lg:pl-[8%]'}>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                      {String(index + 1).padStart(2, '0')} / {project.category}
                    </span>

                    <h2 className="mt-3 font-display text-xl leading-tight tracking-tight sm:text-2xl">
                      {project.title.toUpperCase()}
                    </h2>

                    <motion.span
                      aria-hidden="true"
                      className="mt-4 block h-px w-16 origin-left bg-ink opacity-40"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: reduced ? 0.01 : 0.8, delay: 0.2 }} />


                    <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">
                      {project.description}
                    </p>

                    <dl className="mt-7 grid max-w-lg grid-cols-2 gap-px border border-line bg-line">
                      {[
                      ['Year', project.year],
                      ['Software', project.software]].
                      map(([term, value]) =>
                      <div key={term} className="bg-bg px-4 py-3">
                          <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                            {term}
                          </dt>
                          <dd className="mt-1 text-sm">{value}</dd>
                        </div>
                      )}
                    </dl>

                    {project.world ?
                    <Magnetic className="mt-7 inline-block" strength={8}>
                        <button
                        type="button"
                        onClick={() => setWorld(project)}
                        className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-ink px-6 py-3 font-display text-sm tracking-tight text-bg">

                          <span
                          aria-hidden="true"
                          className="absolute inset-0 -translate-x-full bg-muted/30 transition-transform duration-500 ease-out group-hover:translate-x-0" />

                          <Rotate3dIcon className="relative h-4 w-4" aria-hidden="true" />
                          <span className="relative">VISIT THIS WORLD</span>
                        </button>
                      </Magnetic> :

                    null}

                    {project.stages ?
                    <ProcessScrubber
                      stages={project.stages}
                      title={project.title} /> :

                    null}
                  </div>
                </article>
              </motion.li>);

          })}
        </AnimatePresence>
      </ul>

      {visible.length === 0 ?
      <p className="py-24 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted">
          No project in this category yet.
        </p> :
      null}

      <WorldViewer
        world={world?.world ?? null}
        title={world?.title ?? ''}
        onClose={() => setWorld(null)} />

    </main>);

}
