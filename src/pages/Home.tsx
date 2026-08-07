import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { ToolsRail } from '../components/home/ToolsRail';
import { BlueprintFrame } from '../components/BlueprintFrame';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/motion/Reveal';
import { Marquee } from '../components/motion/Marquee';
import { Magnetic } from '../components/motion/Magnetic';
import { products } from '../data/products';
import { asset } from '../lib/asset';

const PORTRAIT = asset('/portrait.webp');

const BAND = [
'SCIENCE FICTION',
'NATURE',
'REAL-TIME',
'RESIN PRINTS',
'DIORAMAS',
'ENVIRONMENTS',
'CHARACTERS'];


const STATS = [
['Based in', 'Toulouse, FR'],
['Experience', '5 years'],
['Focus', 'Sci-fi / Nature']];


export function Home() {
  const reduced = useReducedMotion();

  return (
    <main>
      <Hero />

      <div className="border-b border-line py-5">
        <Marquee items={BAND} duration={38} />
      </div>

      {/* About */}
      <section className="border-b border-line" aria-labelledby="about-title">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[minmax(240px,340px)_1fr] lg:py-24">
          <Reveal from="right" className="self-start">
            <BlueprintFrame label="July 2026 — Picture_of_me.png">
              {/* The portrait is a cut-out, so the blueprint grid behind it
                  shows through the corners instead of a photo background. */}
              <div className="overflow-hidden">
                <motion.img
                  src={PORTRAIT}
                  alt="Portrait of William Vasseur, 3D artist"
                  className="aspect-[4/5] w-full object-cover"
                  initial={{ scale: reduced ? 1 : 1.12 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: reduced ? 0.01 : 1.4, ease: [0.16, 1, 0.3, 1] }} />

              </div>
            </BlueprintFrame>
          </Reveal>

          <div className="lg:pl-[10%]">
            <SectionHeading index="01 / Profile" title="ABOUT ME" id="about-title" />

            <Reveal delay={0.1}>
              <div className="mt-6 max-w-xl space-y-4 text-sm leading-relaxed text-muted">
                <p>
                  Hello, I'm a 3D artist from Toulouse, in France. I'm 25 and
                  I've been making things for as long as I can remember. I came
                  to 3D about five years ago through a love of new tools, and
                  I've been pushing at its edges ever since — in medium as much
                  as in subject.
                </p>
                <p>
                  Welcome to my world: equal parts technology and nature. I build
                  science fiction, then print it, frame it and put it on a shelf.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <dl className="mt-8 grid max-w-xl grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
                {STATS.map(([term, value]) =>
                <div
                  key={term}
                  className="bg-bg px-4 py-3 transition-colors duration-300 hover:bg-surface">

                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      {term}
                    </dt>
                    <dd className="mt-1 text-sm">{value}</dd>
                  </div>
                )}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="border-b border-line" aria-labelledby="tools-title">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8 lg:py-24">
          <div className="flex justify-end">
            <SectionHeading
              index="02 / Toolset"
              title="CREATING 3D, WITH DIFFERENT TOOLS"
              align="right"
              id="tools-title" />

          </div>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted lg:ml-[14%]">
              I learned 3D in Blender and still open it every day. Around it sit
              Meshy AI for turning references into meshes, Unreal Engine for
              real-time lighting, DaVinci Resolve for grading, and Nomad Sculpt
              on the tablet when a shape needs hands.
            </p>
          </Reveal>
          <ToolsRail />
        </div>
      </section>

      {/* Physical work */}
      <section className="border-b border-line" aria-labelledby="real-title">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8 lg:py-24">
          <SectionHeading
            index="03 / Physical"
            title="PUT MY IMAGINATION IN THE REAL LIFE"
            id="real-title" />

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted lg:ml-[10%]">
              Once an environment or a character is finished, I bring it out of
              the screen — printed on paper as posters, and run through a resin
              printer for models and dioramas.
            </p>
          </Reveal>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) =>
            <Reveal as="li" key={product.id} delay={0.08 * i}>
                <Link
                to="/store"
                className="group block"
                aria-label={`${product.name} — see it in the store`}>

                  <BlueprintFrame label={product.ref} caption={product.kind}>
                    <div className="overflow-hidden bg-surface/40">
                      <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="aspect-square w-full object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-[1.07]" />

                    </div>
                  </BlueprintFrame>
                  <span className="mt-3 flex items-baseline justify-between gap-3">
                    <span className="font-display text-[11px] tracking-tight transition-opacity group-hover:opacity-60">
                      {product.name.toUpperCase()}
                    </span>
                    <span className="font-mono text-[11px] text-muted">
                      {product.price}
                    </span>
                  </span>
                </Link>
              </Reveal>
            )}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="blueprint-grid" aria-labelledby="cta-title">
        <div className="mx-auto max-w-[1400px] px-4 py-16 text-center sm:px-8 lg:py-24">
          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              04 / Next
            </span>
            <h2
              id="cta-title"
              className="mt-3 font-display text-2xl tracking-tight sm:text-3xl">

              FOLLOW ME, I WILL SHOW YOU
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted">
              New work turns up whenever the inspiration does. Every piece below
              can be turned around in your browser — no render, the actual mesh.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <Magnetic className="mx-auto mt-10 w-full max-w-md" strength={10}>
              <Link
                to="/projects"
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-ink px-8 py-4 font-display text-sm tracking-tight text-bg">

                {/* Wipe that sweeps through on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-muted/30 transition-transform duration-500 ease-out group-hover:translate-x-0" />

                <span className="relative">MY PROJECTS</span>
                <ArrowRightIcon
                  className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden="true" />

              </Link>
            </Magnetic>
          </Reveal>

          <span
            aria-hidden="true"
            className="mx-auto mt-8 block h-px w-full max-w-3xl bg-line" />

        </div>
      </section>
    </main>);

}
