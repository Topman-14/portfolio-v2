'use client';

import SplinePlayer from '@/components/custom/spline';
import { useViewport } from '@/hooks/use-viewport';

export default function HeroScene() {
  const { isMobile } = useViewport();

  return (
    <div className='relative md:absolute mx-auto xl:bottom-32 bottom-20 right-12 size-[300px] md:max-h-none lg:size-[400px] z-[20]'>
      <SplinePlayer
        scene='/3d/hero.splinecode'
        draggable={true}
        className='w-full h-full'
        cameraPosition={{ x: 50, y: -90, z: 380 }}
        cameraRotation={{ x: -0.05, y: -0.15, z: 0 }}
        disableZoom={true}
        interactive={!isMobile}
      />
    </div>
  );
}
