'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

type Experience = {
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

export const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/experiences');
        if (response.ok) {
          const data = await response.json();
          setExperiences(data);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      document.fonts.ready.then(() => {
        const heading = headingRef.current;

        if (heading) {
          const split = new SplitType(heading, { types: 'words' });
          gsap.fromTo(
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
          );
        }

        const items = sectionRef.current?.querySelectorAll('.experience-item');
        if (items) {
          gsap.fromTo(
            items,
            { opacity: 0, x: -50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
              },
            }
          );
        }
      });
    },
    { scope: sectionRef, dependencies: [experiences] }
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

  if (loading) {
    return (
      <section ref={sectionRef} className='relative bg3 min-h-screen py-32 px-4 md:px-8 lg:px-16'>
        <div className='max-w-7xl mx-auto text-center'>
          <p className='text-white/70 text-lg font-sans'>Loading experience...</p>
        </div>
      </section>
    );
  }

  if (experiences.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className='relative bg3 min-h-screen py-32 px-4 md:px-8 lg:px-16'>
      <div className='max-w-7xl mx-auto'>
        <h2
          ref={headingRef}
          className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-16 text-center'
        >
          Experience
        </h2>

        <div className='space-y-12'>
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className='experience-item relative pl-8 md:pl-12 border-l-2 border-white/20'
            >
              <div className='absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-malachite border-4 border-coal' />
              
              <div className='space-y-4'>
                <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-3 flex-wrap'>
                      <h3 className='text-2xl md:text-3xl font-display font-bold text-white'>
                        {exp.jobTitle}
                      </h3>
                      <span className='text-malachite text-lg font-sans font-semibold'>
                        @ {exp.company}
                      </span>
                    </div>
                    {exp.location && (
                      <p className='text-white/60 text-sm font-sans'>{exp.location}</p>
                    )}
                  </div>
                  
                  <div className='flex flex-col items-start md:items-end gap-1'>
                    <span className='text-amber text-2xl md:text-3xl font-display font-bold'>
                      {getYear(exp.startDate)}
                    </span>
                    <span className='text-white/70 text-sm font-sans'>
                      {formatDate(exp.startDate)} -{' '}
                      {exp.isCurrentRole ? (
                        <span className='text-malachite'>Present</span>
                      ) : exp.endDate ? (
                        formatDate(exp.endDate)
                      ) : (
                        'Present'
                      )}
                    </span>
                  </div>
                </div>

                <p className='text-white/80 text-base md:text-lg leading-relaxed font-sans max-w-3xl'>
                  {exp.description}
                </p>

                {exp.achievements.length > 0 && (
                  <div className='space-y-2'>
                    <h4 className='text-white/90 text-lg font-display font-semibold'>
                      Key Achievements:
                    </h4>
                    <ul className='list-disc list-inside space-y-1 text-white/70 font-sans'>
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className='pl-2'>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.skills.length > 0 && (
                  <div className='flex flex-wrap gap-2 pt-2'>
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className='px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-sans'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

