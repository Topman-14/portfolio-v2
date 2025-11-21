'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import Lenis from 'lenis';

const premiumEasing = (t: number): number => {
  return Math.min(1, 1.001 - Math.pow(2, -10 * t));
};

interface UseSmoothScrollOptions {
  lerp?: number;
  smoothWheel?: boolean;
  syncTouch?: boolean;
  duration?: number;
  touchInertiaExponent?: number;
  enabled?: boolean;
  wheelMultiplier?: number;
  easing?: (t: number) => number;
}

export function useSmoothScroll(options: UseSmoothScrollOptions = {}) {
  const {
    lerp = 0.1,
    smoothWheel = true,
    syncTouch = false,
    duration = 1.2,
    touchInertiaExponent = 50,
    enabled = true,
    wheelMultiplier = 1,
    easing = premiumEasing,
  } = options;

  const lenisRef = useRef<Lenis | null>(null);
  const rafCallbackRef = useRef<((time: number) => void) | null>(null);

  const handleRaf = useCallback((time: number) => {
    if (lenisRef.current) {
      lenisRef.current.raf(time * 1000);
    }
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      if (lenisRef.current) {
        if (rafCallbackRef.current) {
          gsap.ticker.remove(rafCallbackRef.current);
        }
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      lerp,
      smoothWheel,
      syncTouch,
      duration,
      touchInertiaExponent,
      wheelMultiplier,
      easing,
      prevent: (node) => node.classList.contains('no-smooth-scroll'),
    });

    lenisRef.current = lenis;
    rafCallbackRef.current = handleRaf;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(handleRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (rafCallbackRef.current) {
        gsap.ticker.remove(rafCallbackRef.current);
      }
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
      rafCallbackRef.current = null;
    };
  }, [enabled, lerp, smoothWheel, syncTouch, duration, touchInertiaExponent, wheelMultiplier, easing, handleRaf]);

  return lenisRef.current;
}
