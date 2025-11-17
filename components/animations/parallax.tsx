'use client';

import { useRef, ReactNode, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

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
      // Calculate extra height needed: if speed is -20%, element moves up 20% of its height
      // We need element height = containerHeight / (1 - speedAbs/100)
      // Extra height = elementHeight - containerHeight
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

  useGSAP(() => {
    if (!elementRef.current) return;

    const triggerElement = (trigger?.current as HTMLElement | null) || elementRef.current.parentElement;

    if (!triggerElement) return;

    const scrollTrigger = gsap.to(elementRef.current, {
      yPercent: speed,
      ease: 'none',
      scrollTrigger: {
        trigger: triggerElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, { scope: (trigger?.current as HTMLElement) || undefined });

  return (
    <div
      ref={elementRef}
      className={`absolute inset-0 ${className}`}
      style={{
        height: extraHeight > 0 ? `calc(100% + ${extraHeight}px)` : '100%',
        marginTop: extraHeight > 0 ? `-${extraHeight / 2}px` : 0,
        marginBottom: extraHeight > 0 ? `-${extraHeight / 2}px` : 0,
      }}
    >
      {children}
    </div>
  );
}

