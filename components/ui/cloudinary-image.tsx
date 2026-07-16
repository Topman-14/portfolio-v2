'use client';

import Image, { type ImageProps } from 'next/image';
import cloudinaryLoader from '@/lib/cloudinary-loader';

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#222" offset="20%" />
      <stop stop-color="#333" offset="50%" />
      <stop stop-color="#222" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#222" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

const SHIMMER_DATA_URL = `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`;

export default function CloudinaryImage(props: ImageProps) {
  return (
    <Image
      placeholder="blur"
      blurDataURL={SHIMMER_DATA_URL}
      {...props}
      loader={cloudinaryLoader}
    />
  );
}
