import Link from 'next/link';
import CloudinaryImage from '@/components/ui/cloudinary-image';
import { Badge } from '@/components/ui/badge';
import { Work, Category } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import CircleButton from '@/components/ui/circle-button';
import { cn } from '@/lib/utils';

type WorkWithCategory = Work & { category: Category | null };

type WorkCardProps = {
  work: WorkWithCategory;
  featured?: boolean;
};

export function WorkCard({ work, featured = false }: WorkCardProps) {
  const toolLimit = featured ? 5 : 3;

  return (
    <Link
      href={`/work/${work.slug}`}
      className={cn(
        'group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-coal transition-[border-color,box-shadow] duration-300 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]',
        featured ? 'aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/9]' : 'aspect-[4/3]'
      )}
    >
      {work.image ? (
        <CloudinaryImage
          src={work.image}
          alt={work.title}
          fill
          className='object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      ) : (
        <div className='absolute inset-0 bg-gradient-to-br from-malachite/25 via-coal to-amber/20' />
      )}

      <div className='pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-coal/80 to-transparent' />
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-coal via-coal/75 to-transparent' />

      {work.category ? (
        <Badge
          variant='white'
          className='absolute left-5 top-5 z-10 text-[10px] uppercase tracking-wide md:left-6 md:top-6'
        >
          {work.category.name}
        </Badge>
      ) : null}

      <CircleButton
        href={`/work/${work.slug}`}
        className='absolute right-5 top-5 z-10 md:right-6 md:top-6'
      >
        <ArrowRight className='size-4 stroke-white text-transparent' />
      </CircleButton>

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 p-5 md:p-6',
          featured && 'gap-3 p-5 md:gap-4 md:p-8'
        )}
      >
        <h3
          className={cn(
            'font-display font-bold text-white transition-colors duration-300 group-hover:text-malachite',
            featured ? 'text-2xl md:text-4xl' : 'text-lg md:text-2xl'
          )}
        >
          {work.title}
        </h3>
        <p
          className={cn(
            'font-sans leading-relaxed text-white/80',
            featured
              ? 'max-w-2xl text-sm line-clamp-2 md:line-clamp-3 md:text-lg'
              : 'text-sm line-clamp-2 md:text-base'
          )}
        >
          {work.description}
        </p>

        {work.tools.length > 0 ? (
          <div className='flex flex-wrap gap-2'>
            {work.tools.slice(0, toolLimit).map((tool) => (
              <Badge key={tool} variant='white' className='text-[10px] md:text-xs'>
                {tool}
              </Badge>
            ))}
            {work.tools.length > toolLimit ? (
              <Badge variant='default' className='text-[10px] md:text-xs'>
                +{work.tools.length - toolLimit}
              </Badge>
            ) : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
