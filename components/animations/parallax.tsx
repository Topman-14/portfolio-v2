'use client';

import { ReactNode } from 'react';
import { Parallax as ParallaxComponent } from 'react-scroll-parallax';

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export default function Parallax({
  children,
  speed = -15,
  className = '',
}: ParallaxProps) {
  const speedAbs = Math.abs(speed);
  const scalePercent = Math.max(30, speedAbs * 2);
  
  return (
    <ParallaxComponent speed={speed} className={`absolute inset-0 ${className}`}>
      <div 
        className="relative"
        style={{
          position: 'absolute',
          width: `${100 + scalePercent}%`,
          height: `${100 + scalePercent}%`,
          left: `-${scalePercent / 2}%`,
          top: `-${scalePercent / 2}%`,
        }}
      >
        {children}
      </div>
    </ParallaxComponent>
  );
}
