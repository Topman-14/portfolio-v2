import prismadb from '@/lib/prismadb';
import Link from 'next/link';
import Image from 'next/image';
import { RevealHeader } from '@/components/custom/reveal-header';
import { GButton } from '@/components/ui/gbutton';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export async function Projects2() {
  const works = await prismadb.work.findMany({
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
    },
  });

  return (
    <section className='px-4 md:px-8 lg:px-16'>
      <div className='mx-auto max-w-7xl py-28'>
        <RevealHeader
          title='Projects'
          subtitle='Featured builds from the archive — tap through for case studies and detail.'
          className='mb-12 md:mb-16'
        />

        {works.length === 0 ? (
          <p className='font-sans text-white/50'>No featured projects yet.</p>
        ) : (
          <ul className='flex flex-col gap-6 md:gap-8'>
            {works.map((work, i) => (
              <li key={work.id}>
                <Link
                  href={`/work/${work.id}`}
                  className='group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 md:flex-row md:items-stretch hover:border-white/20 hover:shadow-[0_24px_80px_rgba(0,0,0,0.35)]'
                >
                  <div className='relative aspect-[16/10] w-full shrink-0 overflow-hidden md:aspect-auto md:h-auto md:w-[min(42%,320px)] lg:w-[min(40%,380px)]'>
                    {work.image ? (
                      <Image
                        src={work.image}
                        alt={work.title}
                        fill
                        className='object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]'
                        sizes='(max-width: 768px) 100vw, 380px'
                      />
                    ) : (
                      <div className='absolute inset-0 bg-gradient-to-br from-malachite/25 via-coal to-amber/20' />
                    )}
                    <div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-coal/40 md:via-coal/20' />
                  </div>

                  <div className='flex min-w-0 flex-1 flex-col justify-center gap-3 p-5 md:gap-4 md:p-7 lg:p-8'>
                    <div className='flex flex-wrap items-center justify-between gap-2'>
                      <div className='flex flex-wrap items-center gap-2'>
                        {work.category ? (
                          <Badge
                            variant='white'
                            className='text-[10px] uppercase tracking-wide'
                          >
                            {work.category}
                          </Badge>
                        ) : null}
                      </div>
                      <span className='font-sans text-xs tabular-nums text-white/35'>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div>
                      <h3 className='font-display text-xl font-bold text-white transition-colors duration-300 group-hover:text-malachite md:text-2xl lg:text-3xl'>
                        {work.title}
                      </h3>
                      <p className='mt-2 line-clamp-2 font-sans text-sm leading-relaxed text-white/65 md:text-base'>
                        {work.description}
                      </p>
                    </div>

                    <div className='flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-4'>
                      <p className='max-w-xl font-sans text-xs text-white/45 md:text-sm'>
                        {work.tools.slice(0, 4).join(' · ')}
                        {work.tools.length > 4
                          ? ` · +${work.tools.length - 4}`
                          : ''}
                      </p>
                      <span className='inline-flex shrink-0 items-center gap-1.5 font-sans text-sm font-medium text-malachite'>
                        Open
                        <ArrowUpRight className='size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <GButton href='/work' className='w-full' containerClassName='block group mt-12 md:mt-16 w-full md:w-fit mx-auto'>
          <span>View more</span>
          <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
        </GButton>
      </div>
    </section>
  );
}
