'use client';

import { useEffect } from 'react';

interface UseSmoothScrollOptions {
  friction?: number;
  minVelocity?: number;
  multiplier?: number;
  enabled?: boolean;
}

export function useSmoothScroll(options: UseSmoothScrollOptions = {}) {
  const {
    friction = 0.92,
    minVelocity = 0.5,
    multiplier = 0.3,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    let velocity = 0;
    let rafId: number | null = null;
    let frameCount = 0;
    let wheelEventCount = 0;
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;

    console.log('[useSmoothScroll] Initializing smooth scroll');

    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';

    const animate = () => {
      frameCount++;
      const currentScroll = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (Math.abs(velocity) > minVelocity) {
        const newScroll = Math.max(0, Math.min(currentScroll + velocity, maxScroll));

        if (frameCount % 60 === 0) {
          console.log('[useSmoothScroll] Animating:', {
            frame: frameCount,
            velocity: velocity.toFixed(2),
            currentScroll: currentScroll.toFixed(2),
            newScroll: newScroll.toFixed(2),
            rafId,
            maxScroll,
          });
        }

        window.scrollTo({
          top: newScroll,
          behavior: 'auto',
        });
        
        velocity *= friction;
        rafId = requestAnimationFrame(animate);
      } else {
        if (velocity !== 0) {
          console.log('[useSmoothScroll] Animation stopped:', {
            finalVelocity: velocity.toFixed(2),
            frames: frameCount,
            currentScroll: window.scrollY.toFixed(2),
          });
        }
        velocity = 0;
        rafId = null;
        frameCount = 0;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      wheelEventCount++;
      const beforeVelocity = velocity;
      const beforeRafId = rafId;

      e.preventDefault();
      velocity += e.deltaY * multiplier;
      velocity = Math.max(-50, Math.min(50, velocity));

      console.log('[useSmoothScroll] Wheel event:', {
        event: wheelEventCount,
        deltaY: e.deltaY,
        beforeVelocity: beforeVelocity.toFixed(2),
        afterVelocity: velocity.toFixed(2),
        beforeRafId,
        rafIdAfter: rafId,
      });

      rafId ??= requestAnimationFrame(animate);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    console.log('[useSmoothScroll] Wheel listener added');

    return () => {
      console.log('[useSmoothScroll] Cleaning up:', { rafId, finalVelocity: velocity });
      window.removeEventListener('wheel', handleWheel);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      document.documentElement.style.scrollBehavior = originalScrollBehavior || '';
      document.body.style.scrollBehavior = '';
    };
  }, [enabled, friction, minVelocity, multiplier]);
}

