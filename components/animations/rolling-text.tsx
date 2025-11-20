'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
// import SplitText from 'gsap-trial/SplitText';
import SplitType from 'split-type';
import { cn } from '@/lib/utils';
import { getFontsReady } from '@/lib/fonts-ready';

interface RollingTextProps {
  children: string;
  className?: string;
}

const config = {
  stagger: 0.05,
  duration: 0.35,
  ease: 'expo.out',
};

export default function RollingText({ children, className }: RollingTextProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      getFontsReady().then(() => {
        const original = el.querySelector(
          '.rolling-text-original'
        ) as HTMLElement;
        const clone = el.querySelector('.rolling-text-clone') as HTMLElement;

        if (!original || !clone) return;

        const split1 = new SplitType(original, { types: 'chars' });
        const split2 = new SplitType(clone, { types: 'chars' });

        gsap.set(split2.chars, { yPercent: 120 });

        const tl = gsap.timeline({ paused: true });

        tl.to(
          split1.chars,
          {
            yPercent: -120,
            ...config,
          },
          0
        ).to(
          split2.chars,
          {
            yPercent: 0,
            ...config,
          },
          0
        );

        const enterHandler = () => tl.play();
        const leaveHandler = () => tl.reverse();

        el.addEventListener('mouseenter', enterHandler);
        el.addEventListener('mouseleave', leaveHandler);

        return () => {
          el.removeEventListener('mouseenter', enterHandler);
          el.removeEventListener('mouseleave', leaveHandler);
          tl.kill();
          split1.revert();
          split2.revert();
        };
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
    >
      <div className='rolling-text-original'>{children}</div>
      <div className='rolling-text-clone absolute text-malachite top-0 left-0 w-full h-full'>
        {children}
      </div>
    </div>
  );
}
