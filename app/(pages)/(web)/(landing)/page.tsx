import { Expertise } from './components/expertise';
import { Projects } from './components/projects';
import SplinePlayer from '@/components/custom/spline';
import { ArrowRight } from 'lucide-react';
import { GButton } from '@/components/ui/gbutton';
import Image from 'next/image';
import Parallax from '@/components/animations/parallax';
import { RevealText } from '@/components/custom/reveal-text';
import { Suspense } from '@/components/ui/suspense';
import { RevealHeader } from '@/components/custom/reveal-header';

export default async function Home() {
  return (
    <main className='bg1'>
      {/* Hero Section */}
      <section className='relative pb-5 md:pb-0'>
        <div className='relative z-10 flex lg:items-center justify-center min-h-screen px-4 md:px-8 lg:px-16 flex-col md:flex-row gap-16 md:gap-0'>
          <div className='lg:max-w-6xl w-full sm:pt-20 md:pt-32 sm:pb-20 md:pb-48 xl:max-w-7xl z-[20] py-10'>
            <p
              className='text-xl md:text-4xl text-white/80 mb-4 font-sans font-semibold'
            >
              Tope Akinkuade
            </p>

            <h1
              className='text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white leading-[1.1] mb-8 text-left max-w-4xl xl:max-w-none'
            >
              Product Engineer, <br />
              <span className='text-malachite'>Technical Writer.</span>
            </h1>

            <p
              className='text-white font-semibold max-w-xl font-sans text-lg md:text-xl'
            >
              I work across the stack to create
              systems that balance precision and practicality.
              <br />
              <br />
              From architecture to deployment, <br className='md:hidden' /> I build infrastructure nobody
              notices until it&apos;s missing.
            </p>
          </div>
          <div className='md:absolute mx-auto xl:bottom-32 bottom-20 right-12 size-[300px] md:max-h-none lg:size-[400px] z-[20] pointer-events-none'>
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
      </section>

      {/* About Section */}
      <section className='relative  min-h-screen py-32 px-4 md:px-8 lg:px-16'>
        <div className='max-w-7xl mx-auto h-full flex gap-7 flex-col'>
          <div className='space-y-8 flex-1 md:flex-none max-w-3xl'>
            <RevealHeader title="About" />

            <RevealText
              as='p'
              className='text-white text-lg lg:text-xl leading-relaxed font-sans'
              start='top 90%'
              end='bottom 10%'
              stagger={0.008}
              ease='none'
              initialOpacity={0.3}
              finalOpacity={1}
              y={0}
              scrub={0.5}
            >
              Based in Lagos, I&apos;ve spent the last few
              years building products across logistics, fintech, and business
              infrastructure. I&apos;ve worked with teams of all sizes to create
              tools that power real operations from supply chain platforms used by
              truck drivers to modular business systems for enterprises. My focus
              is on clarity, performance, and systems that scale without
              unnecessary complexity.
              <br />
              <br />

              Alongside engineering, I&apos;m big on design thinking, not in the
              corporate sense, but in the way a product feels when it&apos;s used.
              My work sits at the intersection of function and pragmatism.
            </RevealText>

            <GButton href='/about' className='mt-5 mb-3 group'>
              <span>Read More</span>
              <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
            </GButton>
          </div>

          <div
            className='relative flex-1 md:flex-none grid grid-cols-3 ml-auto my-auto gap-4 lg:max-w-[600px] w-full'
          >
            {imageData.map((image, index) => (
              <div
                // bg underneath
                key={`${image.src}-${image.speed}-${index}`}
                className={`${image.colSpan} relative ${image.height} overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]`}
              >
          
                <Parallax speed={image.speed}>
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

      <Expertise />

      <Suspense>
        <Projects />
      </Suspense>
    </main>
  );
}


const imageData = [
  {
    src: '/img/jpg/test.jpg',
    alt: 'Tope Akinkuade',
    speed: -5,
    colSpan: 'col-span-2',
    height: 'h-[200px] lg:h-[200px]',
    priority: true,
  },
  {
    src: '/img/jpg/test.jpg',
    alt: 'Tope Akinkuade',
    speed: 4,
    colSpan: 'col-span-1',
    height: 'h-[200px] lg:h-[200px]',
    priority: true,
  },
  {
    alt: 'Tope Akinkuade',
    src: '/img/jpg/me.jpg',
    speed: 6,
    colSpan: 'col-span-1',
    height: 'h-[200px] lg:h-[200px]',
    priority: false,
  },
  {
    src: '/img/png/test_img.png',
    alt: 'Tope Akinkuade',
    speed: 3,
    colSpan: 'col-span-2',
    height: 'h-[200px] lg:h-[200px]',
    priority: false,
  },
]