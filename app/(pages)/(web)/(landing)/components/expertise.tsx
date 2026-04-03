'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { Badge } from '@/components/ui/badge';
import { getFontsReady } from '@/lib/fonts-ready';

const specializations = [
  {
    title: 'Frontend Development',
    description:
      'Mostly React, Next and Angular, TypeScript everywhere. Dashboards, full marketing sites, design systems people pretend they do not need until the third inconsistent button, and Three.js when the brief calls for it. I design too.',
    tools: ['React', 'Next.js', 'Angular', 'TypeScript', 'Zustand', 'Tailwind', 'Vite', 'Figma'],
    color: 'malachite' as const,
  },
  {
    title: 'Backend Engineering',
    description:
      'Service layers and APIs I can still explain six months later: auth across products, integrations with third-party providers, and data models that do not fall apart when the domain shifts.',
    tools: ['Nest.js', 'Express', 'Prisma', 'TypeORM', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker'],
    color: 'amber' as const,
  },
  {
    title: 'Mobile Engineering',
    description:
      'React Native with Expo for production apps; EAS for builds, store submissions, and env management so releases stay predictable instead of improvised.',
    tools: ['React Native', 'Expo', 'EAS'],
    color: 'bittersweet' as const,
  },
  {
    title: 'Cloud & DevOps',
    description:
      `Docker, Elasticsearch, GitHub Actions, Cloudflare, AWS, GCP, Azure—whatever the environment already uses. Working toward an AWS Solutions Architect Associate certification, and comfortable with CloudFormation and Terraform.`,
    tools: ['AWS', 'Caddy', 'Docker', 'GitHub Actions', 'Cloudflare', 'GCP', 'Terraform'],
    color: 'malachite' as const,
  },
  {
    title: 'AI Integrations',
    description:
      'RAG over internal docs, embeddings living in PGVector, LangChain, FastAPI when Python is the shortest path.',
    tools: ['OpenAI API', 'LangChain', 'PGVector', 'FastAPI'],
    color: 'amber' as const,
  },
];

export const Expertise = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const splits: SplitType[] = [];
      const scrollTriggers: ScrollTrigger[] = [];

      getFontsReady().then(() => { 

        if (sectionRef.current) {
          const specs = sectionRef.current.querySelectorAll('.specialization-item');
          for (const spec of specs) {
            const st = gsap.fromTo(
              spec,
              { opacity: 0, y: 30, willChange: 'opacity, transform' },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                clearProps: 'willChange',
                scrollTrigger: {
                  trigger: spec,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                },
              }
            ).scrollTrigger;
            if (st) scrollTriggers.push(st);
          }
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
    <section
      ref={sectionRef}
      className='relative min-h-screen py-32 px-4 md:px-8 lg:px-16'
    >
      <div className='max-w-7xl mx-auto'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-20'>
          <div className='lg:sticky lg:top-[300px] lg:self-start space-y-6'>
            <h2
              className='generic-h2'
            >
              Expertise
            </h2>

            <div className='space-y-4'>
              <p className='text-white/70 text-base md:text-lg leading-relaxed font-sans'>
                Contract work has taken me through Binta Financial, Compass AI, and
                Husridge. Most of the time full-stack product and platform
                engineering, zero-to-one MVPs with small teams—mostly remote, with an uncharacteristic bias for speed.
              </p>
            </div>
          </div>

          <div className='space-y-8'>
            <h3
              className='text-2xl md:text-3xl font-display font-bold text-malachite mb-8'
            >
              Specializations
            </h3>

            <div className='flex flex-col gap-10 lg:gap-16'>
              {specializations.map((spec) => (
                <div key={spec.title} className='specialization-item space-y-3'>
                  <h4 className='text-xl md:text-2xl font-display font-bold text-white'>
                    {spec.title}
                  </h4>
                  <p className='text-white/70 text-sm md:text-base leading-relaxed font-sans'>
                    {spec.description}
                  </p>
                  <div className='flex flex-wrap gap-2 pt-2'>
                    {spec.tools.map((tool) => (
                      <Badge key={tool} variant={spec.color}>
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};