'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { GButton } from '@/components/ui/gbutton';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import SplinePlayer from '@/components/custom/spline';

gsap.registerPlugin(ScrollTrigger);

type Work = {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  videoUrl?: string | null;
  tools: string[];
  githubLink?: string | null;
  liveUrl?: string | null;
  category?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const WorkDetail = ({ work }: { work: Work }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      document.fonts.ready.then(() => {
        const heading = headingRef.current;
        const description = descriptionRef.current;

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

        if (description) {
          const split = new SplitType(description, { types: 'words' });
          gsap.fromTo(
            split.words,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.01,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: description,
                start: 'top 85%',
              },
            }
          );
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <main>
      <section ref={sectionRef} className='relative bg1 min-h-screen py-32 px-4 md:px-8 lg:px-16'>
        <div className='max-w-7xl mx-auto'>
          <Link
            href='/work'
            className='inline-flex items-center gap-2 text-white/70 hover:text-malachite transition-colors mb-8 font-sans'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Work
          </Link>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
            <div className='space-y-8'>
              {work.category && (
                <Badge variant='white' className='text-sm px-3 py-1'>
                  {work.category}
                </Badge>
              )}

              <h1
                ref={headingRef}
                className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight'
              >
                {work.title}
              </h1>

              <p
                ref={descriptionRef}
                className='text-white/80 text-lg md:text-xl leading-relaxed font-sans'
              >
                {work.description}
              </p>

              <div className='flex flex-wrap gap-3'>
                {work.tools.map((tool) => (
                  <Badge key={tool} variant='white' className='text-sm px-3 py-1'>
                    {tool}
                  </Badge>
                ))}
              </div>

              <div className='flex flex-wrap gap-4'>
                {work.liveUrl && (
                  <GButton
                    href={work.liveUrl}
                    variant='green'
                    className='group'
                  >
                    <span>View Live</span>
                    <ExternalLink className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                  </GButton>
                )}
                {work.githubLink && (
                  <GButton
                    href={work.githubLink}
                    variant='primary'
                    className='group'
                  >
                    <span>View Code</span>
                    <Github className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                  </GButton>
                )}
              </div>
            </div>

            <div className='relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10'>
              {work.image ? (
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className='object-cover'
                  priority
                />
              ) : (
                <div className='absolute inset-0 flex items-center justify-center'>
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
              )}
            </div>
          </div>
        </div>
      </section>

      {work.videoUrl && (
        <section className='relative bg2 py-32 px-4 md:px-8 lg:px-16'>
          <div className='max-w-7xl mx-auto'>
            <h2 className='text-3xl md:text-4xl font-display font-bold text-white mb-8'>
              Demo Video
            </h2>
            <div className='relative aspect-video rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10'>
              <iframe
                src={work.videoUrl}
                className='absolute inset-0 w-full h-full'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                title={work.title}
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

