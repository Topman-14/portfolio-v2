'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplinePlayer from '@/components/custom/spline';
import SplitType from 'split-type';
import { getFontsReady } from '@/lib/fonts-ready';

export const Hero = () => {
  const introRef = useRef<HTMLParagraphElement>(null);
  const bigTextRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const intro = introRef.current;
    const bigText = bigTextRef.current;
    const description = descriptionRef.current;

    if (!intro || !bigText || !description) return;

    const splits: SplitType[] = [];
    let timeline: gsap.core.Timeline | null = null;

    getFontsReady().then(() => {
      timeline = gsap.timeline({
        delay: 1.5,
      });

      const introSplit = new SplitType(intro, { types: 'lines' });
      const bigTextSplit = new SplitType(bigText, { types: 'words,chars' });
      const descriptionSplit = new SplitType(description, { types: 'words' });
      splits.push(introSplit, bigTextSplit, descriptionSplit);

      gsap.set([bigTextSplit.chars, introSplit.lines, descriptionSplit.words], {
        willChange: 'opacity, transform',
      });

      timeline.fromTo(
        bigTextSplit.chars,
        { opacity: 0, yPercent: 50 },
        {
          opacity: 1,
          yPercent: 0,
          duration: 0.7,
          ease: 'expo.out',
          stagger: { amount: 0.6, from: 'start' },
        }
      )
        .fromTo(
          introSplit.lines,
          {
            opacity: 0,
            y: 20,
          },
          {
            duration: 0.6,
            opacity: 1,
            y: 0,
            ease: 'expo.out',
          }
        )
        .fromTo(
          descriptionSplit.words,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.3,
            stagger: 0.02,
            ease: 'expo.out',
            clearProps: 'willChange',
          }
        );
    });

    return () => {
      if (timeline) timeline.kill();
      splits.forEach(split => split.revert());
    };
  });

  return (
    <section className='relative bg1 overflow-hidden pb-5 md:pb-0'>
      <div className='relative z-10 flex lg:items-center justify-center min-h-screen px-4 md:px-8 lg:px-16 flex-col md:flex-row'>
        <div className='lg:max-w-6xl w-full pt-20 md:pt-32 pb-20 md:pb-48 xl:max-w-7xl z-[20]'>
          <p
            ref={introRef}
            className='text-xl md:text-4xl text-white/80 mb-4 font-sans font-semibold'
          >
            Tope Akinkuade
          </p>

          <h1
            ref={bigTextRef}
            className='sm:text-6xl text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white leading-[1.1] mb-8 text-left max-w-4xl'
          >
            Reformed Perfectionist, <br />
            <span className='text-malachite'>Present Realist.</span>
          </h1>

          <p
            ref={descriptionRef}
            className='text-sm md:text-base text-white font-semibold max-w-xl leading-relaxed font-sans'
          >
            I&apos;m a Product engineer that works across the stack to create
            systems that balance precision and practicality. <br />
            From architecture to deployment, <br className='md:hidden' /> I build infrastructure nobody
            notices; until it&apos;s missing.
          </p>
        </div>
        <div className='md:absolute mx-auto xl:bottom-32 bottom-20 right-12 size-[300px] md:max-h-none lg:size-[500px] xl:size-[600px] z-[20] pointer-events-none'>
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
    </section>
  );
};
