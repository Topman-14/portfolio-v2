'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@/hooks/use-query';
import {WorkCard} from './work-card';
import type { Work } from '@prisma/client';
import { RevealHeader } from '@/components/custom/reveal-header';
import { SearchField } from '@/components/ui/search-field';
import { LoadingFallback } from '@/components/ui/suspense';

type OtherWorksSectionProps = {
  initialWorks: Work[];
};

const OtherWorksSection = ({ initialWorks }: OtherWorksSectionProps) => {
  const [input, setInput] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const id = setTimeout(() => setDebounced(input), 350);
    return () => clearTimeout(id);
  }, [input]);

  const trimmed = debounced.trim();
  const hasActiveSearch = trimmed.length > 0;

  const { data, isFetching } = useQuery<Work[]>('/works', {
    params: hasActiveSearch
      ? { featured: 'false', q: trimmed, limit: 48 }
      : undefined,
    enabled: hasActiveSearch,
  });

  const displayWorks = useMemo(
    () => (hasActiveSearch ? (data ?? []) : initialWorks),
    [hasActiveSearch, data, initialWorks]
  );

  const showSpinner = hasActiveSearch && isFetching;
  const showGrid = !showSpinner && displayWorks.length > 0;
  const showEmpty = !showSpinner && displayWorks.length === 0;

  return (
    <section
      id='more-work'
      className='relative  pt-20 md:pt-24 px-4 md:px-8 lg:px-16'
    >
      <div className='mx-auto max-w-wide'>
        <div className='mb-10 flex flex-col gap-6 border-b border-white/10 pb-6 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-8 lg:gap-10'>
          <RevealHeader
            title='More work'
            subtitle='Additional projects not highlighted in featured — search by title, stack, or category.'
            className='min-w-0 flex-1 md:mb-0'
            subtitleClassName='mt-2 max-w-xl'
          />
          <div className='flex w-full shrink-0 md:max-w-sm lg:max-w-md'>
            <SearchField
              value={input}
              onValueChange={setInput}
              placeholder='Search projects'
              aria-label='Search projects'
              variant='browse'
              inputClassName='px-1'
            />
          </div>
        </div>

        {showSpinner ? (
          <LoadingFallback className='min-h-[200px] h-auto py-12' />
        ) : null}

        {showGrid ? (
          <ul className='grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
            {displayWorks.map((work) => (
              <li key={work.id} className='min-w-0'>
                <WorkCard work={work} />
              </li>
            ))}
          </ul>
        ) : null}

        {showEmpty ? (
          <p className='text-center font-sans text-white/55'>
            {hasActiveSearch
              ? `No projects match "${trimmed}".`
              : 'No other projects in the archive yet.'}
          </p>
        ) : null}
      </div>
    </section>
  );
};

export default OtherWorksSection;
