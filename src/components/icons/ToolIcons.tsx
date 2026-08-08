import React from 'react';

/**
 * Hand-drawn line-art marks for the software rail.
 *
 * The real brand logos are full-colour and would break the monochrome
 * technical-drawing look of the sheet, so each one is redrawn here as a
 * single-weight `currentColor` glyph that sits on the same optical grid as
 * the lucide icons used elsewhere.
 */
type IconProps = React.SVGProps<SVGSVGElement>;

function Glyph({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}>

      {children}
    </svg>);

}

/** Blender: the two converging arms of the arrow, plus the eye. */
export function BlenderMark(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M2.6 16.4 12.9 8.2" />
      <path d="M4.6 9.1h8.3" />
      <path d="M12.9 8.2 10.1 4.6" />
      <circle cx="14.9" cy="14.4" r="5.4" />
      <circle cx="14.9" cy="14.4" r="1.9" fill="currentColor" stroke="none" />
    </Glyph>);

}

/** DaVinci Resolve: three colour-wheel droplets pointing at the centre. */
export function ResolveMark(props: IconProps) {
  // Pulled apart and tapered harder than the real mark, so the points still
  // read as droplets rather than a clover at 28px.
  const drop = 'M12 10.4c-2.6-1.7-3.6-3-3.6-4.5a3.6 3.6 0 0 1 7.2 0c0 1.5-1 2.8-3.6 4.5Z';
  return (
    <Glyph {...props}>
      <path d={drop} />
      <path d={drop} transform="rotate(120 12 12)" />
      <path d={drop} transform="rotate(240 12 12)" />
    </Glyph>);

}

/** Unreal Engine: the ringed U with its swept left wing. */
export function UnrealMark(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9.4" />
      <path d="M8.6 7.4v6.1c0 1.8 1.3 2.9 3.4 2.9s3.4-1.1 3.4-2.9V7.4" />
      <path d="M6.5 13.6c.3-3.2 1.8-5.4 4.4-6.5" />
    </Glyph>);

}

/** Nomad Sculpt: a stylus shaping a mass of clay. */
export function NomadMark(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M20.4 3.6a2.2 2.2 0 0 0-3.1 0l-6.6 6.6-.9 4 4-.9 6.6-6.6a2.2 2.2 0 0 0 0-3.1Z" />
      <path d="M15.7 5.2 18.8 8.3" />
      <path d="M3.6 20.4c1.7-3.6 4.3-5.4 7.7-5.4" />
      <path d="M3.6 20.4h8.9" />
    </Glyph>);

}
