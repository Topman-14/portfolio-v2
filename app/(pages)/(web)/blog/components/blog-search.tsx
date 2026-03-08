'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BlogSearchProps = {
  initialQuery: string;
  mode: 'hero' | 'debounced';
  placeholder?: string;
  targetId?: string;
  className?: string;
};

const getNextUrl = (pathname: string, query: string, current: URLSearchParams, hash?: string) => {
  const params = new URLSearchParams(current.toString());
  const trimmed = query.trim();

  if (trimmed) {
    params.set('q', trimmed);
  } else {
    params.delete('q');
  }

  const queryString = params.toString();
  const hashPart = hash ? `#${hash}` : '';
  return queryString ? `${pathname}?${queryString}${hashPart}` : `${pathname}${hashPart}`;
};

export const BlogSearch = ({
  initialQuery,
  mode,
  placeholder = 'Search for an article',
  targetId,
  className,
}: BlogSearchProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('q') || '';
  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    setValue(currentQuery);
  }, [currentQuery]);


  const applyQuery = (nextValue: string, withHash: boolean) => {
    const nextUrl = getNextUrl(pathname, nextValue, searchParams, withHash ? targetId : undefined);
    router.push(nextUrl, { scroll: withHash });
  };

  useEffect(() => {
    if (mode !== 'debounced') return;
    const timeout = setTimeout(() => {
      if (value === currentQuery) return;
      const nextUrl = getNextUrl(pathname, value, searchParams);
      router.replace(nextUrl, { scroll: false });
    }, 350);

    return () => clearTimeout(timeout);
  }, [mode, value, currentQuery, pathname, router, searchParams]);

  return (
    <div className='flex items-center gap-2 w-full'>
      <div className='relative w-full group/search'>
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full h-10 rounded-none border-0 bg-transparent text-white placeholder:text-white/45 focus-visible:ring-0 px-5',
            className
          )}
          onKeyDown={(event) => {
            if (mode === 'hero' && event.key === 'Enter') {
              applyQuery(value, true);
            }
          }}
        />
        <span className='pointer-events-none absolute bottom-0 left-0 h-px w-full bg-white/20' />
        <span className='pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-malachite transition-transform duration-300 ease-out group-focus-within/search:scale-x-100' />
      </div>
      <Button
        variant='link'
        size='icon'
        aria-label='Search blog'
        className='text-white/75 hover:text-malachite'
        onClick={() => applyQuery(value, mode === 'hero')}
      >
        <Search className='size-5' />
      </Button>
    </div>
  );
};
