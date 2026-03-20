import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Work } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import CircleButton from '@/components/ui/circle-button';

export function WorkCard({ work }: { work: Work }) {
  return (
    <Link
      href={`/work/${work.id}`}
      className='group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]'
    >
      <div className='relative min-h-[200px] w-full shrink-0 overflow-hidden'>
        {work.image ? (
          <Image
            src={work.image}
            alt={work.title}
            fill
            className='object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-malachite/25 via-coal to-amber/20' />
        )}
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-coal/70 via-coal/20 to-transparent' />
        <CircleButton
          href={`/work/${work.id}`}
          className='absolute bottom-4 right-4 z-10'
        >
          <ArrowRight className='size-4 stroke-white text-transparent' />
        </CircleButton>
      </div>

      <div className='flex flex-1 flex-col gap-4 p-5 md:p-6'>
        <div className='min-w-0 flex-1 space-y-2'>
          {work.category ? (
            <Badge variant='white' className='text-[10px] uppercase tracking-wide'>
              {work.category}
            </Badge>
          ) : null}
          <h3 className='font-display text-xl font-bold text-white transition-colors duration-300 group-hover:text-malachite md:text-2xl'>
            {work.title}
          </h3>
          <p className='line-clamp-2 font-sans text-sm leading-relaxed text-white/65 md:text-base'>
            {work.description}
          </p>
        </div>

        <div className='flex flex-wrap gap-2 border-t border-white/10 pt-4'>
          {work.tools.slice(0, 3).map((tool) => (
            <Badge key={tool} variant='white' className='text-[10px] md:text-xs'>
              {tool}
            </Badge>
          ))}
          {work.tools.length > 4 ? (
            <Badge variant='default' className='text-[10px] md:text-xs'>
              +{work.tools.length - 3}
            </Badge>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
