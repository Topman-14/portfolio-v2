'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { ArrowRight } from 'lucide-react';
import { GButton } from '@/components/ui/gbutton';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraph1Ref = useRef<HTMLParagraphElement>(null);
  const paragraph2Ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      document.fonts.ready.then(() => {
        const heading = headingRef.current;
        const p1 = paragraph1Ref.current;
        const p2 = paragraph2Ref.current;

        if (heading) {
          const headingSplit = new SplitType(heading, { types: 'words' });
          gsap.fromTo(
            headingSplit.words,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.03,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
                end: 'top 50%',
              },
            }
          );
        }

        for (const p of [p1, p2]) {
          if (p) {
            const split = new SplitType(p, { types: 'chars' });
            
            gsap.set(split.chars, { opacity: 0.3 });

            gsap.to(split.chars, {
              opacity: 1,
              stagger: 0.008,
              ease: 'none',
              scrollTrigger: {
                trigger: p,
                start: 'top 75%',
                end: 'bottom 50%',
                scrub: 1,
              },
            });
          }
        }

        if (imageRef.current && imageContainerRef.current) {
          gsap.to(imageRef.current, {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: {
              trigger: imageContainerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className='relative lg:h-screen min-h-screen bg-black py-32 px-4 md:px-8 lg:px-16'
    >
      <div className='max-w-7xl mx-auto h-full'>
        <div className='flex gap-4 h-full'>
          <div className='mb-auto space-y-8 flex-1'>
            <h2
              ref={headingRef}
              className='text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white leading-tight'
            >
              About
            </h2>

            <p
              ref={paragraph1Ref}
              className='text-white/40 text-xl md:text-2xl leading-relaxed font-sans'
            >
              I&apos;m a software engineer who&apos;s spent the last few years
              building products across logistics, fintech, and business
              infrastructure. I&apos;ve worked with teams of all sizes to create
              tools that power real operations from supply chain platforms used
              by truck drivers to modular business systems for enterprises. My
              focus is on clarity, performance, and systems that scale without
              unnecessary complexity.
            </p>

            <p
              ref={paragraph2Ref}
              className='text-white/40 text-xl md:text-2xl leading-relaxed font-sans'
            >
              Alongside engineering, I&apos;m big on design thinking, not in the
              corporate sense, but in the way a product feels when it&apos;s
              used. My work sits at the intersection of function and pragmatism.
            </p>

            <GButton href='/about' className='mt-8 group'>
              <span>Read Full Story</span>
              <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
            </GButton>
          </div>

          <div
            ref={imageContainerRef}
            className='relative  max-w-[400px] h-[400px] lg:h-[500px] overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] mt-auto flex-1'
          >
            <div
              ref={imageRef}
              className='absolute inset-0 -top-[10%] -bottom-[10%]'
            >
              <Image
                src='/img/jpg/me.jpg'
                alt='Tope Akinkuade'
                fill
                className='object-cover'
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};