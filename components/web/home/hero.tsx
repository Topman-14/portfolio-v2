'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplinePlayer from '@/components/custom/spline';
import SplitType from 'split-type';

export const Hero = () => {
  const introRef = useRef<HTMLParagraphElement>(null);
  const bigTextRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const intro = introRef.current;
    const bigText = bigTextRef.current;
    const description = descriptionRef.current;

    if (!intro || !bigText || !description) return;

    document.fonts.ready.then(() => {
      const tl = gsap.timeline({
        delay: 0.2,
        // repeat: -1,
        // repeatDelay: 0.5
      });

      const introSplit = new SplitType(intro, { types: 'lines' });

      const bigTextSplit = new SplitType(bigText, { types: 'words,chars' });

      const descriptionSplit = new SplitType(description, { types: 'words' });

      tl.fromTo(
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
          }
        );
    });
  });

  return (
    <section className='relative min-h-screen bg1 overflow-hidden'>
      <div className='relative z-10 flex lg:items-center justify-center min-h-screen px-4 md:px-8 lg:px-16'>
        <div className='max-w-7xl w-full md:pt-32 pb-40 xl:max-w-6xl'>
          <p
            ref={introRef}
            className='text-xl md:text-4xl text-white/80 mb-4 font-sans font-semibold'
          >
            Tope Akinkuade
          </p>

          <h1
            ref={bigTextRef}
            className='text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white leading-[1.1] mb-8 text-left max-w-4xl'
          >
            Reformed Perfectionist, <br />
            <span className='text-malachite'>Present Realist.</span>
          </h1>

          <p
            ref={descriptionRef}
            className='text-sm md:text-base text-white/80 font-semibold max-w-xl leading-relaxed font-sans'
          >
            I&apos;m a Product engineer that works across the stack to create
            systems that balance precision and practicality. <br />
            From architecture to deployment, I build infrastructure nobody
            notices; until it&apos;s missing.
          </p>
        </div>
      </div>

      <div className='absolute bottom-32 right-12 size-[600px] z-[15] pointer-events-none'>
        <SplinePlayer
          scene='/3d/hero.splinecode'
          draggable={true}
          className='w-full h-full'
          cameraPosition={{ x: 50, y: -90, z: 380 }}
          cameraRotation={{ x: -0.05, y: -0.15, z: 0 }}
          disableZoom={true}
          interactive={true}
          zoom={1.5}
        />
      </div>
    </section>
  );
};
