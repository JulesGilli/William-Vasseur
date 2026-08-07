import React, { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownIcon } from 'lucide-react';
import { asset } from '../../lib/asset';

const HERO_IMAGE = asset("/c5091bcf-b0b6-4779-8747-7613c0e9be91.jpg");


export function Hero() {
  const [angle, setAngle] = useState(-8);
  const dragging = useRef(false);
  const lastX = useRef(0);

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent) => {
    if (!dragging.current) return;
    const delta = event.clientX - lastX.current;
    lastX.current = event.clientX;
    setAngle((prev) => Math.max(-38, Math.min(38, prev + delta * 0.35)));
  }, []);

  const stopDrag = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <section
      className="relative border-b border-line"
      aria-labelledby="hero-title">
      
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <div>
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[13vw] leading-[0.92] tracking-tight sm:text-[9vw] lg:text-[6.4vw]">
            
            WILLIAM
            <br />
            VASSEUR
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-5 max-w-md text-sm text-muted lg:ml-[6vw]">
            
            3D Artist — Science fiction environments and characters.
            <span className="block font-mono text-[11px] uppercase tracking-[0.2em]">
              Toulouse, France
            </span>
          </motion.p>

          <div className="mt-14 flex items-center gap-4">
            <span className="flex h-16 w-6 items-center justify-center rounded-full border border-line">
              <span className="rotate-90 font-mono text-[9px] uppercase tracking-[0.28em] text-muted">
                Scroll
              </span>
            </span>
            <motion.span
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-ink"
              aria-hidden="true">
              
              <ArrowDownIcon className="h-6 w-6" />
            </motion.span>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] border border-line">
            <span
              aria-hidden="true"
              className="absolute -left-px -top-px h-10 w-10 border-b border-r border-line bg-bg" />
            
            <div
              role="img"
              aria-label="Rendu 3D d'un fragment de roche flottant recouvert de mousse et de fleurs de cerisier"
              tabIndex={0}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={stopDrag}
              onPointerCancel={stopDrag}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') setAngle((p) => Math.max(-38, p - 6));
                if (e.key === 'ArrowRight') setAngle((p) => Math.min(38, p + 6));
              }}
              className="flex h-full w-full cursor-grab touch-none items-center justify-center overflow-hidden active:cursor-grabbing"
              style={{ perspective: 1000 }}>
              
              <motion.img
                src={HERO_IMAGE}
                alt=""
                animate={{ rotateY: angle, y: [0, -12, 0] }}
                transition={{
                  rotateY: { type: 'spring', stiffness: 120, damping: 18 },
                  y: { duration: 7, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="h-[86%] w-[86%] select-none object-contain mix-blend-multiply dark:mix-blend-screen"
                draggable={false} />
              
            </div>

            <span className="pointer-events-none absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Drag to turn the object
            </span>
          </div>

          <div className="mt-3 flex justify-end gap-2" aria-hidden="true">
            {[0, 1, 2].map((dot) =>
            <span
              key={dot}
              className="h-1.5 w-1.5 rounded-full border border-line" />

            )}
          </div>
        </div>
      </div>
    </section>);

}