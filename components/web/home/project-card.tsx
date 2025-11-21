"use client"
import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Work } from '@prisma/client';

export const ProjectCard = ({
    work,
    index=0,
    isMarquee=false,
  }: {
    work: Work;
    index?: number;
    isMarquee?: boolean;
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLAnchorElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
  
  useGSAP(
    () => {
      if (!imageRef.current || !cardRef.current) return;

      gsap.set(imageRef.current, { 
        willChange: isHovered ? 'transform' : 'auto',
        force3D: true,
      });

      const tl = gsap.timeline({ paused: true });

      tl.to(imageRef.current, {
        scale: 1.1,
        duration: 0.4,
        ease: 'power2.out',
        force3D: true,
      });

      if (isHovered) {
        tl.play();
      } else {
        tl.reverse();
      }
    },
    { dependencies: [isHovered], scope: cardRef }
  );
  
    const getCardWidth = (index: number) => {
      const widths = ['w-[350px]', 'w-[450px]', 'w-[400px]', 'w-[380px]', 'w-[420px]'];
      return widths[index % widths.length];
    };
  
    return (
      <Link
        href={`/work/${work.id}`}
        ref={cardRef}
        className={`relative flex-shrink-0 rounded-3xl overflow-hidden ${getCardWidth(
          index
        )} h-[300px] group cursor-pointer block ${isMarquee ? 'mx-3' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={imageRef}
          className='absolute inset-0'
        >
          {work.image? (
            <Image
              src={work.image}
              alt={work.title}
              fill
              className='object-cover'
            />
          ) : (
            <div className='absolute inset-0 bg-gradient-to-br from-malachite/30 via-amber/20 to-bittersweet/30' />
          )}
        </div>
  
        <div
          className={`absolute inset-0 bg-gradient-to-t from-coal/95 via-coal/60 to-transparent transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-70'
          }`}
        />
  
        <div className='absolute inset-0 border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] group-hover:border-malachite/50 transition-all duration-300' />
  
        <div
          className={`absolute inset-0 p-6 flex flex-col justify-end transition-all duration-500 ${
            isHovered ? 'gap-3' : 'gap-0'
          }`}
        >
          <h3 className='text-xl md:text-2xl font-display font-bold text-white'>
            {work.title}
          </h3>
  
          <p
            className={`text-white/80 text-sm leading-relaxed font-sans transition-all duration-500 overflow-hidden ${
              isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {work.description}
          </p>
  
          <div
            className={`flex flex-wrap gap-2 transition-all duration-500 ${
              isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {work.tools.slice(0, 3).map((tool) => (
              <Badge key={tool} variant='white' className='text-[10px] px-2 py-0.5'>
                {tool}
              </Badge>
            ))}
            {work.tools.length > 3 && (
              <Badge variant='white' className='text-[10px] px-2 py-0.5'>
                +{work.tools.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    );
  };
  