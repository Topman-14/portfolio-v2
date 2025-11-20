'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from '@/lib/gsap-config';
import Lenis from 'lenis';

const premiumEasing = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
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
    lerp = 0.04,
    smoothWheel = true,
    syncTouch = false,
    duration = 1.8,
    touchInertiaExponent = 100,
    enabled = true,
    wheelMultiplier = 0.8,
    easing = premiumEasing,
  } = options;

  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      if (lenisRef.current) {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
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
    });

    lenisRef.current = lenis;

    let rafPending = false;
    const updateScrollTrigger = () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
          ScrollTrigger.update();
          rafPending = false;
        });
      }
    };
    lenis.on('scroll', updateScrollTrigger);

    let isRunning = true;
    const raf = (time: number) => {
      if (!isRunning) return;
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };

    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      isRunning = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled, lerp, smoothWheel, syncTouch, duration, touchInertiaExponent, wheelMultiplier, easing]);

  return lenisRef.current;
}
