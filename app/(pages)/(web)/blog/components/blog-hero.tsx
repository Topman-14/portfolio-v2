'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Article, Category } from '@prisma/client';
import { cn } from '@/lib/utils';

type ArticleWithCategory = Article & {
  category: Category | null;
};

export const BlogHero = ({ articles }: { articles: ArticleWithCategory[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = articles[activeIndex];

  if (articles.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      <Link href={`/blog/${active.slug}`} className="group">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/5">
          {active.coverImg ? (
            <Image
              src={active.coverImg}
              alt={active.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-malachite/30 via-amber/20 to-bittersweet/30" />
          )}
        </div>
        <div className="mt-6 space-y-3">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
            {active.title}
          </h3>
          {active.excerpt && (
            <p className="text-white/70 text-base leading-relaxed font-sans line-clamp-2">
              {active.excerpt}
            </p>
          )}
        </div>
      </Link>

      <div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
          Latest articles
        </h2>
        <div className="divide-y divide-white/10">
          {articles.map((article, i) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className={cn(
                'block py-5 transition-colors',
                i === activeIndex ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              )}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {article.category && (
                <span className="text-xs font-sans uppercase tracking-wider text-malachite mb-1.5 block">
                  {article.category.name}
                </span>
              )}
              <h4 className="text-lg font-display font-semibold text-white leading-snug">
                {article.title}
              </h4>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
