'use client';

import { ChevronUp } from 'lucide-react';
import CircleButton from '@/components/ui/circle-button';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/use-scroll-position';

export default function ScrollToTopButton() {
  const { isScrollingUp, isAtBottom } = useScrollPosition();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showScrollButton = isScrollingUp || isAtBottom;

  return (
    <CircleButton
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-8 right-8 z-50 transition-opacity duration-300',
        showScrollButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      size={48}
      aria-label='Back to top'
    >
      <ChevronUp
        className='hover:text-malachite transition-colors'
        style={{ fill: 'transparent' }}
      />
    </CircleButton>
  );
}


