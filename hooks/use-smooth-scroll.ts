'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export type UseSmoothScrollOptions = {
  enabled?: boolean;
  lerp?: number;
  wheelMultiplier?: number;
  smoothWheel?: boolean;
  syncTouch?: boolean;
};

export function useSmoothScroll(options: UseSmoothScrollOptions = {}) {
  const { enabled = true, lerp, wheelMultiplier, smoothWheel, syncTouch } = options;
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      prevent: (node) => node.classList.contains('no-smooth-scroll'),
      ...(lerp !== undefined && { lerp }),
      ...(wheelMultiplier !== undefined && { wheelMultiplier }),
      ...(smoothWheel !== undefined && { smoothWheel }),
      ...(syncTouch !== undefined && { syncTouch }),
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled, lerp, wheelMultiplier, smoothWheel, syncTouch]);

  return lenisRef;
}
