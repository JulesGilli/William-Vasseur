import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ProcessStage } from '../data/projects';

interface ProcessScrubberProps {
  stages: ProcessStage[];
  /** Used to keep the range input's label unique per instance. */
  title: string;
  /** Match the artwork, or portrait stills get boxed inside a wide frame. */
  aspect?: string;
}

/** Slider units per stage — fine enough that dragging crossfades smoothly. */
const PER_STAGE = 100;

/**
 * Compact counterpart to the pinned Process section: the whole sequence sits in
 * one frame and is driven by a slider rather than by the page scroll, so it can
 * repeat under every project without each one eating a screen of runway.
 */
export function ProcessScrubber({
  stages,
  title,
  aspect = 'aspect-[16/10]'
}: ProcessScrubberProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const max = (stages.length - 1) * PER_STAGE;
  const [value, setValue] = useState(0);

  // Fractional position along the sequence; the integer part is the stage.
  const pos = value / PER_STAGE;
  const active = Math.round(pos);

  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          Process
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {stages[active].index} — {stages[active].tool}
        </span>
      </div>

      <div className={`relative mt-3 ${aspect} w-full border border-line bg-surface/30`}>
        <span
          aria-hidden="true"
          className="absolute -left-px -top-px z-20 h-5 w-5 border-b border-r border-line bg-bg" />


        {stages.map((stage, i) => {
          // Only the two stages either side of the handle are ever visible.
          const distance = Math.abs(pos - i);
          const opacity = Math.max(0, 1 - distance);
          return (
            <img
              key={stage.index}
              src={stage.image}
              alt={`${title} — ${stage.label}`}
              loading="lazy"
              aria-hidden={opacity === 0}
              style={{ opacity }}
              className="absolute inset-0 h-full w-full object-contain p-3" />);


        })}
      </div>

      {/* Track */}
      <div className="mt-4">
        <label htmlFor={id} className="sr-only">
          {`${title} — scrub through the production stages`}
        </label>
        <div className="relative">
          <input
            id={id}
            type="range"
            min={0}
            max={max}
            step={1}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            // Transparent native control laid over the drawn track, so the
            // pointer and keyboard behaviour stay the browser's.
            className="peer relative z-20 h-6 w-full cursor-grab appearance-none bg-transparent active:cursor-grabbing
              [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-ink
              [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ink" />


          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-line" />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 h-px -translate-y-1/2 bg-ink transition-[width] duration-75"
            style={{ width: `${(value / max) * 100}%` }} />


          {/* Notches sit under the handle, one per stage. */}
          {stages.map((stage, i) =>
          <span
            key={stage.index}
            aria-hidden="true"
            className={`pointer-events-none absolute top-1/2 h-2 w-px -translate-y-1/2 transition-colors ${
            i <= pos ? 'bg-ink' : 'bg-line'}`
            }
            style={{ left: `${(i / (stages.length - 1)) * 100}%` }} />

          )}
        </div>

        <ol className="mt-2 flex justify-between">
          {stages.map((stage, i) =>
          <li key={stage.index}>
            <button
              type="button"
              onClick={() => setValue(i * PER_STAGE)}
              aria-current={i === active ? 'step' : undefined}
              className={`font-display text-xs tracking-tight transition-colors ${
              i === active ? 'text-ink' : 'text-muted hover:text-ink'}`
              }>

                {stage.label.toUpperCase()}
              </button>
            </li>
          )}
        </ol>
      </div>

      <motion.p
        key={active}
        initial={{ opacity: reduced ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0.01 : 0.35 }}
        className="mt-4 text-xs leading-relaxed text-muted">

        {stages[active].caption}
      </motion.p>
    </div>);

}
