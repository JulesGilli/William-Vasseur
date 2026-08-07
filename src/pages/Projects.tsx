import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';

export function Projects() {
  const [filter, setFilter] = useState<string>('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => p.category)))],
    []
  );

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
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          Index / Sheet 02
        </span>
        <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-5xl">
          PROJECTS
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          A selection of environments, characters and props. Every piece is
          modelled, shaded and rendered in-house.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-line py-4">
        {categories.map((category) => {
          const active = category === filter;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
              active ?
              'border-ink bg-ink text-bg' :
              'border-line text-muted hover:border-ink hover:text-ink'}`
              }>
              
              {category}
            </button>);

        })}
        <span className="ml-auto font-mono text-[11px] text-muted">
          {visible.length.toString().padStart(2, '0')} items
        </span>
      </div>

      {visible.length === 0 ?
      <p className="py-24 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted">
          No project in this category yet.
        </p> :

      <ul className="grid gap-px border-b border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, index) =>
        <motion.li
          key={project.id}
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="group bg-bg">
          
              <article className="flex h-full flex-col">
                <div className="relative overflow-hidden">
                  <img
                src={project.image}
                alt={project.title}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              
                  <span className="absolute left-3 top-3 bg-bg px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    {project.ref}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="font-display text-sm tracking-tight">
                      {project.title.toUpperCase()}
                    </h2>
                    <span className="font-mono text-[10px] text-muted">
                      {project.year}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                  <span className="mt-auto border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {project.category} · {project.software}
                  </span>
                </div>
              </article>
            </motion.li>
        )}
        </ul>
      }
    </main>);

}