import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Article, Category } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { formatPublishedDate } from '@/lib/utils';

export type BlogListArticle = Article & {
  category: Category | null;
};

type BlogCardProps = {
  article: BlogListArticle;
  priority?: boolean;
};

export const BlogCard = ({ article, priority = false }: BlogCardProps) => {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className='group block'
    >
      <div className='relative aspect-[16/10] overflow-hidden rounded-2xl bg-white/5'>
        {article.coverImg ? (
          <Image
            src={article.coverImg}
            alt={article.title}
            fill
            priority={priority}
            className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
          />
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-malachite/30 via-amber/20 to-bittersweet/30' />
        )}
      </div>

      <div className='pt-4 space-y-3'>
        <div className='flex items-center gap-2 text-xs font-sans text-white/60 flex-wrap'>
          {article.category ? (
            <Badge variant='malachite' className='uppercase tracking-wide px-2.5 py-0.5'>
              {article.category.name}
            </Badge>
          ) : (
            <span className='text-white/50'>General</span>
          )}
          <span>
            {formatPublishedDate(article.publishedAt)}{article.readTime ? ` · ${article.readTime} min read` : ''}
          </span>
        </div>

        <h3 className='text-xl font-display font-bold text-white leading-snug  transition-colors line-clamp-2'>
          {article.title}
        </h3>

        {article.excerpt ? (
          <p className='text-white/70 text-sm md:text-base leading-relaxed font-sans line-clamp-2'>
            {article.excerpt}
          </p>
        ) : null}

        
      </div>
    </Link>
  );
};
