'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { useQuery } from '@/hooks/use-query';
import { useBlogSearchParams } from '@/hooks/use-blog-search-params';
import { BlogCard, type BlogListArticle } from './blog-card';
import { SearchField } from '@/components/ui/search-field';
import { LoadingFallback } from '@/components/ui/suspense';
import { Button } from '@/components/ui/button';

export type BlogCategoryChip = { id: string; name: string };

export function BlogBrowseSection({
  initialBrowseArticles,
  categories,
}: {
  initialBrowseArticles: BlogListArticle[];
  categories: BlogCategoryChip[];
}) {
  const {
    q,
    category,
    hasFilter,
    paramsString,
    apiQueryParams,
    replace,
  } = useBlogSearchParams();

  const [input, setInput] = useState(q);
  const debounced = useDebounce(input, 400);

  useEffect(() => {
    setInput(q);
  }, [q]);

  useEffect(() => {
    const next = debounced.trim();
    if (next === q) return;
    replace({ q: next || null });
  }, [debounced, paramsString, q, replace]);

  const { data, isFetching } = useQuery<BlogListArticle[]>('/articles', {
    params: apiQueryParams,
    enabled: hasFilter,
  });

  const list = hasFilter ? (data ?? []) : initialBrowseArticles;

  const showSpinner = hasFilter && isFetching;
  const showGrid = !showSpinner && list.length > 0;
  const showEmpty = !showSpinner && list.length === 0;

  const categoryName = categories.find((c) => c.id === category)?.name;
  const heading = useMemo(() => {
    if (categoryName) return categoryName;
    return 'Browse all';
  }, [categoryName]);

  const emptyMessage = useMemo(() => {
    if (q && category && categoryName) {
      return `No articles found for “${q}” in ${categoryName}.`;
    }
    if (q) return `No articles found for “${q}”.`;
    if (categoryName) return `No articles found in ${categoryName}.`;
    return 'No articles found.';
  }, [q, category, categoryName]);

  return (
    <section id='browse-all' className='space-y-8 md:mt-36'>
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-end border-b border-white/10 pb-5'>
        <h2 className='text-4xl md:text-5xl font-display font-bold text-white'>
          {heading}
        </h2>
        <SearchField
          value={input}
          onValueChange={setInput}
          placeholder='Search for an article'
          aria-label='Search blog'
          variant='browse'
        />
      </div>

      {showSpinner ? (
        <LoadingFallback className='min-h-[200px] h-auto py-12' />
      ) : null}

      {showGrid ? (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-10'>
          {list.map((article, index) => (
            <BlogCard key={article.id} article={article} priority={index < 4} />
          ))}
        </div>
      ) : null}

      {showEmpty ? (
        <div className='rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60 font-sans flex flex-col items-center gap-4'>
          {hasFilter ? emptyMessage : 'No articles found.'}
          <Button variant='outline' size='sm' onClick={() => replace({ q: null, category: null })}>Clear filters</Button>
        </div>
      ) : null}
    </section>
  );
}
