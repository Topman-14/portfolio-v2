'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SearchFieldVariant = 'hero' | 'browse';

type SearchFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  'aria-label'?: string;
  variant: SearchFieldVariant;
  onAction?: () => void;
  className?: string;
  inputClassName?: string;
};

export function SearchField({
  value,
  onValueChange,
  placeholder = 'Search',
  'aria-label': ariaLabel = 'Search',
  variant,
  onAction,
  className,
  inputClassName,
}: SearchFieldProps) {
  return (
    <div className={cn('flex w-full min-w-0 items-center gap-2', className)}>
      <div className='relative min-w-0 w-full group/search'>
        <Input
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'h-10 w-full rounded-none border-0 bg-transparent text-white placeholder:text-white/45 focus-visible:ring-0 px-5',
            inputClassName
          )}
          onKeyDown={(e) => {
            if (variant === 'hero' && e.key === 'Enter') {
              onAction?.();
            }
          }}
        />
        <span className='pointer-events-none absolute bottom-0 left-0 h-px w-full bg-white/20' />
        <span className='pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-malachite transition-transform duration-300 ease-out group-focus-within/search:scale-x-100' />
      </div>
      <Button
        variant='link'
        size='icon'
        aria-label={ariaLabel}
        className='shrink-0 text-white/75 hover:text-malachite'
        type='button'
        onClick={variant === 'hero' ? onAction : undefined}
      >
        <Search className='size-5' />
      </Button>
    </div>
  );
}
