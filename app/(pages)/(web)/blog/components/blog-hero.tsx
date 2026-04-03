'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Article, Category } from '@prisma/client';
import { cn, formatPublishedDate } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import CircleButton from '@/components/ui/circle-button';

type ArticleWithCategory = Article & {
  category: Category | null;
};

type BlogHeroProps = {
  articles: ArticleWithCategory[];
  title: string;
  reverse?: boolean;
  className?: string;
};

export const BlogHero = ({ articles, title, reverse = false, className }: BlogHeroProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = articles[activeIndex];

  if (articles.length === 0) return null;

  return (
    <section
      className={cn(
        'grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start',
        reverse && 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1',
        className
      )}
    >
      <Link href={`/blog/${active.slug}`} className='group block'>
        <div className='relative aspect-[16/10] rounded-2xl overflow-hidden bg-white/5'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={active.id}
              initial={{ opacity: 0.2, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.2, scale: 0.99 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className='absolute inset-0'
            >
              {active.coverImg ? (
                <Image
                  src={active.coverImg}
                  alt={active.title}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
              ) : (
                <div className='absolute inset-0 bg-gradient-to-br from-malachite/30 via-amber/20 to-bittersweet/30' />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className='mt-5'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className='space-y-3'
            >
              <h3 className='text-2xl font-display font-bold text-white leading-tight line-clamp-2 max-w-xl'>
                {active.title}
              </h3>
              {active.excerpt ? (
                <p className='text-white/70 text-base md:text-lg leading-relaxed font-sans line-clamp-4'>
                  {active.excerpt}
                </p>
              ) : null}
              <div className='inline-flex items-center gap-2 text-sm font-sans text-white/70 group-hover:text-white transition-colors'>
                <span>
                  {formatPublishedDate(active.publishedAt)}
                  {active.readTime ? ` · ${active.readTime} min read` : ''}
                </span>
                <ArrowRight className='size-4 group-hover:translate-x-1 transition-transform' />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Link>

      <div>
        <h2 className='text-4xl md:text-5xl font-display font-bold text-white mb-4'>
          {title}
        </h2>
        <div className='divide-y divide-white/10 border-y border-white/10'>
          {articles.map((article, i) => (
            <div
              key={article.id}
              className={cn(
                'group/item block py-5 transition-colors',
                i === activeIndex ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              )}
              onMouseEnter={() => setActiveIndex(i)}
              onFocusCapture={() => setActiveIndex(i)}
            >
              <div className='flex items-center gap-4 relative'>
                <Link href={`/blog/${article.slug}`} className='min-w-0 flex-1 block'>
                  {article.category && (
                    <span className='text-xs font-sans uppercase tracking-wider text-malachite mb-1.5 block'>
                      {article.category.name}
                    </span>
                  )}
                  <h4 className='text-2xl font-display font-semibold text-white leading-snug line-clamp-2'>
                    {article.title}
                  </h4>
                </Link>
                <CircleButton
                  size={36}
                  href={`/blog/${article.slug}`}
                  target='_self'
                  className={cn(
                    'mt-1 transition-all duration-300',
                    i === activeIndex
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0'
                  )}
                >
                  <ArrowRight className='size-4 stroke-malachite text-transparent' />
                </CircleButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
