import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { ToolsRail } from '../components/home/ToolsRail';
import { BlueprintFrame } from '../components/BlueprintFrame';
import { SectionHeading } from '../components/SectionHeading';
import { products } from '../data/products';
import { asset } from '../lib/asset';

const PORTRAIT = asset("/f7c3b8ed-4df2-40a4-be21-6170fb42fc44.jpg");


export function Home() {
  return (
    <main>
      <Hero />

      {/* About */}
      <section
        className="border-b border-line"
        aria-labelledby="about-title">
        
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[minmax(240px,340px)_1fr] lg:py-24">
          <BlueprintFrame label="July 2026 — Picture_of_me.png" className="self-start">
            <img
              src={PORTRAIT}
              alt="Portrait de William Vasseur, artiste 3D"
              className="aspect-[4/5] w-full object-cover" />
            
          </BlueprintFrame>

          <div className="lg:pl-[10%]">
            <SectionHeading index="01 / Profile" title="ABOUT ME" id="about-title" />
            <div className="mt-6 max-w-xl space-y-4 text-sm leading-relaxed text-muted">
              <p>
                Hello, I'm a 3D Artist from Toulouse, in France. I'm 25 years old
                and I've been creating things since my earliest years. A lover of
                new technologies, I started to learn 3D 4–5 years ago. I'm
                continuously searching and experimenting with my art, in terms of
                support and direction.
              </p>
              <p>
                Welcome to my world, full of technology and nature. I'm a lover of
                science-fiction, with a lot of different inspirations.
              </p>
            </div>

            <dl className="mt-8 grid max-w-xl grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
              {[
              ['Based in', 'Toulouse, FR'],
              ['Experience', '5 years'],
              ['Focus', 'Sci-fi / Nature']].
              map(([term, value]) =>
              <div key={term} className="bg-bg px-4 py-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    {term}
                  </dt>
                  <dd className="mt-1 text-sm">{value}</dd>
                </div>
              )}
            </dl>
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
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted lg:ml-[14%]">
            I started to learn 3D with Blender, and still continue using it every
            day. I also work with DaVinci Resolve, Fusion and Unreal Engine — and
            I sculpt on my tablet with Nomad Sculpt.
          </p>
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
          
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted lg:ml-[10%]">
            After creating my environments and characters, I bring them into
            reality — classically printed on paper as posters, and also with a 3D
            printer, to fully use the potential of 3D for models and dioramas.
          </p>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) =>
            <li key={product.id}>
                <BlueprintFrame
                label={`July 2026 — ${product.id}.png`}
                caption={product.ref}>
                
                  <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-square w-full object-cover" />
                
                </BlueprintFrame>
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="blueprint-grid" aria-labelledby="cta-title">
        <div className="mx-auto max-w-[1400px] px-4 py-16 text-center sm:px-8 lg:py-24">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            04 / Next
          </span>
          <h2
            id="cta-title"
            className="mt-3 font-display text-2xl tracking-tight sm:text-3xl">
            
            FOLLOW ME, I WILL SHOW YOU
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted">
            I'm regularly creating new work, depending on my inspiration. If you
            would like to have a look at my latest projects, follow the link
            below.
          </p>

          <Link
            to="/projects"
            className="group mx-auto mt-10 flex w-full max-w-md items-center justify-center gap-3 rounded-full bg-ink px-8 py-4 font-display text-sm tracking-tight text-bg transition-opacity hover:opacity-85">
            
            MY PROJECTS
            <ArrowRightIcon
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true" />
            
          </Link>

          <span
            aria-hidden="true"
            className="mx-auto mt-8 block h-px w-full max-w-3xl bg-line" />
          
        </div>
      </section>
    </main>);

}