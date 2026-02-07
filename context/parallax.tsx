'use client';
import { ParallaxProvider as ReactParallaxProvider } from 'react-scroll-parallax';
import { ReactNode } from 'react';

export function ParallaxProvider({ children }: { children: ReactNode }) {
  return <ReactParallaxProvider>{children}</ReactParallaxProvider>;
}
