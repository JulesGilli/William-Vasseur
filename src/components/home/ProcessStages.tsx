import { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue } from
'framer-motion';
import { asset } from '../../lib/asset';

interface Stage {
  id: string;
  index: string;
  label: string;
  caption: string;
  tool: string;
  image: string;
  /**
   * Timelapse wound onto this stage's share of the runway: scrolling through
   * the stage plays it, scrolling back rewinds it. The still stays as the
   * poster, for the wait before it loads and for reduced motion.
   */
  video?: string;
}

const STAGES: Stage[] = [
{
  id: 'drawing',
  index: '01',
  label: 'Drawing',
  caption:
  'It starts on paper. Perspective lines, the arch of the canopy and where the eye should land — the whole scene decided in pen before any of it is worth building. Scroll to watch it drawn.',
  tool: 'Pen · perspective sketch',
  image: asset('/process/drawing.webp'),
  video: asset('/process/drawing-timelapse.mp4')
},
{
  id: 'concept',
  index: '02',
  label: 'Concept',
  caption:
  'A painted study next — the mood, the scale of the canopy, and the palette get settled before a single vertex exists.',
  tool: 'Painted study',
  image: asset('/process/concept.webp')
},
{
  id: 'blockout',
  index: '03',
  label: 'Blockout',
  caption:
  'Geometry only. Trunks, ground scatter and silhouettes are built and dressed in flat colour, so the composition can be judged without lighting hiding anything.',
  tool: 'Blender · solid view',
  image: asset('/process/blockout.webp')
},
{
  id: 'render',
  index: '04',
  label: 'Render',
  caption:
  'Materials, volumetric light through the canopy, then a grade. Same camera as the blockout, so the two can be read against each other.',
  tool: 'Blender · Cycles',
  image: asset('/process/render.webp')
}];


/** Hooks live in the child so the count stays fixed as stages are mapped. */
function StageLayer({
  stage,
  i,
  count,
  progress,
  reduced,
  armed
}: {
  stage: Stage;
  i: number;
  count: number;
  progress: MotionValue<number>;
  reduced: boolean | null;
  /** The runway is close enough to be worth spending the video's bytes on. */
  armed: boolean;
}) {
  const start = i / count;
  const end = (i + 1) / count;
  // Overlap the windows so one image is always fully up during the handover.
  const fade = 0.5 / count / 2;

  const opacity = useTransform(
    progress,
    [start - fade, start + fade, end - fade, end + fade],
    [i === 0 ? 1 : 0, 1, 1, i === count - 1 ? 1 : 0]
  );
  const scale = useTransform(
    progress,
    [start - fade, end + fade],
    reduced ? [1, 1] : [1.04, 1]
  );

  const video = useRef<HTMLVideoElement>(null);
  // Where the scroll says the film should be, 0–1 through its own stage.
  const wanted = useRef(0);

  /**
   * iOS will not seek a film it has never decoded, and a muted inline video is
   * allowed to start without a gesture — so start it and stop it at once.
   */
  const prime = useCallback(() => {
    const v = video.current;
    if (!v) return;
    v.play().then(() => v.pause()).catch(() => {
      // Refused autoplay only costs us the priming; scrubbing still works.
    });
  }, []);

  const seek = useCallback(() => {
    const v = video.current;
    if (!v || !v.duration) return;
    const at = wanted.current * v.duration;
    // The film runs at 12fps; a finer seek is one nobody can see.
    //
    // Deliberately not held back while a seek is in flight. Queuing the next
    // one behind it reads as tidy until a seek into a stretch that has not
    // downloaded yet never completes: nothing drains the queue, and the film
    // stops answering the scroll for the rest of the visit. Browsers already
    // coalesce a re-seek, so the honest thing is to always ask.
    if (Math.abs(v.currentTime - at) < 1 / 12) return;
    v.currentTime = at;
  }, []);

  useMotionValueEvent(progress, 'change', (p) => {
    if (!stage.video) return;
    wanted.current = Math.min(1, Math.max(0, (p - start) / (end - start)));
    seek();
  });

  // Not gated on reduced motion. Nothing here moves on its own — the film is
  // paused from first frame to last and only ever moves because the visitor
  // moved, exactly like the scrollbar. Gating it meant anyone with the OS
  // setting on got the still and no drawing at all.
  if (stage.video) {
    return (
      <motion.div
        style={{ opacity, scale }}
        className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">

        {/* The drawing is portrait and the frame is wide, so rather than
            letterbox it, it is bordered and sized by height — a sheet of paper
            standing in the middle of the sheet. */}
        <video
          ref={video}
          // Held back until the runway is within a screen: 2.5MB is not worth
          // spending on a visitor who never scrolls this far.
          src={armed ? stage.video : undefined}
          poster={stage.image}
          aria-label={`${stage.label} — Navana, drawn from first line to finished painting`}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={() => {
            prime();
            seek();
          }}
          className="h-full w-auto max-w-full border border-line object-contain" />

      </motion.div>);

  }

  return (
    <motion.img
      src={stage.image}
      alt={`${stage.label} — Navana`}
      loading={i === 0 ? 'eager' : 'lazy'}
      style={{ opacity, scale }}
      className="absolute inset-0 h-full w-full object-contain p-4 sm:p-8" />);


}

