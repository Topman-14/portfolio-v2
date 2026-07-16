import { Suspense } from 'react';
import { Expertise } from './components/expertise';
import { FeaturedProjectsSection } from './components/featured-projects-section';
import { RecentBlogsSection } from './components/recent-blogs-section';
import { type StaticImageData } from 'next/image';
import { RevealHeader } from '@/components/custom/reveal-header';
import { LoadingFallback } from '@/components/ui/suspense';
import HeroScene from './components/hero-scene';
import { AboutGallery } from './components/about-gallery';
import aboutEmma from '@/public/me/emma.jpg';
import aboutMe1 from '@/public/me/me1.webp';
import aboutMe11 from '@/public/me/me11.png';
import aboutMe2 from '@/public/me/me2.jpg';
import aboutMe5 from '@/public/me/me5.jpg';
import aboutMe4 from '@/public/me/me4.jpg';
import aboutSodiq from '@/public/me/sodiq.webp';
import aboutMe6 from '@/public/me/me6.jpg';

export default function Home() {
  return (
    <main className='bg1 px-2'>
      <section className='relative pb-5 md:pb-0'>
        <div className='relative z-10 flex lg:items-center justify-center min-h-screen px-4 md:px-8 lg:px-16 flex-col md:flex-row gap-16 md:gap-0'>
          <div className='lg:max-w-6xl w-full sm:pt-20 md:pt-32 sm:pb-20 md:pb-48 xl:max-w-7xl z-[20] py-10'>
            <p
              className='text-xl md:text-4xl text-white/80 mb-4 font-sans font-semibold'
            >
              Tope Akinkuade
            </p>

            <h1
              className='text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-malachite leading-[1.1] mb-8 text-left max-w-4xl xl:max-w-none'
            >
              Product Engineer, <br />
              <span className='text-white'>Technical Writer.</span>
            </h1>

            <p
              className='text-white font-semibold max-w-xl font-sans text-lg md:text-xl'
            >
              I build systems and the documentation that makes them maintainable.
            </p>
          </div>
          <HeroScene />
        </div>
      </section>

      <Suspense fallback={<LoadingFallback className='min-h-[320px] md:py-28' />}>
        <FeaturedProjectsSection />
      </Suspense>

      <Suspense fallback={<LoadingFallback className='min-h-[280px] md:py-28' />}>
        <RecentBlogsSection />
      </Suspense>

      <Expertise />

      <section className='relative  min-h-screen md:py-32 px-4 md:px-8 lg:px-16'>
        <div className='max-w-7xl mx-auto h-full flex gap-7 flex-col'>
          <div className='space-y-8 flex-1 md:flex-none max-w-4xl'>
            <RevealHeader title="About" />

            <p className='font-sans text-base'>
              I&apos;m based in Lagos. Lately my work has skewed toward fintech and
              edutech: shipping products end to end, keeping internal systems
              maintainable, and writing technical docs.
              <br />
              <br />
              I work remotely, so most weeks I&apos;m at home in front of a screen.
              That&apos;s why I gravitate toward meetups, conferences, and casual
              community events when I can; they&apos;re a reset and a reminder that
              software is still made by people in rooms.
              <br />
              <br />
              Away from the keyboard I read, poke at side projects, listen to Coldplay and hunt for more reasons to leave the house.
            </p>

            {/* <GButton href='/about' className='mt-5 mb-3 group'>
              <span>Read More</span>
              <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
            </GButton> */}
          </div>

          <AboutGallery images={imageData} />
        </div>
      </section>


    </main>
  );
}


const imageData: {
  src: StaticImageData;
  alt: string;
  colSpan: string;
}[] = [
    { src: aboutEmma, alt: 'Tope Akinkuade', colSpan: 'col-span-2 max-md:order-1' },
    { src: aboutMe1, alt: 'Tope Akinkuade', colSpan: 'col-span-1 max-md:order-2' },
    { src: aboutMe11, alt: 'Tope Akinkuade', colSpan: 'col-span-2 max-md:order-4' },
    { src: aboutMe2, alt: 'Tope Akinkuade', colSpan: 'col-span-1 max-md:order-3' },
    { src: aboutMe5, alt: 'Tope Akinkuade', colSpan: 'col-span-1 hidden md:block' },
    { src: aboutMe4, alt: 'Tope Akinkuade', colSpan: 'col-span-2 hidden md:block' },
    { src: aboutSodiq, alt: 'Tope Akinkuade', colSpan: 'col-span-1 hidden md:block' },
    { src: aboutMe6, alt: 'Tope Akinkuade', colSpan: 'col-span-2 hidden md:block' },
  ];
