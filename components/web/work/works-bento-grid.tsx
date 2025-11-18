'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';

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

const gridSizes = [
  { cols: 4, rows: 3 },
  { cols: 3, rows: 2 },
  { cols: 5, rows: 3 },
  { cols: 2, rows: 2 },
  { cols: 4, rows: 2 },
  { cols: 3, rows: 4 },
  { cols: 2, rows: 3 },
  { cols: 5, rows: 2 },
];

export const WorksBentoGrid = ({ works }: { works: Work[] }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

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

        const cards = sectionRef.current?.querySelectorAll('.bento-card');
        if (cards) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 50, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.1,
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
    { scope: sectionRef }
  );

  if (works.length === 0) {
    return (
      <section ref={sectionRef} className='relative bg3 min-h-screen py-32 px-4 md:px-8 lg:px-16'>
        <div className='max-w-7xl mx-auto text-center'>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6'>
            No projects yet
          </h2>
          <p className='text-white/70 text-lg font-sans'>
            Check back soon for exciting projects!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className='relative bg3 min-h-screen py-32 px-4 md:px-8 lg:px-16'>
      <div className='max-w-7xl mx-auto'>
        <h2
          ref={headingRef}
          className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-16 text-center'
        >
          Featured Projects
        </h2>

        <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' style={{ gridAutoFlow: 'dense' }}>
          {works.map((work, index) => {
            const size = gridSizes[index % gridSizes.length];
            return (
              <BentoCard
                key={work.id}
                work={work}
                cols={size.cols}
                rows={size.rows}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

const BentoCard = ({
  work,
  cols,
  rows,
  index,
}: {
  work: Work;
  cols: number;
  rows: number;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!cardRef.current) return;

      if (isHovered) {
        gsap.to(cardRef.current, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(cardRef.current, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    },
    { scope: cardRef, dependencies: [isHovered] }
  );

  const getResponsiveSpan = () => {
    if (index === 0) return 'md:col-span-2 lg:col-span-3 xl:col-span-4';
    if (index === 1) return 'md:col-span-1 lg:col-span-2 xl:col-span-3';
    if (index === 2) return 'md:col-span-2 lg:col-span-2 xl:col-span-3';
    if (index === 3) return 'md:col-span-1 lg:col-span-1 xl:col-span-2';
    if (index === 4) return 'md:col-span-2 lg:col-span-2 xl:col-span-2';
    if (index === 5) return 'md:col-span-1 lg:col-span-2 xl:col-span-3';
    if (index === 6) return 'md:col-span-2 lg:col-span-1 xl:col-span-2';
    return 'md:col-span-1 lg:col-span-2 xl:col-span-2';
  };

  return (
    <Link
      href={`/work/${work.id}`}
      className={`bento-card group relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-malachite/50 transition-all duration-300 min-h-[200px] md:min-h-[250px] lg:min-h-[300px] flex flex-col ${getResponsiveSpan()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={cardRef} className='relative h-full flex flex-col'>
        {work.image && (
          <div className='relative flex-1 overflow-hidden'>
            <Image
              src={work.image}
              alt={work.title}
              fill
              className='object-cover group-hover:scale-110 transition-transform duration-500'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-coal/80 via-coal/40 to-transparent' />
          </div>
        )}

        <div
          className={`p-6 flex flex-col justify-between transition-all duration-300 ${
            work.image ? 'absolute inset-0 flex flex-col justify-end' : 'flex-1'
          }`}
        >
          <div className='space-y-4'>
            <div>
              {work.category && (
                <Badge variant='white' className='mb-2 text-xs'>
                  {work.category}
                </Badge>
              )}
              <h3 className='text-xl md:text-2xl font-display font-bold text-white mb-2'>
                {work.title}
              </h3>
              <p
                className={`text-white/70 text-sm leading-relaxed font-sans transition-all duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-70'
                }`}
              >
                {work.description}
              </p>
            </div>

            <div className='flex flex-wrap gap-2'>
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

          <div
            className={`flex gap-3 mt-4 pt-4 border-t border-white/10 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {work.liveUrl && (
              <a
                href={work.liveUrl}
                target='_blank'
                rel='noopener noreferrer'
                onClick={(e) => e.stopPropagation()}
                className='flex items-center gap-2 text-white/70 hover:text-malachite transition-colors text-sm'
              >
                <ExternalLink className='w-4 h-4' />
                Live
              </a>
            )}
            {work.githubLink && (
              <a
                href={work.githubLink}
                target='_blank'
                rel='noopener noreferrer'
                onClick={(e) => e.stopPropagation()}
                className='flex items-center gap-2 text-white/70 hover:text-malachite transition-colors text-sm'
              >
                <Github className='w-4 h-4' />
                Code
              </a>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

