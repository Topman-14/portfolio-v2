'use client';

import { cn, ROUNDED_PILL_STROKE_WIDTH, roundedPillPathD } from '@/lib/utils';
import { useElementDimensions } from '@/hooks/use-element-dimensions';
import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

interface GInputProps extends React.ComponentProps<'input'> {
  className?: string;
}

const GInput = forwardRef<HTMLInputElement, GInputProps>(
  ({ className, onFocus, onBlur, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const animatedPathRef = useRef<SVGPathElement>(null);
    const dimensions = useElementDimensions(containerRef);
    const [dashLen, setDashLen] = useState(0);
    const [focused, setFocused] = useState(false);

    const strokeWidth = ROUNDED_PILL_STROKE_WIDTH;
    const pathData = roundedPillPathD(
      dimensions.width,
      dimensions.height,
      strokeWidth
    );

    useLayoutEffect(() => {
      if (!animatedPathRef.current || !pathData) return;
      setDashLen(animatedPathRef.current.getTotalLength());
    }, [pathData]);

    return (
      <div ref={containerRef} className='relative min-w-0 w-full'>
        <svg
          className='pointer-events-none absolute inset-0 z-0 size-full'
          style={{ overflow: 'visible' }}
          aria-hidden
        >
          {pathData ? (
            <>
              <path
                d={pathData}
                fill='none'
                stroke='rgba(255,255,255,0.2)'
                strokeWidth={strokeWidth}
              />
              <path
                ref={animatedPathRef}
                d={pathData}
                fill='none'
                stroke='oklch(0.72 0.22 144)'
                strokeWidth={strokeWidth}
                strokeDasharray={dashLen}
                strokeDashoffset={focused ? 0 : dashLen}
                className='transition-[stroke-dashoffset] duration-300 ease-out'
              />
            </>
          ) : null}
        </svg>
        <input
          ref={ref}
          className={cn(
            'relative z-10 h-12 w-full rounded-full border-0 bg-white/5 px-5 text-white  placeholder:text-white/40 font-sans focus-visible:outline-none focus-visible:ring-0',
            className
          )}
          onFocus={(e) => {
            onFocus?.(e);
            setFocused(true);
          }}
          onBlur={(e) => {
            onBlur?.(e);
            setFocused(false);
          }}
          {...props}
        />
      </div>
    );
  }
);

GInput.displayName = 'GInput';

export default GInput;
