'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useRef, useEffect, useState, useCallback } from 'react';

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

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
  hideOffScreen?: boolean;
  hideOffScreenMargin?: string;
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
  hideOffScreen = false,
  hideOffScreenMargin = '320px',
  onLoad,
}: SplinePlayerProps) {
  const splineRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [calculatedZoom, setCalculatedZoom] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [nearViewport, setNearViewport] = useState(true);

  const isLowEnd =
    typeof window !== 'undefined' &&
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2) ||
      // deviceMemory is Chromium-only; many mid-range Android phones report
      // 4+ cores but still choke on WebGL, so check RAM too where available.
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined &&
        (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 4));

  const mountSpline = !isLowEnd && (!hideOffScreen || nearViewport);

  // Pause render loop when tab is hidden, resume when visible
  useEffect(() => {
    const handleVisibility = () => {
      const app = splineRef.current;
      if (!app) return;
      if (document.hidden) {
        app.stop?.();
      } else {
        app.play?.();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

useEffect(() => {
    if (!hideOffScreen) {
      setNearViewport(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setNearViewport(entry.isIntersecting);
      },
      { root: null, rootMargin: hideOffScreenMargin, threshold: 0 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [hideOffScreen, hideOffScreenMargin]);

  useEffect(() => {
    if (!mountSpline) {
      splineRef.current = null;
      setIsLoaded(false);
    }
  }, [mountSpline]);

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

    // Limit to 30fps — sufficient for ambient hero animations, halves GPU load
    if (app.setFrameRate) {
      app.setFrameRate(30);
    }

    setIsLoaded(true);
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
      style={{
        pointerEvents: interactive ? 'auto' : 'none',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
    >
      {mountSpline ? <Spline scene={scene} onLoad={handleLoad} /> : null}
    </div>
  );
}
