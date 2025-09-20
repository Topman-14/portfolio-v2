'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant='outline'
      size='icon'
      className='rounded-full'
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun
        className='size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 transition-200'
        size={16}
      />
      <Moon
        className='absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 transition-200'
        size={16}
      />
    </Button>
  );
}
