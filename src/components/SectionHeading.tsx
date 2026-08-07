import React from 'react';

interface SectionHeadingProps {
  index: string;
  title: string;
  align?: 'left' | 'right';
  id?: string;
}

export function SectionHeading({
  index,
  title,
  align = 'left',
  id
}: SectionHeadingProps) {
  return (
    <div
      className={`flex flex-col gap-2 ${
      align === 'right' ? 'items-end text-right' : 'items-start text-left'}`
      }>
      
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        {index}
      </span>
      <h2
        id={id}
        className="font-display text-2xl leading-tight tracking-tight sm:text-3xl">
        
        {title}
      </h2>
      <span
        aria-hidden="true"
        className="h-px w-16 bg-ink opacity-40" />
      
    </div>);

}