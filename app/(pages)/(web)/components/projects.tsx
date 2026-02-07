'use client';

import { useMemo, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import Marquee from 'react-fast-marquee';

import { Work } from '@prisma/client';
import { ProjectCard } from './project-card';
import { getFontsReady } from '@/lib/fonts-ready';
import { useQuery } from '@/hooks/use-query';

export const Projects = () => {
  const { data: works = [], isLoading } = useQuery<Work[]>('/api/works', {
    params: { featured: 'true', limit: '10' },
  });
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);

  const movingGrid = useMemo(() => {
    if (works.length === 0) return [];
    const cut = Math.ceil(works.length / 3);
    const [a, b, c] = [works.slice(0, cut), works.slice(cut, cut * 2), works.slice(cut * 2)];
    return [
      { dir: 'left' as const, speed: 30, data: [...a, ...b, ...a] },
      { dir: 'right' as const, speed: 25, data: [...c, ...b, ...b] },
      { dir: 'left' as const, speed: 40, data: [...c, ...c, ...a] },
    ];
  }, [works]);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

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
    },
    { scope: sectionRef }
  );

  if (isLoading) {
    return (
      <section className='relative min-h-screen py-32 overflow-hidden'>
        <div className='max-w-7xl mx-auto mb-12 px-4 md:px-8 lg:px-16'>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6'>
            Products
          </h2>
          <p className='text-white/70 text-base md:text-lg leading-relaxed font-sans max-w-3xl'>
            Loading...
          </p>
        </div>
      </section>
    );
  }

  if (works.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className='relative min-h-screen py-32 overflow-hidden'
    >
      <div className='max-w-7xl mx-auto mb-12 px-4 md:px-8 lg:px-16'>
        <h2
          ref={headingRef}
          className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6'
        >
          Products
        </h2>
        <p
          ref={subheadingRef}
          className='text-white/70 text-base md:text-lg leading-relaxed font-sans max-w-3xl'
        >
          A collection of tools, systems, and experiments I&apos;ve built — from
          internal dashboards to public-facing apps. Hover on each row to pause
          and explore.
        </p>
      </div>

      <div className='space-y-6'>
        {movingGrid.map((row, rowIndex) => (
          <Marquee
            key={rowIndex}
            direction={row.dir}
            speed={row.speed}
            pauseOnHover
            className='py-4'
          >
            {row.data.map((work, index) => (
              <ProjectCard
                key={`${work.id}-${index}`}
                work={work}
                index={index}
                isMarquee
              />
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
};
