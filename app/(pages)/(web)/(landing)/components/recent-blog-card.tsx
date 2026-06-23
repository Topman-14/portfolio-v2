import CloudinaryImage from '@/components/ui/cloudinary-image';
import Link from 'next/link';
import type { BlogListArticle } from '@/app/(pages)/(web)/blog/components/blog-card';
import { Badge } from '@/components/ui/badge';
import { cn, formatPublishedDate } from '@/lib/utils';

const NOTCH_VIEW_H = 75;

const NOTCH = `M0 ${NOTCH_VIEW_H} L0 46 C0 27 18 10 44 10 H186 C202 10 212 23 220 33 C228 42 242 47 268 47 H400 V${NOTCH_VIEW_H} Z`;

type RecentBlogCardProps = {
  article: BlogListArticle;
  priority?: boolean;
  className?: string;
};

export function RecentBlogCard({
  article,
  priority = false,
  className,
}: RecentBlogCardProps) {
  const tags = article.tags ?? [];
  const tabTag = tags[0] ?? article.category?.name ?? 'General';
  const showCategoryBadge = Boolean(tags[0] && article.category);
  const readPart = article.readTime ? `${article.readTime} min read` : null;
  const meta = [formatPublishedDate(article.publishedAt), readPart]
    .filter(Boolean)
    .join(' · ');

  return (
    <Link
      href={`/blog/${article.slug}`}
      className={cn(
        'group block rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-malachite/70',
        className
      )}
    >
      <article
        className={cn(
          'relative isolate overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 transition-[transform,box-shadow] duration-300',
          'shadow-[0_20px_80px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.05)]',
          ' group-hover:shadow-[0_28px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08)] '
        )}
      >
        <div className='relative z-0 aspect-[16/10] w-full'>
          {article.coverImg ? (
            <CloudinaryImage
              src={article.coverImg}
              alt={article.title}
              fill
              priority={priority}
              className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
              sizes='(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw'
            />
          ) : (
            <div className='absolute inset-0 bg-gradient-to-br from-malachite/35 via-amber/25 to-bittersweet/35' />
          )}
        </div>

        <div className='relative z-10 -mt-[4.5rem]'>
          <div className='relative'>
            <svg
              className='relative z-[1] block h-[5rem] w-full fill-zinc-900'
              viewBox={`0 0 400 ${NOTCH_VIEW_H}`}
              preserveAspectRatio='none'
              aria-hidden
            >
              <path d={NOTCH} />
            </svg>
          </div>
          <div className='relative z-[2] -mt-[46px] px-6 pb-6 pt-3'>
          {showCategoryBadge ? (
                <Badge
                  variant='malachite'
                  className='px-2.5 py-0.5 uppercase tracking-wide mb-4'
                >
                  {article.category!.name}
                </Badge>
              ) : null}
            <div className='flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-xs text-white/60'>
              {meta ? <span>{meta}</span> : null}
            </div>
            <h3 className='mt-3 font-display text-xl font-bold leading-snug text-white transition-colors group-hover:text-malachite/90 line-clamp-2'>
              {article.title}
            </h3>
          </div>
        </div>
      </article>
    </Link>
  );
}
