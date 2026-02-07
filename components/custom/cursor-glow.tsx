'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';


export function CursorGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [x, y]);

  return (
    <motion.div
      className='fixed top-0 left-0 size-[1200px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-2 opacity-80'
      style={{
        x: springX,
        y: springY,
        background: 'radial-gradient(circle, rgba(20, 204, 94, 0.11) 0%, transparent 70%, transparent 100%)',
      }}
    />
  );
}