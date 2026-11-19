import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { ToolsRail } from '../components/home/ToolsRail';
import { ProcessStages } from '../components/home/ProcessStages';
import { BlueprintFrame } from '../components/BlueprintFrame';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/motion/Reveal';
import { Marquee } from '../components/motion/Marquee';
import { Magnetic } from '../components/motion/Magnetic';
import { TopographyBackdrop } from '../components/backgrounds/TopographyBackdrop';
import { products } from '../data/products';
import { cheapestVariant, formatPrice } from '../lib/shop/types';
import { asset } from '../lib/asset';
import { site } from '../data/content';
import { t } from '../i18n';

// The words and figures on this page are William's to edit; they arrive from
// the database through src/data/content.json at build time.
const { band, about, tools, physical, cta } = site;
const PORTRAIT = asset(about.portrait);

export function Home() {
  const reduced = useReducedMotion();

  return (
    <main>
      <Hero />

      <div className="border-b border-line py-5">
        <Marquee items={band.words} duration={38} />
      </div>

      {/* About */}
      <section className="border-b border-line" aria-labelledby="about-title">
        {/* The two columns are sized to their content and the pair is centred:
            the text stops at max-w-xl, so a 1fr second column would leave the
            whole block sitting left of centre on a wide screen. */}
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[minmax(240px,340px)_minmax(0,640px)] lg:justify-center lg:py-24">
          <Reveal from="right" className="self-start">
            <BlueprintFrame label={about.portraitLabel}>
              {/* The portrait is a cut-out, so the blueprint grid behind it
                  shows through the corners instead of a photo background. */}
              <div className="overflow-hidden">
                <motion.img
                  src={PORTRAIT}
                  alt={t.home.portraitAlt}
                  className="aspect-[4/5] w-full object-cover"
                  initial={{ scale: reduced ? 1 : 1.12 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: reduced ? 0.01 : 1.4, ease: [0.16, 1, 0.3, 1] }} />

              </div>
            </BlueprintFrame>
          </Reveal>

          <div className="lg:pl-[10%]">
            <SectionHeading index={t.home.profile} title={about.title} id="about-title" />

            <Reveal delay={0.1}>
              <div className="mt-6 max-w-xl space-y-4 text-sm leading-relaxed text-muted">
                {about.paragraphs.map((text) =>
                <p key={text}>{text}</p>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <dl className="mt-8 grid max-w-xl grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
                {about.stats.map(({ term, value }) =>
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

      {/* Tools — contours; the grid returns on the section below it */}
      <section
        className="relative isolate border-b border-line"
        aria-labelledby="tools-title">

        <TopographyBackdrop bands={2} opacity={0.4} />
        <div className="relative mx-auto max-w-[1400px] px-4 py-16 sm:px-8 lg:py-24">
          <div className="flex justify-end">
            <SectionHeading
              index={t.home.toolset}
              title={tools.title}
              align="right"
              id="tools-title" />

          </div>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted lg:ml-[14%]">
              {tools.intro}
            </p>
          </Reveal>
          <ToolsRail />
        </div>
      </section>

      <ProcessStages />

      {/* Physical work */}
      <section className="border-b border-line" aria-labelledby="real-title">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8 lg:py-24">
          <SectionHeading
            index={t.home.physical}
            title={physical.title}
            id="real-title" />

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted lg:ml-[10%]">
              {physical.intro}
            </p>
          </Reveal>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) =>
            <Reveal as="li" key={product.id} delay={0.08 * i}>
                <Link
                to="/store"
                className="group block"
                aria-label={t.home.seeInStore(product.name)}>

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
                    <span className="font-display text-sm tracking-tight transition-opacity group-hover:opacity-60">
                      {product.name.toUpperCase()}
                    </span>
                    {/* Cheapest variant: the teaser quotes an entry price. */}
                    <span className="font-mono text-xs text-muted">
                      {t.home.from(formatPrice(cheapestVariant(product).priceCents, product.currency))}
                    </span>
                  </span>
                </Link>
              </Reveal>
            )}
          </ul>
        </div>
      </section>

      {/* CTA — contours instead of the grid, to break the page's repetition */}
      <section className="relative isolate" aria-labelledby="cta-title">
        <TopographyBackdrop />
        <div className="relative mx-auto max-w-[1400px] px-4 py-16 text-center sm:px-8 lg:py-24">
          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              {t.home.next}
            </span>
            <h2
              id="cta-title"
              className="mt-3 font-display text-2xl tracking-tight sm:text-3xl">

              {cta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted">
              {cta.text}
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

                <span className="relative">{cta.button}</span>
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
