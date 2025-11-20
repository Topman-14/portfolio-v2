import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Work } from '@prisma/client';

const BentoCard = ({
    work,
    colSpan,
    rowSpan,
  }: {
    work: Work;
    colSpan: number;
    rowSpan: number;
  }) => {
    return (
      <Link
        href={`/work/${work.id}`}
        className='group relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-malachite/50 transition-all duration-300 flex flex-col h-full min-h-[200px] md:min-h-[250px] lg:min-h-[280px] xl:min-h-[300px] hover:scale-[1.02]'
        style={{
          gridColumn: `span ${colSpan}`,
          gridRow: `span ${rowSpan}`,
        }}
      >
        <div className='relative h-full flex flex-col overflow-hidden'>
          {work.image && (
            <div className='relative flex-1 overflow-hidden'>
              <Image
                src={work.image}
                alt={work.title}
                fill
                className='object-cover group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-coal/80 via-coal/40 to-transparent' />
            </div>
          )}
  
          <div
            className={`p-6 flex flex-col transition-all duration-300 ${
              work.image ? 'absolute inset-0 flex flex-col justify-end' : 'flex-1 h-full justify-end'
            }`}
          >
            <div className='space-y-4'>
              <div>
                {work.category && (
                  <Badge variant='white' className='mb-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]'>
                    {work.category}
                  </Badge>
                )}
                <h3 className='text-xl md:text-2xl font-display font-bold text-white mb-2'>
                  {work.title}
                </h3>
                <p className='text-white/70 text-sm leading-relaxed font-sans opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-[500px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden'>
                  {work.description}
                </p>
              </div>
  
              <div className='flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] delay-75'>
                {work.tools.slice(0, 3).map((tool) => (
                  <Badge key={tool} variant='white' className='text-[10px] px-2 py-0.5'>
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
        </div>
      </Link>
    );
  };
  
  export default BentoCard;