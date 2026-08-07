import React from 'react';

interface BlueprintFrameProps {
  children: React.ReactNode;
  label?: string;
  caption?: string;
  className?: string;
}

/**
 * A thin technical-drawing frame with a notched top-left corner,
 * echoing an architect's plan sheet.
 */
export function BlueprintFrame({
  children,
  label,
  caption,
  className = ''
}: BlueprintFrameProps) {
  return (
    <figure className={`relative border border-line ${className}`}>
      <span
        aria-hidden="true"
        className="absolute -left-px -top-px h-6 w-6 border-b border-r border-line bg-bg" />
      
      {label ?
      <figcaption className="absolute left-8 top-2 z-10 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {label}
        </figcaption> :
      null}

      <div className="relative">{children}</div>

      {caption ?
      <span className="absolute bottom-2 right-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {caption}
        </span> :
      null}
    </figure>);

}