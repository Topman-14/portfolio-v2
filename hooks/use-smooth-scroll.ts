'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

interface UseSmoothScrollOptions {
  lerp?: number;
  smoothWheel?: boolean;
  syncTouch?: boolean;
  duration?: number;
  touchInertiaExponent?: number;
  enabled?: boolean;
}

export function useSmoothScroll(options: UseSmoothScrollOptions = {}) {
  const {
    lerp = 0.04,
    smoothWheel = true,
    syncTouch = false,
    duration,
    touchInertiaExponent = 50,
    enabled = true,
  } = options;

  useGSAP(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      lerp,
      smoothWheel,
      syncTouch,
      touchInertiaExponent,
      ...(duration && { duration }),
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, { dependencies: [enabled, lerp, smoothWheel, syncTouch, duration, touchInertiaExponent] });
}

