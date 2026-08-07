import React from 'react';
import { BoxIcon, FilmIcon, GamepadIcon, PenToolIcon } from 'lucide-react';

const tools = [
{ name: 'Blender', role: 'Modeling · Shading · Render', Icon: BoxIcon },
{ name: 'DaVinci Resolve', role: 'Grading · Edit', Icon: FilmIcon },
{ name: 'Unreal Engine', role: 'Real-time · Lighting', Icon: GamepadIcon },
{ name: 'Nomad Sculpt', role: 'Sculpting · Tablet', Icon: PenToolIcon }];


export function ToolsRail() {
  return (
    <div className="relative mt-14">
      <span
        aria-hidden="true"
        className="absolute left-0 right-0 top-8 h-px bg-line" />
      
      <ul className="relative grid grid-cols-2 gap-y-10 sm:grid-cols-4">
        {tools.map(({ name, role, Icon }) =>
        <li key={name} className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-bg transition-colors hover:border-ink">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="mt-3 font-display text-[11px] tracking-tight">
              {name.toUpperCase()}
            </span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              {role}
            </span>
          </li>
        )}
      </ul>
    </div>);

}