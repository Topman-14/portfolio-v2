import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Work } from '@prisma/client';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const WorkCard = ({ work }: { work: Work }) => {
  return (
    <Link
      href={`/work/${work.id}`}
      className='work-card group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-white/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)]'
    >
      <div className='relative aspect-[16/10] w-full shrink-0 overflow-hidden'>
        {work.image ? (
          <Image
            src={work.image}
            alt={work.title}
            fill
            className='object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-malachite/25 via-coal to-amber/20' />
        )}
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-coal/65 via-coal/15 to-transparent' />
      </div>

      <div className='flex flex-1 flex-col gap-3 p-5'>
        <div className='min-w-0 flex-1 space-y-2'>
          {work.category ? (
            <Badge variant='white' className='text-[10px] uppercase tracking-wide'>
              {work.category}
            </Badge>
          ) : null}
          <h3 className='font-display text-lg font-bold text-white transition-colors duration-300 group-hover:text-malachite md:text-xl'>
            {work.title}
          </h3>
          <p className='line-clamp-2 font-sans text-sm leading-relaxed text-white/65'>
            {work.description}
          </p>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3'>
          <div className='flex flex-wrap gap-1.5'>
            {work.tools.slice(0, 3).map((tool) => (
              <Badge key={tool} variant='white' className='text-[10px]'>
                {tool}
              </Badge>
            ))}
            {work.tools.length > 3 ? (
              <Badge variant='default' className='text-[10px]'>
                +{work.tools.length - 3}
              </Badge>
            ) : null}
          </div>
          <ArrowUpRight className='size-4 shrink-0 text-malachite transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
        </div>
      </div>
    </Link>
  );
};

export default WorkCard;
