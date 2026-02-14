import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import type { Work } from '@prisma/client';

type ProjectCardProps = {
  work: Pick<Work, 'id' | 'title' | 'description' | 'image' | 'tools' | 'category'>;
};

export const ProjectCard = ({ work }: ProjectCardProps) => {
  return (
    <article
      className='relative w-full max-w-6xl mx-auto h-[75vh] md:h-[70vh]'
    >
      <Link
        href={`/work/${work.id}`}
        className='group relative block h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_20px_80px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_30px_100px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.1)]'
      >
        <div className='absolute inset-0'>
          {work.image ? (
            <Image
            src={work.image}
            alt={work.title}
            fill
              className='object-cover transition-transform duration-700 group-hover:scale-105'
              sizes='(max-width: 1024px) 100vw, 80vw'
            />
          ) : (
            <div className='h-full w-full bg-gradient-to-br from-malachite/30 via-amber/20 to-bittersweet/30' />
          )}
        </div>

        <div className='absolute inset-0 bg-gradient-to-t from-coal via-coal/70 to-coal/25' />

        <div className='relative flex h-full flex-col justify-end p-6 md:p-10 lg:p-12'>
          {work.category && (
            <Badge variant='white' className='mb-5 w-fit text-xs md:text-sm'>
              {work.category}
            </Badge>
          )}

          <h3 className='max-w-4xl text-3xl font-display font-bold text-white md:text-5xl lg:text-6xl'>
            {work.title}
          </h3>

          <p className='mt-4 max-w-3xl text-sm font-sans leading-relaxed text-white/80 md:text-base lg:text-lg line-clamp-3'>
            {work.description}
          </p>

          <div className='mt-6 flex items-center justify-between gap-4'>
            <div className='flex flex-wrap gap-2'>
              {work.tools.slice(0, 4).map((tool) => (
                <Badge key={tool} variant='white' className='text-[10px] md:text-xs'>
                  {tool}
                </Badge>
              ))}
              {work.tools.length > 4 && (
                <Badge variant='default' className='text-[10px] md:text-xs'>
                  +{work.tools.length - 4}
                </Badge>
              )}
            </div>

            <span className='inline-flex items-center gap-2 text-sm font-sans font-medium text-malachite md:text-base'>
              Open Project
              <ArrowUpRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};
