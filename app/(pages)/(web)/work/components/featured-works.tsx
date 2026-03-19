'use client';

import { useRef } from 'react';
import { Work } from '@prisma/client';
import { RevealHeader } from '@/components/custom/reveal-header';
import { FeaturedWorkCard } from './featured-work-card';
import OtherWorksSection from './others';

export const WorksBentoGrid = ({ works }: { works: Work[] }) => {
  const sectionRef = useRef<HTMLElement>(null);

  if (works.length === 0) {
    return (
      <section
        ref={sectionRef}
        className='relative bg3 px-4 py-24 md:px-8 md:py-28 lg:px-16'
      >
        <div className='mx-auto max-w-7xl text-center'>
          <h2 className='mb-4 font-display text-4xl font-bold text-white md:text-5xl'>
            No projects yet
          </h2>
          <p className='font-sans text-lg text-white/70'>
            Check back soon for new work.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className='relative bg3 px-4 py-24 md:px-8 md:py-28 lg:px-16'
    >
      <div className='mx-auto max-w-7xl'>
        <RevealHeader
          title='Featured'
          subtitle='Selected builds — larger scope, shipped end-to-end.'
          className='mb-12 md:mb-14'
        />

        <ul className='grid list-none grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3 xl:gap-8'>
          {works.map((work) => (
            <li key={work.id} className='min-w-0'>
              <FeaturedWorkCard work={work} />
            </li>
          ))}
        </ul>
      </div>

      <OtherWorksSection />
    </section>
  );
};
