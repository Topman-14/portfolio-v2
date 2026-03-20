'use client';

import { useEffect, useState } from 'react';
import { SearchField } from '@/components/ui/search-field';
import { useBlogSearchParams } from '@/hooks/use-blog-search-params';
import { cn } from '@/lib/utils';

export function BlogSearch({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const { q, category, toggleCategory, commitQToUrlAndScrollToBrowse } =
    useBlogSearchParams();

  const [input, setInput] = useState(q);

  useEffect(() => {
    setInput(q);
  }, [q]);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-end border-b border-white/10 pb-6'>
      <div className='flex items-center gap-2 flex-wrap'>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type='button'
            onClick={() => {
                toggleCategory(cat.id)
                commitQToUrlAndScrollToBrowse()
            }}
            className={cn(
              'inline-flex rounded-full border border-coal/30 bg-white/20 px-2.5 py-0.5 font-sans text-xs uppercase cursor-pointer tracking-wide text-white transition-colors',
              category === cat.id &&
                'ring-1 ring-malachite'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <SearchField
        value={input}
        onValueChange={setInput}
        placeholder='Search for an article'
        aria-label='Search blog'
        variant='hero'
        onAction={() => commitQToUrlAndScrollToBrowse(input)}
      />
    </div>
  );
}
