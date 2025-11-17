'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { Badge } from '@/components/ui/badge';

gsap.registerPlugin(ScrollTrigger);

const specializations = [
  {
    title: 'Frontend Development',
    description:
      'Built dynamic dashboards, fully featured business sites (careers, blogs and all) and design systems with React, Angular Next.js, and TypeScript. Developed custom voice-enabled UI components for AI and created adaptive layouts for business and logistics tools.',
    tools: ['React', 'Next.js', 'TypeScript', 'Zustand', 'Tailwind', 'Vite', 'Figma'],
    color: 'malachite' as const,
  },
  {
    title: 'Backend Engineering',
    description:
      'Architected microservices and RESTful APIs with Typescript, optimized for scalability and performance. Implemented unified cross-domain authentication across multiple products and microservices and integrated multiple third-party services securely.',
    tools: ['Nest.js', 'Express', 'Prisma', 'TypeORM', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker'],
    color: 'amber' as const,
  },
  {
    title: 'Mobile Engineering',
    description:
      'Worked on the Binta mobile app, ensuring seamless integration and real-time transaction updates. Focused on offline-first experiences and fast UI rendering.',
    tools: ['React Native', 'Expo', 'Zustand', 'Firebase'],
    color: 'bittersweet' as const,
  },
  {
    title: 'Cloud & DevOps',
    description:
      'Automated deployments, implemented CI/CD pipelines, and managed containerized apps. Deployed multi-service environments with SSL, load balancing, and monitoring.',
    tools: ['AWS', 'Caddy', 'Docker', 'GitHub Actions', 'Cloudflare', 'GCP'],
    color: 'malachite' as const,
  },
  {
    title: 'AI Integrations',
    description:
      'Built RAG chatbots using OpenAI and custom vector stores for internal knowledge retrieval. Integrated voice and text AI tools into real products to enhance usability and interactivity.',
    tools: ['OpenAI API', 'LangChain', 'PGVector', 'FastAPI'],
    color: 'amber' as const,
  },
];

export const Expertise = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const overviewHeadingRef = useRef<HTMLHeadingElement>(null);
  const overviewTextRef = useRef<HTMLDivElement>(null);
  const specializationsHeadingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      document.fonts.ready.then(() => {
        const overviewHeading = overviewHeadingRef.current;
        const overviewText = overviewTextRef.current;
        const specializationsHeading = specializationsHeadingRef.current;

        if (overviewHeading) {
          const split = new SplitType(overviewHeading, { types: 'words' });
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
                trigger: overviewHeading,
                start: 'top 80%',
              },
            }
          );
        }

        if (overviewText) {
          const paragraphs = overviewText.querySelectorAll('p');
          for (const p of paragraphs) {
            const split = new SplitType(p, { types: 'lines' });
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
                  trigger: p,
                  start: 'top 85%',
                },
              }
            );
          }
        }

        if (specializationsHeading) {
          const split = new SplitType(specializationsHeading, { types: 'words' });
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
                trigger: specializationsHeading,
                start: 'top 80%',
              },
            }
          );
        }

        if (sectionRef.current) {
          const specs = sectionRef.current.querySelectorAll('.specialization-item');
          for (const spec of specs) {
            gsap.fromTo(
              spec,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: spec,
                  start: 'top 85%',
                },
              }
            );
          }
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className='relative min-h-screen bg-white py-32 px-4 md:px-8 lg:px-16 bg1-light'
    >
      <div className='max-w-7xl mx-auto'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-20'>
          <div className='lg:sticky lg:top-32 lg:self-start space-y-6'>
            <h2
              ref={overviewHeadingRef}
              className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-coal leading-tight'
            >
              Expertise
            </h2>

            <div ref={overviewTextRef} className='space-y-4'>
              <p className='text-coal/70 text-base md:text-lg leading-relaxed font-sans'>
                I work across the stack, but my obsession lies in clean
                interfaces that feel effortless. I take projects from concept to
                deployment, handling architecture, UX, and long-term
                maintainability with equal attention. What sets me apart is
                consistency I ship, I document, I debug, and I refine until
                it&apos;s solid.
              </p>

              <p className='text-coal/70 text-base md:text-lg leading-relaxed font-sans'>
                I believe engineering isn&apos;t just about code; it&apos;s about
                control. Control over performance, cost, and experience. Whether
                I&apos;m integrating AI models, setting up efficient infra, or
                laying out code architecture won&apos;t become a headache over
                time, the goal stays the same; to keep it elegant, fast, and
                dependable.
              </p>
            </div>
          </div>

          <div className='space-y-8'>
            <h3
              ref={specializationsHeadingRef}
              className='text-2xl md:text-3xl font-display font-bold text-malachite mb-8'
            >
              Specializations
            </h3>

            <div className='space-y-10'>
              {specializations.map((spec) => (
                <div key={spec.title} className='specialization-item space-y-3'>
                  <h4 className='text-xl md:text-2xl font-display font-bold text-coal'>
                    {spec.title}
                  </h4>
                  <p className='text-coal/70 text-sm md:text-base leading-relaxed font-sans'>
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