export function ProcessStages() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // 0 when the runway's top meets the viewport top, 1 when its bottom does.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  });

  // Latched: once the runway has been near, the film stays loaded, so scrolling
  // back up never re-fetches it.
  const near = useInView(ref, { margin: '100% 0px' });
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (near) setArmed(true);
  }, [near]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(STAGES.length - 1, Math.max(0, Math.floor(v * STAGES.length)));
    setActive((prev) => prev === next ? prev : next);
  });

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    // Land in the middle of that stage's slice of the runway.
    const travel = el.offsetHeight - window.innerHeight;
    const target = el.offsetTop + travel * ((i + 0.5) / STAGES.length);
    window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section
      ref={ref}
      className="relative border-b border-line"
      // Runway: each stage gets roughly a screen of scroll to itself.
      style={{ height: `${STAGES.length * 90 + 40}vh` }}
      aria-labelledby="process-title">

      <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                03 / Process
              </span>
              <h2
                id="process-title"
                className="mt-3 font-display text-2xl leading-tight tracking-tight sm:text-3xl">

                FROM A SKETCH TO A WORLD
              </h2>
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:block">
              Navana · 2026
            </span>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(240px,300px)] lg:gap-10">
            {/* Frame */}
            <div className="relative border border-line bg-surface/30">
              <span
                aria-hidden="true"
                className="absolute -left-px -top-px z-20 h-6 w-6 border-b border-r border-line bg-bg" />

              <span className="pointer-events-none absolute left-8 top-2 z-20 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                {STAGES[active].index} — {STAGES[active].tool}
              </span>

              {/* Capped as well as proportioned: on a short window the ratio
                  alone would size it past the height available. */}
              <div className="relative aspect-[16/10] max-h-[calc(100vh-16rem)] w-full">
                {STAGES.map((stage, i) =>
                <StageLayer
                  key={stage.id}
                  stage={stage}
                  i={i}
                  count={STAGES.length}
                  progress={scrollYProgress}
                  reduced={reduced}
                  armed={armed} />

                )}
              </div>

              {/* Runway position, mirrored as a hairline under the frame. */}
              <motion.span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-full origin-left bg-ink"
                style={{ scaleX: scrollYProgress }} />

            </div>

            {/* Rail */}
            <ol className="flex gap-3 lg:flex-col lg:gap-0">
              {STAGES.map((stage, i) => {
                const on = i === active;
                return (
                  <li key={stage.id} className="flex-1 lg:border-b lg:border-line lg:last:border-0">
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={on ? 'step' : undefined}
                      className="group w-full py-3 text-left lg:py-5">

                      <span className="flex items-baseline gap-3">
                        <span
                          className={`font-mono text-[10px] tracking-[0.2em] transition-colors ${
                          on ? 'text-ink' : 'text-muted'}`
                          }>

                          {stage.index}
                        </span>
                        <span
                          className={`font-display text-sm tracking-tight transition-colors ${
                          on ? 'text-ink' : 'text-muted group-hover:text-ink'}`
                          }>

                          {stage.label.toUpperCase()}
                        </span>
                      </span>

                      {/* Underline doubles as the per-stage progress meter. */}
                      <span className="mt-2 block h-px w-full bg-line">
                        <motion.span
                          className="block h-px origin-left bg-ink"
                          initial={false}
                          animate={{ scaleX: on ? 1 : 0 }}
                          transition={{ duration: reduced ? 0.01 : 0.5, ease: [0.16, 1, 0.3, 1] }} />

                      </span>

                    </button>
                  </li>);

              })}
            </ol>
          </div>

          {/* One caption, under the work. The rail used to carry all four,
              three of them at opacity 0 — 600px of column reserved for text
              nobody could read, which is what pushed the bottom of the panel
              out of the pinned box on a short window. */}
          <p className="mt-4 max-w-2xl text-xs leading-relaxed text-muted">
            {STAGES[active].caption}
          </p>
        </div>
      </div>
    </section>);

}
