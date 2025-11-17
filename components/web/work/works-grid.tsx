'use client';

import { useRef } from 'react';
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

export const WorksGrid = ({ works }: { works: Work[] }) => {
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
          className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-16'
        >
          All Projects
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      </div>
    </section>
  );
};

const WorkCard = ({ work }: { work: Work }) => {
  return (
    <Link
      href={`/work/${work.id}`}
      className='group relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-malachite/50 transition-all duration-300 h-[400px] flex flex-col'
    >
      <div className='relative h-[240px] overflow-hidden'>
        {work.image ? (
          <Image
            src={work.image}
            alt={work.title}
            fill
            className='object-cover group-hover:scale-110 transition-transform duration-500'
          />
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-malachite/30 via-amber/20 to-bittersweet/30' />
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-coal/60 via-transparent to-transparent' />
      </div>

      <div className='flex-1 p-6 flex flex-col justify-between'>
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
            <p className='text-white/70 text-sm leading-relaxed font-sans line-clamp-2'>
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

        <div className='flex gap-3 mt-4 pt-4 border-t border-white/10'>
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
    </Link>
  );
};

