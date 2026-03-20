'use client';

import { useRef } from 'react';
import type { Work } from '@prisma/client';
import { RevealHeader } from '@/components/custom/reveal-header';
import { WorkCard } from './work-card';
import OtherWorksSection from './others';
import { cn } from '@/lib/utils';

type WorksBentoGridProps = {
  works: Work[];
  otherWorks: Work[];
};

export const WorksBentoGrid = ({ works, otherWorks }: WorksBentoGridProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  if (works.length === 0 && otherWorks.length === 0) {
    return (
      <section
        ref={sectionRef}
        className='relative bg3 px-4 py-24 md:py-28 lg:px-16'
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
      className='relative bg3 px-4 py-24 md:py-28 lg:px-16'
    >
      <div className='mx-auto max-w-wide'>
        {works.length > 0 ? (
          <>
            <RevealHeader
              title='Featured'
              subtitle='Selected builds — larger scope, shipped end-to-end.'
              className='mb-12 md:mb-14'
            />

            <ul className='grid list-none grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3 xl:gap-8'>
              {works.map((work, index) => (
                <li
                  key={work.id}
                  className={cn(
                    'min-w-0',
                    index === 0 && 'md:col-span-2'
                  )}
                >
                  <WorkCard work={work} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className='mb-12 text-center font-sans text-lg text-white/65'>
            No featured highlights right now — browse more work below.
          </p>
        )}
      </div>

      {otherWorks.length > 0 ? (
        <OtherWorksSection initialWorks={otherWorks} />
      ) : null}
    </section>
  );
};
