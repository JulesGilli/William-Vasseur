import React from 'react';

/**
 * The blocky W, drawn on a 5×5 module grid.
 *
 * `S` cells take currentColor so the mark flips with the theme; `G` cells stay
 * a fixed mid-grey, which is the one value that reads against both the light
 * and the dark sheet without needing a second asset.
 */
const GRID = [
'S...S',
'SG.GS',
'SGSGS',
'SSGSS',
'S...S'];


const MID = '#adadad';
// Hairline gutter between modules: invisible at favicon size, legible when big.
const INSET = 0.03;

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 5 5" fill="none" aria-hidden="true" {...props}>
      {GRID.flatMap((row, y) =>
      Array.from(row).map((cell, x) =>
      cell === '.' ?
      null :
      <rect
        key={`${x}-${y}`}
        x={x + INSET}
        y={y + INSET}
        width={1 - INSET * 2}
        height={1 - INSET * 2}
        fill={cell === 'S' ? 'currentColor' : MID} />

      )
      )}
    </svg>);

}
