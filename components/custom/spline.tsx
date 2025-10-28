'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import Spline from '@splinetool/react-spline';
import { useRef } from 'react';

interface SplinePlayerProps {
  scene: string;
  className?: string;
  draggable?: boolean;
  zoom?: number; // e.g. 1 = normal, >1 = zoom in, <1 = zoom out
  cameraOffset?: { x?: number; y?: number; z?: number };
  onLoad?: (app: any) => void;
}

export default function SplinePlayer({
  scene,
  className,
  draggable = false,
  zoom = 1,
  cameraOffset = {},
  onLoad,
}: SplinePlayerProps) {
  const splineRef = useRef<any>(null);

  const handleLoad = (app: any) => {
    splineRef.current = app;

    const camera = app?.scene?.activeCamera;
    if (camera) {
      if (zoom !== 1) camera.position.z /= zoom;
      if (cameraOffset.x) camera.position.x += cameraOffset.x;
      if (cameraOffset.y) camera.position.y += cameraOffset.y;
      if (cameraOffset.z) camera.position.z += cameraOffset.z;

      app.setCamera(camera);
    }

    onLoad?.(app);
  };

  return (
    <div
      className={cn(
        'w-full h-full',
        draggable && 'cursor-grab active:cursor-grabbing',
        className
      )}
    >
      <Spline scene={scene} onLoad={handleLoad} />
    </div>
  );
}
