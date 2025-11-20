'use client';

import { useMemo, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import Marquee from 'react-fast-marquee';

import { Work } from '@prisma/client';
import { ProjectCard } from './project-card';
import { getFontsReady } from '@/lib/fonts-ready';

export const Projects = ({ works }: { works: Work[] }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);

  // const row1Works = works.slice(0, Math.ceil(works.length / 3));
  // const row2Works = works.slice(
  //   Math.ceil(works.length / 3),
  //   Math.ceil((works.length * 2) / 3)
  // );
  // const row3Works = works.slice(Math.ceil((works.length * 2) / 3));

  // const triplicatedRow1 = [...row1Works, ...row2Works, ...row1Works];
  // const triplicatedRow2 = [...row3Works, ...row2Works, ...row2Works];
  // const triplicatedRow3 = [...row3Works, ...row3Works, ...row1Works];

  // const movingGrid = [
  //   { dir: 'left', speed: 30, data: triplicatedRow1 },
  //   { dir: 'right', speed: 25, data: triplicatedRow2 },
  //   { dir: 'left', speed: 40, data: triplicatedRow3 },
  // ];

  const movingGrid = useMemo(() => {
    const cut = Math.ceil(works.length / 3);
    const [a, b, c] = [works.slice(0, cut), works.slice(cut, cut * 2), works.slice(cut * 2)];
    return [
      { dir: 'left',  speed: 30, data: [...a, ...b, ...a] },
      { dir: 'right', speed: 25, data: [...c, ...b, ...b] },
      { dir: 'left',  speed: 40, data: [...c, ...c, ...a] },
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
          const st = gsap.fromTo(
            split.chars,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.03,
              ease: 'expo.out',
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
          const st = gsap.fromTo(
            split.words,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.04,
              ease: 'power2.out',
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

  if (works.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className='relative min-h-screen bg3 py-32 overflow-hidden'
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
        {movingGrid.map(({ dir, speed, data }, idx) => (
          <Marquee
            key={idx}
            pauseOnHover
            direction={dir as 'left' | 'right'}
            speed={speed}
            autoFill
          >
            {data.map((work, i) => (
              <ProjectCard key={work.id} work={work} isMarquee index={i} />
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
};
