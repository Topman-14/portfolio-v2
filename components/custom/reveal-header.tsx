'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { getFontsReady } from '@/lib/fonts-ready';
import { cn } from '@/lib/utils';

type RevealHeaderProps = {
  title: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  className?: string;
};

export const RevealHeader = ({
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  className,
}: RevealHeaderProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const splits: SplitType[] = [];
    const scrollTriggers: ScrollTrigger[] = [];

    getFontsReady().then(() => {
      const heading = headingRef.current;
      const subheading = subheadingRef.current;

      if (heading) {
        const split = new SplitType(heading, { types: 'chars' });
        splits.push(split);
        gsap.set(split.chars, { willChange: 'opacity, transform' });
        const st = gsap.fromTo(
          split.chars,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: 'expo.out',
            clearProps: 'willChange',
            scrollTrigger: {
              trigger: heading,
              start: 'top 80%',
            },
          }
        ).scrollTrigger;
        if (st) scrollTriggers.push(st);
      }

      if (subheading) {
        const split = new SplitType(subheading, { types: 'words' });
        splits.push(split);
        gsap.set(split.words, { willChange: 'opacity, transform' });
        const st = gsap.fromTo(
          split.words,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.04,
            ease: 'power2.out',
            clearProps: 'willChange',
            scrollTrigger: {
              trigger: subheading,
              start: 'top 85%',
            },
          }
        ).scrollTrigger;
        if (st) scrollTriggers.push(st);
      }
    });

    return () => {
      scrollTriggers.forEach((st) => st?.kill());
      splits.forEach((split) => split.revert());
    };
  });

  return (
    <div className={cn(className)}>
      <h2
        ref={headingRef}
        className={cn('generic-h2', titleClassName)}
        aria-label={title}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          ref={subheadingRef}
          className={cn(
            'generic-subtitle mt-2',
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};

