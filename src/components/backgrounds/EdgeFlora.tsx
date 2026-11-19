import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Plants growing in from the bottom corners of the screen, drawn in the same
 * one-pixel ink as the frames — a botanical plate in the margin of a technical
 * sheet, rather than cut-outs that would compete with the work.
 *
 * Grown procedurally from a fixed seed, so every visit gets the same plants
 * and there is no asset to ship. They sway; reduced motion stills them.
 */

/** Small seeded PRNG: same seed, same garden. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Kind = 'leafy' | 'fern' | 'grass';

interface Plant {
  kind: Kind;
  /** Base, as a fraction of the canvas width. */
  x: number;
  /** Height, as a fraction of the canvas height. */
  h: number;
  /** How far the stem leans, as a fraction of its height. */
  lean: number;
  phase: number;
  speed: number;
  leaves: number;
}

function grow(seed: number, mirror: boolean): Plant[] {
  const r = rng(seed);
  const kinds: Kind[] = ['fern', 'leafy', 'grass', 'leafy', 'grass', 'fern', 'grass'];
  return kinds.map((kind, i) => {
    // Tallest at the screen edge, shorter toward the content.
    const edge = i / (kinds.length - 1);
    const x = 0.06 + edge * 0.7 + (r() - 0.5) * 0.08;
    return {
      kind,
      x: mirror ? 1 - x : x,
      h: (kind === 'grass' ? 0.38 : 0.62) * (1 - edge * 0.45) * (0.8 + r() * 0.35),
      // Lean away from the content, toward the edge of the screen.
      lean: (mirror ? 1 : -1) * (0.04 + r() * 0.16) + (r() - 0.5) * 0.06,
      phase: r() * Math.PI * 2,
      speed: 0.35 + r() * 0.3,
      leaves: kind === 'fern' ? 16 + Math.floor(r() * 6) : 4 + Math.floor(r() * 4)
    };
  });
}

interface Pt {x: number;y: number;}

/** A point along a stem that bends more toward its tip as it sways. */
function along(p: Plant, s: number, W: number, H: number, sway: number): Pt {
  const h = p.h * H;
  return {
    x: p.x * W + p.lean * h * s * s + sway * h * s * s,
    y: H - h * s
  };
}

function drawPlant(ctx: CanvasRenderingContext2D, p: Plant, W: number, H: number, t: number) {
  const sway = Math.sin(t * p.speed + p.phase) * 0.05;
  const h = p.h * H;

  ctx.beginPath();
  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    const q = along(p, i / steps, W, H, sway);
    if (i === 0) ctx.moveTo(q.x, q.y);else
    ctx.lineTo(q.x, q.y);
  }
  ctx.stroke();

  if (p.kind === 'grass') return;

  for (let i = 1; i <= p.leaves; i++) {
    const s = p.kind === 'fern' ? 0.18 + 0.8 * i / p.leaves : 0.22 + 0.7 * i / p.leaves;
    const a = along(p, s, W, H, sway);
    const b = along(p, Math.min(1, s + 0.02), W, H, sway);
    const up = Math.atan2(b.y - a.y, b.x - a.x);
    const sides = p.kind === 'fern' ? [-1, 1] : [i % 2 === 0 ? 1 : -1];

    for (const side of sides) {
      const spread = p.kind === 'fern' ? 1.15 : 0.85;
      const angle = up + side * spread;
      const len = h * (p.kind === 'fern' ? 0.13 * (1 - s * 0.85) : 0.2 * (1 - s * 0.4));
      const dx = Math.cos(angle), dy = Math.sin(angle);
      const tip = { x: a.x + dx * len, y: a.y + dy * len - len * 0.18 };

      if (p.kind === 'fern') {
        // A leaflet: one slightly arched stroke.
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(a.x + dx * len * 0.5, a.y + dy * len * 0.5 - len * 0.22, tip.x, tip.y);
        ctx.stroke();
      } else {
        // A leaf: two arcs meeting at a point, and its midrib.
        const w = len * 0.3;
        const mx = (a.x + tip.x) / 2, my = (a.y + tip.y) / 2;
        const nx = -dy * w, ny = dx * w;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(mx + nx, my + ny, tip.x, tip.y);
        ctx.quadraticCurveTo(mx - nx, my - ny, a.x, a.y);
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(tip.x, tip.y);
        ctx.stroke();
      }
    }
  }
}

function Corner({ side, seed }: {side: 'left' | 'right';seed: number;}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const plants = grow(seed, side === 'right');
    let W = 0, H = 0, frame = 0, last = 0;

    // The site's own ink, from the same channel triple the colour tokens use.
    const ink = () => {
      const triple = getComputedStyle(document.documentElement).getPropertyValue('--ink-rgb').trim();
      const [r, g, b] = (triple || '241 241 241').split(/\s+/);
      return `rgba(${r}, ${g}, ${b}, 0.34)`;
    };
    let stroke = ink();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      for (const p of plants) drawPlant(ctx, p, W, H, t);
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      // Thirty frames a second is plenty for something this slow.
      if (now - last < 33) return;
      last = now;
      paint(now / 1000);
    };

    // The ink follows the theme toggle, which flips a class on the root.
    const theme = new MutationObserver(() => {
      stroke = ink();
      if (reduced) paint(0);
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    const ro = new ResizeObserver(() => {
      resize();
      paint(performance.now() / 1000);
    });
    ro.observe(canvas);
    resize();

    if (reduced) paint(0);else
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      theme.disconnect();
    };
  }, [side, seed, reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-0 z-20 hidden h-[46vh] w-[min(18vw,280px)] lg:block ${
      side === 'left' ? 'left-0' : 'right-0'}`
      } />);


}

export function EdgeFlora() {
  return (
    <>
      <Corner side="left" seed={7} />
      <Corner side="right" seed={23} />
    </>);

}
