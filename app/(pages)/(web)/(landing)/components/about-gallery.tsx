'use client';

import { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { cn } from '@/lib/utils';

type GalleryImage = {
  src: StaticImageData;
  alt: string;
  colSpan: string;
};

function GalleryImage({ image, priority }: { image: GalleryImage; priority: boolean }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      placeholder="blur"
      className={cn('object-cover transition-opacity duration-700', loaded ? 'opacity-100' : 'opacity-0')}
      priority={priority}
      onLoad={() => setLoaded(true)}
      sizes="(max-width: 768px) 50vw, 33vw"
    />
  );
}

export function AboutGallery({ images }: { images: GalleryImage[] }) {
  return (
    <div className="relative flex-1 md:flex-none grid mt-12 grid-cols-3 md:grid-cols-6 grid-rows-2 ml-auto my-auto gap-4 w-full">
      {images.map((image, index) => (
        <div
          key={`about-gallery-${index}`}
          className={`${image.colSpan} lg:max-w-[600px] relative h-[200px] overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]`}
        >
          <GalleryImage image={image} priority={index < 2} />
        </div>
      ))}
    </div>
  );
}
