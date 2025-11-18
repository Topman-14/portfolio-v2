'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import Spline from '@splinetool/react-spline';
import { useRef, useEffect, useState, useCallback } from 'react';

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
  zoom,
  cameraOffset = {},
  cameraPosition,
  cameraRotation,
  disableZoom = false,
  interactive = true,
  onLoad,
}: SplinePlayerProps) {
  const splineRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [calculatedZoom, setCalculatedZoom] = useState<number>(1);

  const adjustCameraFOV = useCallback((app: any) => {
    if (!containerRef.current || !app?.scene?.activeCamera) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    
    if (width === 0 || height === 0) return;

    const camera = app.scene.activeCamera;
    const aspectRatio = width / height;
    
    if (camera.fov !== undefined && camera.updateProjectionMatrix) {
      const baseFOV = camera.fov || 50;
      const adjustedFOV = aspectRatio > 1 
        ? baseFOV * (1 + (aspectRatio - 1) * 0.1)
        : baseFOV * (1 + (1 / aspectRatio - 1) * 0.15);
      
      camera.fov = Math.min(75, Math.max(45, adjustedFOV));
      camera.updateProjectionMatrix();
    }
  }, []);

  const calculateResponsiveZoom = useCallback(() => {
    if (!containerRef.current || !splineRef.current) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    
    if (width === 0 || height === 0) return;

    const baseSize = Math.min(width, height);
    const zoomFactor = baseSize / 400;
    const calculatedValue = Math.max(0.5, Math.min(2, zoomFactor));
    const newZoom = calculatedValue * 0.92;
    
    setCalculatedZoom(newZoom);

    if (splineRef.current.setZoom) {
      splineRef.current.setZoom(newZoom);
    }
  }, []);

  const applyCameraPosition = useCallback((camera: any) => {
    if (cameraPosition) {
      if (cameraPosition.x !== undefined) camera.position.x = cameraPosition.x;
      if (cameraPosition.y !== undefined) camera.position.y = cameraPosition.y;
      if (cameraPosition.z !== undefined) camera.position.z = cameraPosition.z;
      return;
    }

    const zoomToUse = zoom ?? calculatedZoom;
    if (zoomToUse !== 1) {
      const originalZ = camera.position.z;
      camera.position.z = originalZ / zoomToUse;
    }
    if (cameraOffset.x) camera.position.x += cameraOffset.x;
    if (cameraOffset.y) camera.position.y += cameraOffset.y;
    if (cameraOffset.z) camera.position.z += cameraOffset.z;
  }, [cameraPosition, cameraOffset, zoom, calculatedZoom]);

  const applyCameraRotation = useCallback((camera: any) => {
    if (!cameraRotation) return;
    if (cameraRotation.x !== undefined) camera.rotation.x = cameraRotation.x;
    if (cameraRotation.y !== undefined) camera.rotation.y = cameraRotation.y;
    if (cameraRotation.z !== undefined) camera.rotation.z = cameraRotation.z;
  }, [cameraRotation]);

  const setupCamera = useCallback((app: any) => {
    const camera = app?.scene?.activeCamera;
    if (!camera) return;

    applyCameraPosition(camera);
    applyCameraRotation(camera);
    adjustCameraFOV(app);
    app.setCamera(camera);
  }, [applyCameraPosition, applyCameraRotation, adjustCameraFOV]);

  const disableZoomNatively = useCallback((app: any) => {
    if (!app || !disableZoom) return;

    try {
      if (app.controls?.orbitControls) {
        const orbitControls = app.controls.orbitControls;
        if (orbitControls.enableZoom !== undefined) {
          orbitControls.enableZoom = false;
          console.log('[SplinePlayer] Disabled zoom via app.controls.orbitControls.enableZoom');
        }
        if (orbitControls.enablePan !== undefined) {
          orbitControls.enablePan = true;
        }
        if (orbitControls.enableRotate !== undefined) {
          orbitControls.enableRotate = true;
        }
      }

      const canvas = app.canvas;
      if (canvas) {
        const preventPinchZoom = (e: TouchEvent) => {
          if (e.touches.length === 2) {
            e.preventDefault();
            e.stopPropagation();
          }
        };

        canvas.addEventListener('touchstart', preventPinchZoom, { passive: false });
        canvas.addEventListener('touchmove', preventPinchZoom, { passive: false });
      }
    } catch (error) {
      console.warn('[SplinePlayer] Could not disable zoom natively:', error);
    }
  }, [disableZoom]);

  const handleLoad = (app: any) => {
    splineRef.current = app;

    setupCamera(app);

    if (zoom === undefined) {
      calculateResponsiveZoom();
    } else if (app.setZoom) {
      app.setZoom(zoom);
    }

    disableZoomNatively(app);

    if (interactive && app.setInteractive) {
      app.setInteractive(true);
    }

    onLoad?.(app);
  };

  useEffect(() => {
    if (zoom !== undefined || !containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (splineRef.current) {
        calculateResponsiveZoom();
        adjustCameraFOV(splineRef.current);
        if (!cameraPosition && splineRef.current?.scene?.activeCamera) {
          setTimeout(() => {
            setupCamera(splineRef.current);
          }, 50);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [zoom, calculateResponsiveZoom, cameraPosition, setupCamera, adjustCameraFOV]);

  useEffect(() => {
    if (zoom !== undefined || !splineRef.current) return;
    
    const timeoutId = setTimeout(() => {
      calculateResponsiveZoom();
      adjustCameraFOV(splineRef.current);
      if (!cameraPosition && splineRef.current?.scene?.activeCamera) {
        setupCamera(splineRef.current);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [zoom, calculateResponsiveZoom, cameraPosition, setupCamera, adjustCameraFOV]);

  useEffect(() => {
    if (zoom !== undefined || !splineRef.current || cameraPosition) return;
    
    if (calculatedZoom !== 1 && splineRef.current?.scene?.activeCamera) {
      setupCamera(splineRef.current);
    }
  }, [calculatedZoom, zoom, cameraPosition, setupCamera]);

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
