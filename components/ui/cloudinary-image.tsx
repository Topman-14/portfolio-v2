'use client';

import Image, { type ImageProps } from 'next/image';
import cloudinaryLoader from '@/lib/cloudinary-loader';

export default function CloudinaryImage(props: ImageProps) {
  return <Image {...props} loader={cloudinaryLoader} />;
}
