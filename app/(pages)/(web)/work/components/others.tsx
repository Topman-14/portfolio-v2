'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import { GButton } from '@/components/ui/gbutton';
import { getFontsReady } from '@/lib/fonts-ready';
import { useQuery } from '@/hooks/use-query';
import Logo from '@/components/ui/logo';
import WorkCard from './others-work-card';
import { Work } from '@prisma/client';
import { RevealHeader } from '@/components/custom/reveal-header';

const OtherWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [showAll, setShowAll] = useState(false);

  const { data: works = [], isLoading: loading } = useQuery<Work[]>(
    '/works',
    {
      enabled: showAll,
      params: { featured: 'false' },
    }
  );

  useGSAP(
    () => {
      if (!sectionRef.current || !showAll || works.length === 0) return;

      const scrollTriggers: ScrollTrigger[] = [];

      getFontsReady().then(() => {
        const cards = sectionRef.current?.querySelectorAll('.work-card');
        if (cards?.length) {
          gsap.set(cards, { willChange: 'opacity, transform' });
          const st = gsap
            .fromTo(
              cards,
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.06,
                ease: 'power2.out',
                clearProps: 'willChange',
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: 'top 82%',
                },
              }
            )
            .scrollTrigger;
          if (st) scrollTriggers.push(st);
        }
      });

      return () => {
        for (const st of scrollTriggers) {
          st?.kill();
        }
      };
    },
    { scope: sectionRef, dependencies: [showAll, works] }
  );

  return (
    <section
      ref={sectionRef}
      className={`relative ${showAll ? 'pt-20 md:pt-24' : 'pt-16 md:pt-20'} px-4 md:px-8 lg:px-16`}
    >
      <div className='mx-auto max-w-7xl'>
        {showAll ? (
          <>
            <RevealHeader
              title='More work'
              subtitle='Additional projects not highlighted in featured.'
              className='mb-10 md:mb-12'
            />

            {loading ? (
              <div className='flex min-h-[280px] items-center justify-center'>
                <div className='animate-pulse'>
                  <Logo color='white' width={56} height={56} />
                </div>
              </div>
            ) : works.length > 0 ? (
              <ul className='grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
                {works.map((work) => (
                  <li key={work.id} className='min-w-0'>
                    <WorkCard work={work} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-center font-sans text-white/55'>
                No other projects in the archive yet.
              </p>
            )}
          </>
        ) : (
          <div className='flex justify-center border-t border-white/10 pt-14 md:pt-16'>
            <GButton
              onClick={() => setShowAll(true)}
              disabled={loading}
              variant='green'
            >
              {loading ? 'Loading…' : 'See more projects'}
            </GButton>
          </div>
        )}
      </div>
    </section>
  );
};

export default OtherWorksSection;
