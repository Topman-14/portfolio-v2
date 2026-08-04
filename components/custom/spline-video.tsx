import { cn } from '@/lib/utils';

interface SplineVideoProps {
  /** Basename without extension, e.g. '/3d/hero-mobile' */
  src: string;
  className?: string;
}

/**
 * Lightweight stand-in for SplinePlayer on mobile/low-end devices: a baked,
 * looping, alpha-channel video instead of booting the WebGL runtime.
 * Baked via `npm run bake:spline` (scripts/bake-spline-video.mjs), which
 * captures real frames from @splinetool/runtime and encodes VP9 w/ alpha
 * (yuva420p) — covers Chrome/Firefox/Edge (majority of Android).
 *
 * `${src}-alpha.mov` (HEVC w/ alpha) is the only format Safari/iOS honors
 * for video alpha, and can only be encoded via Apple's videotoolbox (Mac
 * only — see the bake script's KEEP_FRAMES=1 note). Without it, Safari/iOS
 * has no playable `<source>` at all (it rejects the alpha-WebM), so the
 * `<video>` element renders an opaque black box instead of falling back to
 * the poster image.
 */
export default function SplineVideo({ src, className }: SplineVideoProps) {
  return (
    <video
      className={cn('w-full h-full object-contain', className)}
      autoPlay
      muted
      loop
      playsInline
      poster={`${src}-poster.png`}
    >
      <source src={`${src}-alpha.mov`} type='video/quicktime; codecs="hvc1"' />
      <source src={`${src}.webm`} type='video/webm' />
    </video>
  );
}
