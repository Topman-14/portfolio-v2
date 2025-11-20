import { Badge } from '@/components/ui/badge';
import { Work } from '@prisma/client';
import { Link } from 'lucide-react';
import Image from 'next/image';

const WorkCard = ({ work }: { work: Work }) => {
  return (
    <Link
      href={`/work/${work.id}`}
      className='work-card group relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-malachite/50 transition-all duration-300 h-[400px] flex flex-col'
    >
      <div className='relative h-[240px] overflow-hidden'>
        {work.image ? (
          <Image
            src={work.image}
            alt={work.title}
            fill
            className='object-cover group-hover:scale-110 transition-transform duration-500'
          />
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-malachite/30 via-amber/20 to-bittersweet/30' />
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-coal/60 via-transparent to-transparent' />
      </div>

      <div className='flex-1 p-6 flex flex-col justify-between'>
        <div className='space-y-4'>
          <div>
            {work.category && (
              <Badge variant='white' className='mb-2 text-xs'>
                {work.category}
              </Badge>
            )}
            <h3 className='text-xl md:text-2xl font-display font-bold text-white mb-2'>
              {work.title}
            </h3>
            <p className='text-white/70 text-sm leading-relaxed font-sans line-clamp-2'>
              {work.description}
            </p>
          </div>

          <div className='flex flex-wrap gap-2'>
            {work.tools.slice(0, 3).map((tool) => (
              <Badge
                key={tool}
                variant='white'
                className='text-[10px] px-2 py-0.5'
              >
                {tool}
              </Badge>
            ))}
            {work.tools.length > 3 && (
              <Badge variant='default' className='text-[10px] px-2 py-0.5'>
                +{work.tools.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorkCard;
