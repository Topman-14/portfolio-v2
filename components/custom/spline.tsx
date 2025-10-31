'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import Spline from '@splinetool/react-spline';
import { useRef, useEffect } from 'react';

interface SplinePlayerProps {
  scene: string;
  className?: string;
  draggable?: boolean;
  zoom?: number;
  cameraOffset?: { x?: number; y?: number; z?: number };
  cameraPosition?: { x?: number; y?: number; z?: number };
  cameraRotation?: { x?: number; y?: number; z?: number };
  disableZoom?: boolean;
  interactive?: boolean;
  onLoad?: (app: any) => void;
}

export default function SplinePlayer({
  scene,
  className,
  draggable = false,
  zoom = 1,
  cameraOffset = {},
  cameraPosition,
  cameraRotation,
  disableZoom = false,
  interactive = true,
  onLoad,
}: SplinePlayerProps) {
  const splineRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLoad = (app: any) => {
    splineRef.current = app;

    const camera = app?.scene?.activeCamera;
    if (camera) {
      if (cameraPosition) {
        if (cameraPosition.x !== undefined) camera.position.x = cameraPosition.x;
        if (cameraPosition.y !== undefined) camera.position.y = cameraPosition.y;
        if (cameraPosition.z !== undefined) camera.position.z = cameraPosition.z;
      } else {
        if (zoom !== 1) {
          const originalZ = camera.position.z;
          camera.position.z = originalZ / zoom;
        }
        if (cameraOffset.x) camera.position.x += cameraOffset.x;
        if (cameraOffset.y) camera.position.y += cameraOffset.y;
        if (cameraOffset.z) camera.position.z += cameraOffset.z;
      }

      if (cameraRotation) {
        if (cameraRotation.x !== undefined) camera.rotation.x = cameraRotation.x;
        if (cameraRotation.y !== undefined) camera.rotation.y = cameraRotation.y;
        if (cameraRotation.z !== undefined) camera.rotation.z = cameraRotation.z;
      }

      app.setCamera(camera);
    }

    if (app.setZoom) {
      app.setZoom(disableZoom ? 1 : undefined);
    }

    if (interactive && app.setInteractive) {
      app.setInteractive(true);
    }

    if (disableZoom && app.canvas) {
      const canvas = app.canvas;
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      canvas.addEventListener('wheel', handleWheel, { passive: false });
    }

    onLoad?.(app);
  };

  useEffect(() => {
    if (disableZoom && containerRef.current) {
      const container = containerRef.current;
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [disableZoom]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full h-full',
        draggable && 'cursor-grab active:cursor-grabbing',
        disableZoom && 'overflow-hidden',
        className
      )}
      style={{ pointerEvents: interactive ? 'auto' : 'none' }}
    >
      <Spline scene={scene} onLoad={handleLoad} />
    </div>
  );
}
