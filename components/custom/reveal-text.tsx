/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRef, ReactNode, ElementType } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { getFontsReady } from '@/lib/fonts-ready';

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  start?: string;
  end?: string;
  stagger?: number;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  finalOpacity?: number;
  y?: number;
  scrub?: number | boolean;
  delay?: number;
}

export function RevealText({
  children,
  className = '',
  as: Component = 'div',
  start = 'top 70%',
  end,
  stagger = 0.03,
  duration = 0.8,
  ease = 'expo.out',
  initialOpacity = 0,
  finalOpacity = 1,
  y = 30,
  scrub,
  delay,
}: RevealTextProps) {
  const textRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;

      const splits: SplitType[] = [];
      const scrollTriggers: ScrollTrigger[] = [];

      getFontsReady().then(() => {
        if (!textRef.current) return;

        const split = new SplitType(textRef.current, { 
          types: 'words,chars',
          tagName: 'span',
        });
        splits.push(split);

        if (split.words) {
          split.words.forEach((word) => {
            if (word instanceof HTMLElement) {
              word.style.display = 'inline-block';
            }
          });
        }

        gsap.set(split.chars, { 
          willChange: 'opacity, transform',
          opacity: initialOpacity,
          y: y !== 0 ? y : 0,
        });

        const scrollTriggerConfig: any = {
          trigger: textRef.current,
          start,
        };

        if (end) {
          scrollTriggerConfig.end = end;
        }

        if (scrub !== undefined) {
          scrollTriggerConfig.scrub = scrub;
        }

        if (scrub !== undefined) {
          const animationProps: any = {
            opacity: finalOpacity,
            stagger,
            ease,
            clearProps: 'willChange',
            scrollTrigger: scrollTriggerConfig,
          };

          if (y !== 0) {
            animationProps.y = 0;
          }

          if (delay !== undefined) {
            animationProps.delay = delay;
          }

          const st = gsap.to(split.chars, animationProps).scrollTrigger;
          if (st) scrollTriggers.push(st);
        } else {
          const animationProps: any = {
            opacity: finalOpacity,
            stagger,
            ease,
            duration,
            clearProps: 'willChange',
            scrollTrigger: scrollTriggerConfig,
          };

          if (y !== 0) {
            animationProps.y = 0;
          }

          if (delay !== undefined) {
            animationProps.delay = delay;
          }

          const st = gsap.fromTo(
            split.chars,
            { opacity: initialOpacity, y },
            animationProps
          ).scrollTrigger;
          if (st) scrollTriggers.push(st);
        }
      });

      return () => {
        scrollTriggers.forEach(st => st?.kill());
        splits.forEach(split => split.revert());
      };
    },
    { scope: textRef }
  );

  return (
    <Component ref={textRef} className={className}>
      {children}
    </Component>
  );
}

