'use client';

import SplinePlayer from '@/components/custom/spline';
import SplineVideo from '@/components/custom/spline-video';
import { useViewport } from '@/hooks/use-viewport';

export default function HeroScene() {
  const { isMobile } = useViewport();

  return (
    <div className='md:absolute mx-auto xl:bottom-32 bottom-20 right-12 size-[300px] md:max-h-none lg:size-[400px] z-[20] pointer-events-none'>
      {isMobile ? (
        <SplineVideo src='/3d/hero-mobile' className='w-full h-full' />
      ) : (
        <SplinePlayer
          scene='/3d/hero.splinecode'
          draggable={true}
          className='w-full h-full'
          cameraPosition={{ x: 50, y: -90, z: 380 }}
          cameraRotation={{ x: -0.05, y: -0.15, z: 0 }}
          disableZoom={true}
          interactive={true}
          hideOffScreen
        />
      )}
    </div>
  );
}
