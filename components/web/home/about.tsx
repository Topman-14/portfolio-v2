'use client';

import { useRef, useMemo } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { ArrowRight } from 'lucide-react';
import { GButton } from '@/components/ui/gbutton';
import Image from 'next/image';
import Parallax from '@/components/animations/parallax';
import { getFontsReady } from '@/lib/fonts-ready';

export const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraph1Ref = useRef<HTMLParagraphElement>(null);
  const paragraph2Ref = useRef<HTMLParagraphElement>(null);

  const imageData = useMemo(() => [
    {
      src: '/img/jpg/me.jpg',
      alt: 'Tope Akinkuade',
      speed: -20,
      colSpan: 'col-span-2',
      height: 'h-[200px] lg:h-[200px]',
      priority: true,
    },
    {
      src: '/img/jpg/me.jpg',
      alt: 'Tope Akinkuade',
      speed: -20,
      colSpan: 'col-span-1',
      height: 'h-[200px] lg:h-[200px]',
      priority: true,
    },
    {
      src: '/img/jpg/me.jpg',
      alt: 'Tope Akinkuade',
      speed: -15,
      colSpan: 'col-span-1',
      height: 'h-[200px] lg:h-[200px]',
      priority: false,
    },
    {
      src: '/img/jpg/me.jpg',
      alt: 'Tope Akinkuade',
      speed: -25,
      colSpan: 'col-span-2',
      height: 'h-[200px] lg:h-[200px]',
      priority: false,
    },
  ], []);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const splits: SplitType[] = [];
      const scrollTriggers: ScrollTrigger[] = [];

      getFontsReady().then(() => {
        const heading = headingRef.current;
        const p1 = paragraph1Ref.current;
        const p2 = paragraph2Ref.current;

        if (heading) {
          const headingSplit = new SplitType(heading, { types: 'chars' });
          splits.push(headingSplit);
          gsap.set(headingSplit.chars, { willChange: 'opacity, transform' });
          const headingST = gsap.fromTo(
            headingSplit.chars,
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
                start: 'top 85%',
                end: 'top 50%',
              },
            }
          ).scrollTrigger;
          if (headingST) scrollTriggers.push(headingST);
        }

        for (const p of [p1, p2]) {
          if (p) {
            const split = new SplitType(p, { types: 'words' });
            splits.push(split);
            
            gsap.set(split.words, { opacity: 0.3, willChange: 'opacity' });

            const pST = gsap.to(split.words, {
              opacity: 1,
              stagger: 0.008,
              ease: 'none',
              delay: 3.5,
              clearProps: 'willChange',
              scrollTrigger: {
                trigger: p,
                start: 'top 60%',
                end: 'bottom 20%',
                scrub: 0.5,
              },
            }).scrollTrigger;
            if (pST) scrollTriggers.push(pST);
          }
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
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className='relative lg:h-screen min-h-screen py-32 px-4 md:px-8 lg:px-16 bg1x'
    >
      <div className='max-w-7xl mx-auto h-full flex gap-4 md:gap-6 lg:gap-10 flex-col lg:flex-row'>
          <div className='mb-auto space-y-8 flex-1'>
            <h2
              ref={headingRef}
              className='text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white leading-tight'
            >
              About
            </h2>

            <p
              ref={paragraph1Ref}
              className='text-white text-xl leading-relaxed font-sans'
            >
              I&apos;m a software engineer based in Lagos, who&apos;s spent the last few years
              building products across logistics, fintech, and business
              infrastructure. I&apos;ve worked with teams of all sizes to create
              tools that power real operations from supply chain platforms used
              by truck drivers to modular business systems for enterprises. My
              focus is on clarity, performance, and systems that scale without
              unnecessary complexity.
            </p>

            <p
              ref={paragraph2Ref}
              className='text-white text-xl leading-relaxed font-sans'
            >
              Alongside engineering, I&apos;m big on design thinking, not in the
              corporate sense, but in the way a product feels when it&apos;s
              used. My work sits at the intersection of function and pragmatism.
            </p>
            {/* todo: fix this text */}

            <GButton href='/about' className='mt-8 group'>
              <span>Read Full Story</span>
              <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
            </GButton>
          </div>

          <div
            ref={imageContainerRef}
            className='relative mt-auto flex-1 grid grid-cols-3 gap-4 lg:max-w-[500px]'
          >
            {imageData.map((image, index) => (
              <div
                key={`${image.src}-${image.speed}-${index}`}
                className={`${image.colSpan} relative ${image.height} overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]`}
              >
                <Parallax speed={image.speed} trigger={imageContainerRef}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className='object-cover'
                    priority={image.priority}
                  />
                </Parallax>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
};