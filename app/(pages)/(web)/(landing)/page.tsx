import { Expertise } from './components/expertise';
import { Projects2 } from './components/projects-2';
import SplinePlayer from '@/components/custom/spline';
import { ArrowRight } from 'lucide-react';
import { GButton } from '@/components/ui/gbutton';
import Image, { type StaticImageData } from 'next/image';
import { RevealHeader } from '@/components/custom/reveal-header';
import prismadb from '@/lib/prismadb';
import { Work } from '@prisma/client';
import aboutEmma from '@/public/me/emma.jpg';
import aboutMe1 from '@/public/me/me1.webp';
import aboutMe3 from '@/public/me/placeholder.png';
import aboutMe2 from '@/public/me/me2.jpg';
import aboutMe5 from '@/public/me/me5.jpg';
import aboutMe4 from '@/public/me/me4.jpg';
import aboutSodiq from '@/public/me/sodiq.webp';
import aboutMe6 from '@/public/me/me6.jpg';
export default async function Home() {
  const featuredWorks = await prismadb.work.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      tools: true,
      category: true,
      slug: true,
    },
  }) as Work[];

  return (
    <main className='bg1'>
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
              I build production systems and the documentation that makes them usable.
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

      <section className='relative  min-h-screen py-32 px-4 md:px-8 lg:px-16'>
        <div className='max-w-7xl mx-auto h-full flex gap-7 flex-col'>
          <div className='space-y-8 flex-1 md:flex-none max-w-4xl'>
            <RevealHeader title="About" />

            <p>
              I&apos;m based in Lagos. Lately my work has skewed toward fintech and
              edutech: shipping products end to end, keeping internal systems
              maintainable, and writing technical docs when the codebase needs a
              clear story.
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

          <div
            className='relative flex-1 md:flex-none grid mt-12 grid-cols-3 md:grid-cols-6 grid-rows-2 ml-auto my-auto gap-4 w-full'
          >
            {imageData.map((image, index) => (
              <div
                key={`about-gallery-${index}`}
                className={`${image.colSpan} lg:max-w-[600px] relative h-[200px] overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  placeholder='blur'
                  className='object-cover'
                  priority={true}
                  sizes='(max-width: 768px) 50vw, 33vw'
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Expertise />

      <Projects2 works={featuredWorks} />
    </main>
  );
}


const imageData: {
  src: StaticImageData;
  alt: string;
  colSpan: string;
}[] = [
    { src: aboutEmma, alt: 'Tope Akinkuade', colSpan: 'col-span-2' },
    { src: aboutMe1, alt: 'Tope Akinkuade', colSpan: 'col-span-1' },
    { src: aboutMe3, alt: 'Tope Akinkuade', colSpan: 'col-span-2' },
    { src: aboutMe2, alt: 'Tope Akinkuade', colSpan: 'col-span-1' },
    { src: aboutMe5, alt: 'Tope Akinkuade', colSpan: 'col-span-1 hidden md:block' },
    { src: aboutMe4, alt: 'Tope Akinkuade', colSpan: 'col-span-2 hidden md:block' },
    { src: aboutSodiq, alt: 'Tope Akinkuade', colSpan: 'col-span-1 hidden md:block' },
    { src: aboutMe6, alt: 'Tope Akinkuade', colSpan: 'col-span-2 hidden md:block' },
  ];
