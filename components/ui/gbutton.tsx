'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { cn, ROUNDED_PILL_STROKE_WIDTH, roundedPillPathD } from '@/lib/utils';
import { useElementDimensions } from '@/hooks/use-element-dimensions';

interface GButtonProps extends React.ComponentProps<'button'> {
  href?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'green';
  className?: string;
  containerClassName?: string;
}

export const GButton = ({
  href,
  onClick,
  children,
  variant = 'primary',
  className = '',
  disabled,
  type = 'button',
  containerClassName = '',
  ...props
}: GButtonProps) => {
  const borderRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useElementDimensions(containerRef);

  const strokeWidth = ROUNDED_PILL_STROKE_WIDTH;
  const pathData = roundedPillPathD(
    dimensions.width,
    dimensions.height,
    strokeWidth
  );

  useGSAP(
    () => {
      if (!borderRef.current || !containerRef.current || dimensions.width === 0)
        return;

      const path = borderRef.current;
      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      const tl = gsap.timeline({ paused: true });

      tl.to(path, {
        strokeDashoffset: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      });

      const handleMouseEnter = () => {
        if (!disabled) tl.play();
      };
      const handleMouseLeave = () => {
        if (!disabled) tl.reverse();
      };

      containerRef.current.addEventListener('mouseenter', handleMouseEnter);
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
          containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    },
    { scope: containerRef, dependencies: [dimensions, disabled] }
  );

  const baseClasses =
    'relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full backdrop-blur-md font-sans font-medium transition-all duration-300 overflow-hidden cursor-pointer';

  const variantClasses = {
    primary: 'bg-white/10 text-white',
    secondary: 'bg-coal/10 text-coal',
    green: 'bg-malachite/20 border border-malachite/30 text-malachite hover:bg-malachite/30',
  };

  const content = (
    <div
      ref={containerRef}
      className={cn(
        baseClasses,
        variantClasses[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <svg
        className='absolute inset-0 size-full pointer-events-none'
        style={{ overflow: 'visible' }}
      >
        {pathData && (
          <path
            ref={borderRef}
            d={pathData}
            fill='none'
            stroke='oklch(0.72 0.22 144)'
            strokeWidth={strokeWidth}
          />
        )}
      </svg>
      <span className='relative z-10 flex gap-2 items-center'>{children}</span>
    </div>
  );

  if (href) {
    return <Link className={cn('block', containerClassName)} href={href}>{content}</Link>;
  }

  return (
    <button className={cn(containerClassName)} onClick={onClick} type={type} disabled={disabled} {...props}>
      {content}
    </button>
  );
};
