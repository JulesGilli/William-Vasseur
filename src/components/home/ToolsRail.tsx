import { motion, useReducedMotion } from 'framer-motion';
import {
  BlenderMark,
  NomadMark,
  ResolveMark,
  UnrealMark } from
'../icons/ToolIcons';

const tools = [
{ name: 'Blender', role: 'Modeling · Shading · Render', Icon: BlenderMark },
{ name: 'Unreal Engine', role: 'Real-time · Lighting', Icon: UnrealMark },
{ name: 'DaVinci Resolve', role: 'Grading · Edit', Icon: ResolveMark },
{ name: 'Nomad Sculpt', role: 'Sculpting · Tablet', Icon: NomadMark }];


export function ToolsRail() {
  const reduced = useReducedMotion();

  return (
    <div className="relative mt-14">
      {/* The rail itself is drawn on, left to right, as the section arrives. */}
      <motion.span
        aria-hidden="true"
        className="absolute left-0 right-0 top-8 h-px origin-left bg-line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: reduced ? 0.01 : 1.1, ease: [0.16, 1, 0.3, 1] }} />


      {/* Equal shares rather than a fixed column count: with a count that no
          longer matches, the icons bunch up and the rail runs on past the last
          one. Two per row until there is width for a single line. */}
      <ul className="relative flex flex-wrap gap-y-10">
        {tools.map(({ name, role, Icon }, i) =>
        <motion.li
          key={name}
          className="group flex basis-1/2 flex-col items-center text-center lg:basis-0 lg:grow"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{
            duration: reduced ? 0.01 : 0.6,
            delay: reduced ? 0 : 0.15 + i * 0.09,
            ease: [0.16, 1, 0.3, 1]
          }}>

            <motion.span
            className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-bg transition-colors duration-300 group-hover:border-ink"
            whileHover={reduced ? undefined : { scale: 1.08, rotate: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 16 }}>

              <Icon className="h-7 w-7 text-muted transition-colors duration-300 group-hover:text-ink" />
            </motion.span>
            {/* Gulax is a display face — under ~14px it stops being readable. */}
            <span className="mt-3 font-display text-sm tracking-tight">
              {name.toUpperCase()}
            </span>
            <span className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              {role}
            </span>
          </motion.li>
        )}
      </ul>
    </div>);

}
