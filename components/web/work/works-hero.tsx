'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import SplinePlayer from '@/components/custom/spline';

export const WorksHero = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const heading = headingRef.current;
    const description = descriptionRef.current;

    if (!heading || !description) return;

    document.fonts.ready.then(() => {
      const headingSplit = new SplitType(heading, { types: 'words' });
      const descriptionSplit = new SplitType(description, { types: 'words' });

      gsap.fromTo(
        headingSplit.words,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: 'expo.out',
        }
      );

      gsap.fromTo(
        descriptionSplit.words,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: 'power2.out',
          delay: 0.3,
        }
      );
    });
  });

  return (
    <section className='relative bg2 min-h-screen flex items-center justify-center overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-32'>
        <div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-16'>
          <div className='flex-1 space-y-6'>
            <h1
              ref={headingRef}
              className='text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white leading-tight'
            >
              My Work
            </h1>
            <p
              ref={descriptionRef}
              className='text-white/80 text-lg md:text-xl leading-relaxed font-sans max-w-2xl'
            >
              A collection of projects I&apos;ve built — from internal dashboards to
              public-facing apps. Each project represents a unique challenge and
              solution.
            </p>
          </div>
          <div className='w-full lg:w-[400px] h-[400px] lg:h-[500px] flex-shrink-0'>
            <SplinePlayer
              scene='/3d/hero.splinecode'
              draggable={true}
              className='w-full h-full'
              cameraPosition={{ x: 50, y: -90, z: 380 }}
              cameraRotation={{ x: -0.05, y: -0.15, z: 0 }}
              disableZoom={true}
              interactive={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

