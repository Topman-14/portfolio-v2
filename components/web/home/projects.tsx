'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

gsap.registerPlugin(ScrollTrigger);

type Work = {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  tools: string[];
  githubLink?: string | null;
  liveUrl?: string | null;
  category?: string | null;
};

export const Projects = ({ works }: { works: Work[] }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);

  const row1Works = works.slice(0, Math.ceil(works.length / 3));
  const row2Works = works.slice(Math.ceil(works.length / 3), Math.ceil((works.length * 2) / 3));
  const row3Works = works.slice(Math.ceil((works.length * 2) / 3));

  const triplicatedRow1 = [...row1Works, ...row1Works, ...row1Works];
  const triplicatedRow2 = [...row2Works, ...row2Works, ...row2Works];
  const triplicatedRow3 = [...row3Works, ...row3Works, ...row3Works];

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      document.fonts.ready.then(() => {
        const heading = headingRef.current;
        const subheading = subheadingRef.current;

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

        if (subheading) {
          const split = new SplitType(subheading, { types: 'lines' });
          gsap.fromTo(
            split.lines,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.04,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: subheading,
                start: 'top 85%',
              },
            }
          );
        }
      });
    },
    { scope: sectionRef }
  );

  if (works.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className='relative min-h-screen bg3 py-32 overflow-hidden'
    >
      <div className='max-w-7xl mx-auto mb-12 px-4 md:px-8 lg:px-16'>
        <h2
          ref={headingRef}
          className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6'
        >
          Products
        </h2>
        <p
          ref={subheadingRef}
          className='text-white/70 text-base md:text-lg leading-relaxed font-sans max-w-3xl'
        >
          A collection of tools, systems, and experiments I&apos;ve built — from
          internal dashboards to public-facing apps. Hover on each row to pause
          and explore.
        </p>
      </div>

      <div className='space-y-6'>
        <MarqueeRow works={triplicatedRow1} direction='left' speed={40} />
        <MarqueeRow works={triplicatedRow2} direction='right' speed={35} />
        <MarqueeRow works={triplicatedRow3} direction='left' speed={45} />
      </div>
    </section>
  );
};

const MarqueeRow = ({
  works,
  direction,
  speed,
}: {
  works: Work[];
  direction: 'left' | 'right';
  speed: number;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useGSAP(
    () => {
      if (!rowRef.current) return;

      const row = rowRef.current;
      const scrollWidth = row.scrollWidth / 3;

      gsap.set(row, { x: direction === 'left' ? 0 : -scrollWidth });

      const animation = gsap.to(row, {
        x: direction === 'left' ? -scrollWidth : 0,
        duration: speed,
        ease: 'none',
        repeat: -1,
      });

      return () => {
        animation.kill();
      };
    },
    { scope: rowRef, dependencies: [isPaused] }
  );

  return (
    <div
      className='relative'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={rowRef}
        className='flex gap-6'
        style={{ willChange: 'transform' }}
      >
        {works.map((work, index) => (
          <ProjectCard key={`${work.id}-${index}`} work={work} index={index} isPaused={isPaused} />
        ))}
      </div>
    </div>
  );
};

const ProjectCard = ({
  work,
  index,
  isPaused,
}: {
  work: Work;
  index: number;
  isPaused: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!imageRef.current || !cardRef.current) return;

      const tl = gsap.timeline({ paused: true });

      tl.to(imageRef.current, {
        scale: 1.1,
        duration: 0.6,
        ease: 'power2.out',
      });

      if (isHovered && isPaused) {
        tl.play();
      } else {
        tl.reverse();
      }
    },
    { dependencies: [isHovered, isPaused], scope: cardRef }
  );

  const getCardWidth = (index: number) => {
    const widths = ['w-[350px]', 'w-[450px]', 'w-[400px]', 'w-[380px]', 'w-[420px]'];
    return widths[index % widths.length];
  };

  return (
    <Link
      href={`/work/${work.id}`}
      ref={cardRef}
      className={`relative flex-shrink-0 rounded-3xl overflow-hidden ${getCardWidth(
        index
      )} h-[300px] group cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={imageRef}
        className='absolute inset-0'
      >
        {work.image ? (
          <Image
            src={work.image}
            alt={work.title}
            fill
            className='object-cover'
          />
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-malachite/30 via-amber/20 to-bittersweet/30' />
        )}
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-t from-coal/95 via-coal/60 to-transparent transition-opacity duration-500 ${
          isHovered && isPaused ? 'opacity-100' : 'opacity-70'
        }`}
      />

      <div className='absolute inset-0 border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] group-hover:border-malachite/50 transition-all duration-300' />

      <div
        className={`absolute inset-0 p-6 flex flex-col justify-end transition-all duration-500 ${
          isHovered && isPaused ? 'gap-3' : 'gap-0'
        }`}
      >
        <h3 className='text-xl md:text-2xl font-display font-bold text-white'>
          {work.title}
        </h3>

        <p
          className={`text-white/80 text-sm leading-relaxed font-sans transition-all duration-500 overflow-hidden ${
            isHovered && isPaused ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {work.description}
        </p>

        <div
          className={`flex flex-wrap gap-2 transition-all duration-500 ${
            isHovered && isPaused ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {work.tools.slice(0, 3).map((tool) => (
            <Badge key={tool} variant='white' className='text-[10px] px-2 py-0.5'>
              {tool}
            </Badge>
          ))}
          {work.tools.length > 3 && (
            <Badge variant='default' className='text-[10px] px-2 py-0.5'>
              +{work.tools.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
};
