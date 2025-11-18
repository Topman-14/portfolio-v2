'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface GButtonProps extends React.ComponentProps<'button'> {
  href?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'green';
  className?: string;
}

export const GButton = ({
  href,
  onClick,
  children,
  variant = 'primary',
  className = '',
  disabled,
  type = 'button',
  ...props
}: GButtonProps) => {
  const borderRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      if (!borderRef.current || !containerRef.current || dimensions.width === 0) return;

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

  const radius = Math.min(dimensions.height / 2, dimensions.width / 2, 999);
  const strokeWidth = 1.5;
  const halfStroke = strokeWidth / 2;
  
  const pathData = dimensions.width > 0 && dimensions.height > 0
    ? `M ${radius + halfStroke},${halfStroke} 
       L ${dimensions.width - radius - halfStroke},${halfStroke} 
       A ${radius} ${radius} 0 0 1 ${dimensions.width - halfStroke},${radius + halfStroke} 
       L ${dimensions.width - halfStroke},${dimensions.height - radius - halfStroke} 
       A ${radius} ${radius} 0 0 1 ${dimensions.width - radius - halfStroke},${dimensions.height - halfStroke} 
       L ${radius + halfStroke},${dimensions.height - halfStroke} 
       A ${radius} ${radius} 0 0 1 ${halfStroke},${dimensions.height - radius - halfStroke} 
       L ${halfStroke},${radius + halfStroke} 
       A ${radius} ${radius} 0 0 1 ${radius + halfStroke},${halfStroke} Z`
    : '';

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
        className='absolute inset-0 w-full h-full pointer-events-none'
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
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button onClick={onClick} type={type} disabled={disabled} {...props}>
      {content}
    </button>
  );
};

