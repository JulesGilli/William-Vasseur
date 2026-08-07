import { useEffect, useRef, useState } from 'react';

interface Options {
  /** Stop observing after the first intersection. */
  once?: boolean;
  /** Fires early so work can start just before the element scrolls in. */
  rootMargin?: string;
  threshold?: number;
}

/**
 * Reports whether the referenced element is on screen. Used both to trigger
 * reveal animations and to keep offscreen WebGL canvases from rendering.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  once = false,
  rootMargin = '0px',
  threshold = 0,
}: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView };
}
