'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Laptop, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { gsap } from '@/lib/gsap-config';

const OPTIONS = [
  { value: 'light', label: 'Light theme', Icon: Sun },
  { value: 'system', label: 'System theme', Icon: Laptop },
  { value: 'dark', label: 'Dark theme', Icon: Moon },
] as const;

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasPositioned = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeIndex = OPTIONS.findIndex((option) => option.value === theme);

  useEffect(() => {
    if (!mounted || activeIndex === -1) return;

    const container = containerRef.current;
    const indicator = indicatorRef.current;
    const button = buttonRefs.current[activeIndex];
    if (!container || !indicator || !button) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const left = buttonRect.left - containerRect.left;

    if (!hasPositioned.current) {
      gsap.set(indicator, { left, width: buttonRect.width, opacity: 1 });
      hasPositioned.current = true;
      return;
    }

    gsap.to(indicator, {
      left,
      width: buttonRect.width,
      duration: 0.35,
      ease: 'power3.out',
    });
  }, [mounted, activeIndex]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur-lg',
        className
      )}
    >
      <span
        ref={indicatorRef}
        className='absolute top-1 bottom-1 left-1 rounded-full bg-malachite opacity-0'
      />
      {OPTIONS.map(({ value, label, Icon }, index) => {
        const isActive = mounted && theme === value;
        return (
          <button
            key={value}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type='button'
            onClick={() => setTheme(value)}
            aria-label={label}
            aria-pressed={isActive}
            className={cn(
              'relative z-10 flex size-9 items-center justify-center rounded-full transition-colors cursor-pointer',
              isActive ? 'text-coal' : 'text-white/60 hover:text-white'
            )}
          >
            <Icon className='size-4' />
          </button>
        );
      })}
    </div>
  );
}
