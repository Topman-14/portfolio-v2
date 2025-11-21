'use client';

import { useRef, ReactNode, useEffect, useState, useMemo } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  trigger?: React.RefObject<HTMLElement | HTMLDivElement | null>;
}

export default function Parallax({
  children,
  speed = -15,
  className = '',
  trigger,
}: ParallaxProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [extraHeight, setExtraHeight] = useState(0);

  useEffect(() => {
    if (!elementRef.current) return;

    const container = elementRef.current.parentElement;
    if (!container) return;

    const updateHeight = () => {
      const containerHeight = container.clientHeight;
      const speedAbs = Math.abs(speed);
      const elementHeight = containerHeight / (1 - speedAbs / 100);
      const extra = elementHeight - containerHeight;
      setExtraHeight(Math.max(0, extra));
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [speed]);

  const scrollTriggerConfig = useMemo(() => ({
    trigger: null,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    fastScrollEnd: true,
    preventOverlaps: true,
    invalidateOnRefresh: false,
  }), []);

  useGSAP(() => {
    if (!elementRef.current) return;

    const triggerElement = (trigger?.current as HTMLElement | null) || elementRef.current.parentElement;

    if (!triggerElement) return;

    gsap.set(elementRef.current, { willChange: 'transform', force3D: true });

    const animation = gsap.to(elementRef.current, {
      yPercent: speed,
      ease: 'none',
      force3D: true,
      scrollTrigger: {
        ...scrollTriggerConfig,
        trigger: triggerElement,
      },
    });

    return () => {
      gsap.set(elementRef.current, { clearProps: 'willChange' });
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, { scope: (trigger?.current as HTMLElement) || undefined, dependencies: [speed, scrollTriggerConfig] });

  return (
    <div
      ref={elementRef}
      className={`absolute inset-0 ${className}`}
      style={{
        height: extraHeight > 0 ? `calc(100% + ${extraHeight}px)` : '100%',
        marginTop: extraHeight > 0 ? `-${extraHeight / 2}px` : 0,
        marginBottom: extraHeight > 0 ? `-${extraHeight / 2}px` : 0,
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </div>
  );
}

