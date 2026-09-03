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
  q,
  category,
}: {
  initialBrowseArticles: BlogListArticle[];
  categories: BlogCategoryChip[];
  q: string;
  category: string;
}) {
  const hasFilter = q.length > 0 || category.length > 0;
  const apiQueryParams = hasFilter
    ? {
        ...(q ? { q } : {}),
        ...(category ? { category } : {}),
        limit: 48,
      }
    : undefined;

  const { replace, isPending } = useBlogSearchParams({ q, category });

  const [input, setInput] = useState(q);
  const debounced = useDebounce(input, 400);

  useEffect(() => {
    setInput(q);
  }, [q]);

  useEffect(() => {
    const next = debounced.trim();
    if (next === q) return;
    replace({ q: next || null });
  }, [debounced, q, replace]);

  // SSR already ran this exact filtered query (see blog/page.tsx) when the
  // page loaded, so seed React Query's cache with it — avoids an immediate
  // duplicate client-side fetch + spinner flash on first render. Once the
  // user changes q/category, apiQueryParams changes and this initialData no
  // longer matches the new queryKey, so a real fetch happens as normal.
  const { data, isFetching } = useQuery<BlogListArticle[]>('/articles', {
    params: apiQueryParams,
    enabled: hasFilter,
    initialData: hasFilter ? initialBrowseArticles : undefined,
  });

  const list = hasFilter ? (data ?? []) : initialBrowseArticles;

  const showSpinner = hasFilter && (isFetching || isPending);
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
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-end border-b border-coal/10 dark:border-white/10 pb-5'>
        <h2 className='text-4xl md:text-5xl font-display font-bold text-coal dark:text-white'>
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
        <div className='rounded-2xl border border-coal/10 bg-coal/5 dark:border-white/10 dark:bg-white/5 p-10 text-center text-coal/60 dark:text-white/60 font-sans flex flex-col items-center gap-4'>
          {hasFilter ? emptyMessage : 'No articles found.'}
          <Button variant='outline' size='sm' onClick={() => replace({ q: null, category: null })}>Clear filters</Button>
        </div>
      ) : null}
    </section>
  );
}
