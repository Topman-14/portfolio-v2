'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import SplinePlayer from '@/components/custom/spline';
import { getFontsReady } from '@/lib/fonts-ready';

export const WorksHero = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const heading = headingRef.current;
    const description = descriptionRef.current;

    if (!heading || !description) return;

    const splits: SplitType[] = [];
    const animations: gsap.core.Tween[] = [];

    getFontsReady().then(() => {
      const headingSplit = new SplitType(heading, { types: 'chars' });
      const descriptionSplit = new SplitType(description, { types: 'words' });
      splits.push(headingSplit, descriptionSplit);

      const headingAnim = gsap.fromTo(
        headingSplit.chars,
        { opacity: 0, y: 50, rotationX: -90 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1,
          stagger: 0.05,
          ease: 'back.out(1.7)',
        }
      );
      animations.push(headingAnim);

      const descAnim = gsap.fromTo(
        descriptionSplit.words,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: 'power3.out',
          delay: 0.5,
        }
      );
      animations.push(descAnim);
    });

    return () => {
      animations.forEach(anim => anim.kill());
      splits.forEach(split => split.revert());
    };
  }, { scope: containerRef });

  return (
    <section className='relative bg3 min-h-screen flex items-center justify-center overflow-hidden'>
      <div ref={containerRef} className='relative z-10 max-w-7xl mx-auto px-4'>
        <div className='flex flex-col items-center justify-center text-center'>
          <div className='w-full max-w-[800px] max-h-[800px] md:h-[500px] lg:h-[700px] -mb-6'>
            <SplinePlayer
              scene='/3d/sparkles.splinecode'
              draggable={true}
              className='w-full h-full'
              cameraPosition={{ x: 50, y: -90, z: 380 }}
              cameraRotation={{ x: -0.05, y: -0.15, z: 0 }}
              disableZoom={true}
              interactive={true}
            />
          </div>
          
          <div className='space-y-6 max-w-4xl'>
            <h1
              ref={headingRef}
              className='text-5xl md:text-6xl lg:text-8xl font-display font-bold text-white leading-tight'
            >
              My Work
            </h1>
            <p
              ref={descriptionRef}
              className='text-white/80 text-lg md:text-xl lg:text-2xl leading-relaxed font-sans'
            >
              A collection of projects I&apos;ve built — from internal dashboards to
              public-facing apps, each representing a unique challenge and
              solution.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
