'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from 'gsap-trial/SplitText';
import { cn } from '@/lib/utils';

interface RollingTextProps {
  children: string;
  className?: string;
  animate?: boolean;
}

gsap.registerPlugin(SplitText);

const config = {
  stagger: 0.05,
  duration: 0.35,
  ease: 'expo.out',
}

export default function RollingText({
  children,
  className,
}: RollingTextProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;
  
    document.fonts.ready.then(() => {
      const original = el.querySelector('.rolling-text-original');
      const clone = el.querySelector('.rolling-text-clone');
  
      const split1 = new SplitText(original, { type: 'chars' });
      const split2 = new SplitText(clone, { type: 'chars' });
  
      gsap.set(split2.chars, { yPercent: 120 });
  
      const tl = gsap.timeline({ paused: true });
  
      tl.to(split1.chars, {
        yPercent: -120,
        ...config,
      }, 0)
      .to(split2.chars, {
        yPercent: 0,
        ...config,
      }, 0);
  
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
  }, { scope: containerRef });
  

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
      <div className="rolling-text-original">{children}</div>
      <div className="rolling-text-clone absolute text-malachite top-0 left-0 w-full h-full">
        {children}
      </div>
    </div>
  );
  
}
