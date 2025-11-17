'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FC, ReactNode, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface CircleButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
  target?: string;
  size?: number;
}

const CircleButton: FC<CircleButtonProps> = ({
  href,
  onClick,
  className,
  children,
  target,
  size = 35,
}) => {
  const borderRef = useRef<SVGCircleElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const containerRef = onClick ? buttonRef : linkRef;
  
  const strokeWidth = 2;
  const radius = size / 2 - strokeWidth / 2;

  useGSAP(
    () => {
      if (!borderRef.current || !containerRef.current) return;

      const circle = borderRef.current;
      const circumference = 2 * Math.PI * radius;

      gsap.set(circle, {
        strokeDasharray: circumference,
        strokeDashoffset: circumference,
      });

      const tl = gsap.timeline({ paused: true });

      tl.to(circle, {
        strokeDashoffset: 0,
        duration: 0.35,
        opacity: 1,
        ease: 'power2.inOut',
      });

      const handleMouseEnter = () => tl.play();
      const handleMouseLeave = () => tl.reverse();

      containerRef.current.addEventListener('mouseenter', handleMouseEnter);
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener(
            'mouseenter',
            handleMouseEnter
          );
          containerRef.current.removeEventListener(
            'mouseleave',
            handleMouseLeave
          );
        }
      };
    },
    { scope: containerRef, dependencies: [radius] }
  );

  const baseClasses = cn(
    'relative text-white bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center transition-colors ease-in-out cursor-pointer overflow-hidden',
    '[&>svg]:fill-current [&>svg]:transition-[fill] [&>svg]:duration-300',
    className
  );

  if (onClick) {
    return (
      <button
        ref={buttonRef}
        onClick={onClick}
        className={baseClasses}
        style={{ width: size, height: size }}
      >
        <svg
          className='absolute inset-0 w-full h-full pointer-events-none'
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            ref={borderRef}
            cx='50%'
            cy='50%'
            r={radius}
            fill='none'
            opacity={0}
            stroke='oklch(0.72 0.22 144)'
            strokeWidth={strokeWidth}
          />
        </svg>
        {children}
      </button>
    );
  }

  if (href) {
    return (
      <Link
        ref={linkRef}
        href={href}
        target={target || '_blank'}
        className={baseClasses}
        style={{ width: size, height: size }}
      >
        <svg
          className='absolute inset-0 w-full h-full pointer-events-none'
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            ref={borderRef}
            cx='50%'
            cy='50%'
            r={radius}
            fill='none'
            opacity={0}
            stroke='oklch(0.72 0.22 144)'
            strokeWidth={strokeWidth}
          />
        </svg>
        {children}
      </Link>
    );
  }

  return null;
};

export default CircleButton;

