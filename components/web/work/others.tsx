'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { GButton } from '@/components/ui/gbutton';
import { getFontsReady } from '@/lib/fonts-ready';
import { useQuery } from '@/hooks/use-query';
import Logo from '@/components/ui/logo';
import WorkCard from './others-work-card';
import { Work } from '@prisma/client';

const OtherWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
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
      if (!sectionRef.current || !showAll) return;

      const splits: SplitType[] = [];
      const scrollTriggers: ScrollTrigger[] = [];

      getFontsReady().then(() => {
        const heading = headingRef.current;

        if (heading) {
          const split = new SplitType(heading, { types: 'words' });
          splits.push(split);
          gsap.set(split.words, { willChange: 'opacity, transform' });
          const st = gsap.fromTo(
            split.words,
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

        const cards = sectionRef.current?.querySelectorAll('.work-card');
        if (cards) {
          gsap.set(cards, { willChange: 'opacity, transform' });
          const st = gsap.fromTo(
            cards,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power3.out',
              clearProps: 'willChange',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
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
    { scope: sectionRef, dependencies: [showAll, works] }
  );

  return (
    <section
      ref={sectionRef}
      className={`relative ${showAll ? 'min-h-screen' : ''} py-32 px-4 md:px-8 lg:px-16`}
    >
      <div className='max-w-7xl mx-auto'>
        {showAll ? (
          <>
            <h2
              ref={headingRef}
              className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-16 text-right'
            >
              Other Stuff
            </h2>

            {loading ? (
              <div className='flex justify-center items-center min-h-[400px]'>
                <div className='animate-pulse'>
                  <Logo color='white' width={64} height={64} />
                </div>
              </div>
            ) : works.length > 0 ? (
              <div className='flex flex-wrap gap-4'>
                {works.map((work) => (
                  <WorkCard key={work.id} work={work} />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className='text-center'>
            <GButton onClick={() => setShowAll(true)} disabled={loading} variant='green'>
              {loading ? 'Loading...' : 'See More Projects'}
            </GButton>
          </div>
        )}
      </div>
    </section>
  );
};

export default OtherWorksSection;
