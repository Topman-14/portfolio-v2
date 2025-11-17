'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface GInputProps extends React.ComponentProps<'input'> {
  className?: string;
}

const GInput = forwardRef<HTMLInputElement, GInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-white/40 font-sans focus:border-malachite focus:outline-none transition-colors',
          className
        )}
        {...props}
      />
    );
  }
);

GInput.displayName = 'GInput';

export default GInput;

