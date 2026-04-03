'use client';

import { useMemo, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import { getFontsReady } from '@/lib/fonts-ready';
import { RevealHeader } from '@/components/custom/reveal-header';

export type ExperienceListItem = {
  id: string;
  jobTitle: string;
  company: string;
  location?: string | null;
  description: string;
  startDate: string;
  endDate?: string | null;
  isCurrentRole: boolean;
  skills: string[];
  achievements: string[];
};

function sortExperiences(list: ExperienceListItem[]) {
  return [...list].sort((a, b) => {
    if (a.isCurrentRole !== b.isCurrentRole) {
      return a.isCurrentRole ? -1 : 1;
    }
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });
}

type ExperienceSectionProps = {
  experiences: ExperienceListItem[];
};

export const ExperienceSection = ({ experiences }: ExperienceSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  const ordered = useMemo(() => sortExperiences(experiences), [experiences]);

  useGSAP(
    () => {
      if (!sectionRef.current || ordered.length === 0) return;

      const scrollTriggers: ScrollTrigger[] = [];

      getFontsReady().then(() => {
        const items = sectionRef.current?.querySelectorAll('.experience-item');
        if (items?.length) {
          gsap.set(items, { willChange: 'opacity, transform' });
          for (const item of items) {
            const st = gsap
              .fromTo(
                item,
                { opacity: 0, y: 28 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.55,
                  ease: 'power2.out',
                  clearProps: 'willChange',
                  scrollTrigger: {
                    trigger: item,
                    start: 'top 88%',
                  },
                }
              )
              .scrollTrigger;
            if (st) scrollTriggers.push(st);
          }
        }
      });

      return () => {
        for (const st of scrollTriggers) {
          st?.kill();
        }
      };
    },
    { scope: sectionRef, dependencies: [ordered] }
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section
      ref={sectionRef}
      className='relative bg3 px-4 py-24 md:px-8 md:py-28 lg:px-16'
    >
      <div className='mx-auto max-w-wide'>
        {ordered.length > 0 ? (
          <>
            <RevealHeader
              title='Experience'
              subtitle='Roles and teams — most recent first; current role at the top.'
              className='mb-12 md:mb-14'
            />

            <div className='flex flex-col gap-6 md:gap-8'>
              {ordered.map((exp) => (
                <article
                  key={exp.id}
                  className={`experience-item rounded-2xl border p-6 md:p-8 ${
                    exp.isCurrentRole
                      ? 'border-malachite/35 bg-malachite/[0.06] ring-1 ring-malachite/20'
                      : 'border-white/10 bg-white/[0.03]'
                  } backdrop-blur-sm`}
                >
                  <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10'>
                    <div className='min-w-0 flex-1 space-y-3'>
                      <p className='font-sans text-sm text-white/50'>
                        {formatDate(exp.startDate)}
                        {' — '}
                        {exp.isCurrentRole ? (
                          <span className='font-medium text-malachite'>Present</span>
                        ) : exp.endDate ? (
                          formatDate(exp.endDate)
                        ) : (
                          <span className='font-medium text-malachite'>Present</span>
                        )}
                      </p>
                      <div>
                        <h3 className='font-display text-2xl font-bold text-white md:text-3xl'>
                          {exp.jobTitle}
                        </h3>
                        <p className='mt-1 font-sans text-lg font-semibold text-malachite md:text-xl'>
                          {exp.company}
                        </p>
                        {exp.location ? (
                          <p className='mt-1 font-sans text-sm text-white/55'>
                            {exp.location}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <p className='mt-5 font-sans text-base leading-relaxed text-white/75 md:text-lg'>
                    {exp.description}
                  </p>

                  {exp.achievements.length > 0 ? (
                    <div className='mt-6 border-t border-white/10 pt-6'>
                      <h4 className='mb-3 font-display text-sm font-semibold uppercase tracking-wide text-white/80'>
                        Highlights
                      </h4>
                      <ul className='space-y-2 font-sans text-white/70'>
                        {exp.achievements.map((achievement) => (
                          <li
                            key={achievement}
                            className='flex gap-3 text-sm leading-relaxed md:text-base'
                          >
                            <span
                              className='mt-2 h-1 w-1 shrink-0 rounded-full bg-malachite/80'
                              aria-hidden
                            />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {exp.skills.length > 0 ? (
                    <div className='mt-6 flex flex-wrap gap-2'>
                      {exp.skills.map((skill) => (
                        <span
                          key={skill}
                          className='rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-sans text-xs text-white/75 md:text-sm'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </>
        ) : (
          <p className='text-center font-sans text-white/50'>
            No experience entries yet.
          </p>
        )}
      </div>
    </section>
  );
};
