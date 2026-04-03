export const ROUNDED_PILL_STROKE_WIDTH = 1.5;

export function roundedPillRadius(width: number, height: number): number {
  return Math.min(height / 2, width / 2, 999);
}

export function roundedPillPathD(
  width: number,
  height: number,
  strokeWidth: number = ROUNDED_PILL_STROKE_WIDTH
): string {
  if (width <= 0 || height <= 0) return '';

  const halfStroke = strokeWidth / 2;
  const r = roundedPillRadius(width, height);
  const w = width;
  const h = height;

  return `M ${r + halfStroke},${halfStroke} 
       L ${w - r - halfStroke},${halfStroke} 
       A ${r} ${r} 0 0 1 ${w - halfStroke},${r + halfStroke} 
       L ${w - halfStroke},${h - r - halfStroke} 
       A ${r} ${r} 0 0 1 ${w - r - halfStroke},${h - halfStroke} 
       L ${r + halfStroke},${h - halfStroke} 
       A ${r} ${r} 0 0 1 ${halfStroke},${h - r - halfStroke} 
       L ${halfStroke},${r + halfStroke} 
       A ${r} ${r} 0 0 1 ${r + halfStroke},${halfStroke} Z`;
}
