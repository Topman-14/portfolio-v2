'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { getFontsReady } from '@/lib/fonts-ready';
import { Work } from '@prisma/client';
import BentoCard from './bento-card';
import OtherWorksSection from './others';
import { useViewport } from '@/hooks/use-viewport';

const layouts = [
  { colSpan: 4, rowSpan: 4 },
  { colSpan: 5, rowSpan: 2 },
  { colSpan: 3, rowSpan: 2 },
  { colSpan: 3, rowSpan: 2 },
  { colSpan: 5, rowSpan: 3 },
  { colSpan: 7, rowSpan: 3 },
  { colSpan: 2, rowSpan: 4 },
  { colSpan: 9, rowSpan: 2 },
  { colSpan: 6, rowSpan: 4 },
  { colSpan: 4, rowSpan: 3 },
  { colSpan: 8, rowSpan: 6 },
  { colSpan: 7, rowSpan: 6 },
];

export const WorksBentoGrid = ({ works }: { works: Work[] }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridAutoRows, setGridAutoRows] = useState('minmax(200px, 1fr)');
  const viewPort = useViewport();

  useEffect(() => {
    const updateRows = () => {
      if (viewPort.isDesktop) {
        setGridAutoRows('minmax(160px, 1fr)');
      } else if (viewPort.isTablet) {
        setGridAutoRows('minmax(150px, 1fr)');
        } else if (viewPort.isMobile) {
        setGridAutoRows('minmax(120px, 1fr)');
      } else {
        setGridAutoRows('minmax(130px, 1fr)');
      }
    };

    updateRows();
  }, [viewPort.isDesktop, viewPort.isTablet, viewPort.isMobile]);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const splits: SplitType[] = [];
      const scrollTriggers: ScrollTrigger[] = [];

      getFontsReady().then(() => {
        const heading = headingRef.current;

        if (heading) {
          const split = new SplitType(heading, { types: 'words' });
          splits.push(split);
          const st = gsap.fromTo(
            split.words,
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
      });

      return () => {
        for (const st of scrollTriggers) {
          st?.kill();
        }
        for (const split of splits) {
          split.revert();
        }
      };
    },
    { scope: sectionRef }
  );

  if (works.length === 0) {
    return (
      <section
        ref={sectionRef}
        className='relative bg3 min-h-screen py-32 px-4 md:px-8 lg:px-16'
      >
        <div className='max-w-7xl mx-auto text-center'>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6'>
            No projects yet
          </h2>
          <p className='text-white/70 text-lg font-sans'>
            Check back soon for exciting projects!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className='relative bg3 min-h-screen py-32 px-4 md:px-8 lg:px-16'
    >
      <div className='max-w-7xl mx-auto'>
        <h2
          ref={headingRef}
          className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-16'
        >
          Featured
        </h2>

        <div
          ref={gridRef}
          className='grid gap-4 grid-cols-1 md:grid-flow-dense'
          style={{
            gridTemplateColumns: viewPort.isMobile ? '1fr' : 'repeat(12, 1fr)',
            gridAutoRows: gridAutoRows,
          }}
        >
          {works.map((work, index) => {
            const size = layouts[index % layouts.length];
            return (
              <BentoCard
                key={work.id}
                work={work}
                colSpan={size.colSpan}
                rowSpan={size.rowSpan}
                isMobile={viewPort.isMobile}
              />
            );
          })}
        </div>
      </div>

      <OtherWorksSection />
    </section>
  );
};
