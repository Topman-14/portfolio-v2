'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { GButton } from '@/components/ui/gbutton';
import { ArrowRight } from 'lucide-react';
import SplinePlayer from '@/components/custom/spline';
import Parallax from '@/components/animations/parallax';
import { getFontsReady } from '@/lib/fonts-ready';

const skills = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Nest.js',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'AWS',
  'React Native',
];

const values = [
  {
    title: 'Clarity',
    description:
      'I believe in building systems that are easy to understand and maintain. Code should tell a story.',
  },
  {
    title: 'Performance',
    description:
      'Every decision is made with performance in mind. Fast, efficient systems that scale gracefully.',
  },
  {
    title: 'Pragmatism',
    description:
      'Balance between perfection and shipping. The best solution is one that works in production.',
  },
];

export const AboutContent = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const splits: SplitType[] = [];
      const scrollTriggers: ScrollTrigger[] = [];

      getFontsReady().then(() => {
        const heading = headingRef.current;
        const intro = introRef.current;

        if (heading) {
          const split = new SplitType(heading, { types: 'words' });
          splits.push(split);
          const st = gsap.fromTo(
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
                start: 'top 85%',
              },
            }
          ).scrollTrigger;
          if (st) scrollTriggers.push(st);
        }

        if (intro) {
          const split = new SplitType(intro, { types: 'words' });
          splits.push(split);
          const st = gsap.fromTo(
            split.words,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.01,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: intro,
                start: 'top 85%',
              },
            }
          ).scrollTrigger;
          if (st) scrollTriggers.push(st);
        }
      });

      return () => {
        scrollTriggers.forEach(st => st?.kill());
        splits.forEach(split => split.revert());
      };
    },
    { scope: sectionRef }
  );

  return (
    <main>
      <section
        ref={sectionRef}
        className='relative bg1x min-h-screen py-32 px-4 md:px-8 lg:px-16'
      >
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className='space-y-8'>
              <h1
                ref={headingRef}
                className='text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white leading-tight'
              >
                About
              </h1>

              <p
                ref={introRef}
                className='text-white text-xl md:text-2xl leading-relaxed font-sans'
              >
                I&apos;m a software engineer who&apos;s spent the last few years
                building products across logistics, fintech, and business
                infrastructure. I&apos;ve worked with teams of all sizes to create
                tools that power real operations from supply chain platforms used
                by truck drivers to modular business systems for enterprises.
              </p>

              <p className='text-white text-xl md:text-2xl leading-relaxed font-sans'>
                My focus is on clarity, performance, and systems that scale without
                unnecessary complexity.
              </p>

              <p className='text-white text-xl md:text-2xl leading-relaxed font-sans'>
                Alongside engineering, I&apos;m big on design thinking, not in the
                corporate sense, but in the way a product feels when it&apos;s
                used. My work sits at the intersection of function and pragmatism.
              </p>
            </div>

            <div
              ref={imageContainerRef}
              className='relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            >
              <Parallax speed={-20} trigger={imageContainerRef}>
                <Image
                  src='/img/jpg/me.jpg'
                  alt='Tope Akinkuade'
                  fill
                  className='object-cover'
                  priority
                />
              </Parallax>
            </div>
          </div>
        </div>
      </section>

      <section className='relative bg2 py-32 px-4 md:px-8 lg:px-16'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-16'>
            Values
          </h2>

          <div
            ref={valuesRef}
            className='grid grid-cols-1 md:grid-cols-3 gap-8'
          >
            {values.map((value, index) => (
              <div
                key={value.title}
                className='p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10'
              >
                <h3 className='text-2xl font-display font-bold text-white mb-4'>
                  {value.title}
                </h3>
                <p className='text-white/70 text-base leading-relaxed font-sans'>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative bg3 py-32 px-4 md:px-8 lg:px-16'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className='space-y-8'>
              <h2 className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white'>
                Skills & Tools
              </h2>
              <p className='text-white/80 text-lg md:text-xl leading-relaxed font-sans'>
                Technologies I work with to build products that matter.
              </p>
              <div className='flex flex-wrap gap-3'>
                {skills.map((skill) => (
                  <Badge key={skill} variant='white' className='text-sm px-4 py-2'>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className='relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10'>
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

      <section className='relative bg4 py-32 px-4 md:px-8 lg:px-16'>
        <div className='max-w-7xl mx-auto text-center space-y-8'>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white'>
            Let&apos;s Work Together
          </h2>
          <p className='text-white/80 text-lg md:text-xl leading-relaxed font-sans max-w-2xl mx-auto'>
            I&apos;m always open to discussing new opportunities and exciting
            projects. Whether you have a question or just want to say hi, I&apos;ll
            try my best to get back to you!
          </p>
          <GButton href='mailto:topeakinkuade78@gmail.com' className='group'>
            <span>Get In Touch</span>
            <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
          </GButton>
        </div>
      </section>
    </main>
  );
};

