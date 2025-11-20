'use client';
import { useLinkStatus } from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Logo from './logo';

const GRID_COLS = 10;
const GRID_ROWS = 10;

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const { pending } = useLinkStatus();
  const [initialLoad, setInitialLoad] = useState(true);

  const fadeOut = () => {
    if (!loaderRef.current) return;
    const squares = loaderRef.current.querySelectorAll('.square');
    const logo = loaderRef.current.querySelector('.logo');
    const contentElements = document.querySelectorAll('[data-content]');

    gsap.fromTo(logo, {
      opacity: 1,
    }, {
      opacity: 0,
      duration: 0.05,
      ease: 'power2.inOut',
    });

    gsap.to(squares, {
      duration: 0.2,
      opacity: 0,
      ease: 'sine',
      stagger: {
        grid: [GRID_ROWS, GRID_COLS],
        from: 'end',
        amount: 0.5,
      },
      onComplete: () => {
        gsap.to(contentElements, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.6,
          delay: 0.3,
          onComplete: () => {
            if (loaderRef.current) loaderRef.current.style.display = 'none';
          },
        });
      },
    });
  };

  useGSAP(() => {
    if (initialLoad) {
      gsap.delayedCall(1, () => {
        fadeOut();
        setInitialLoad(false);
      });
    }
  }, [initialLoad]);

  useEffect(() => {
    if (!pending && !initialLoad) {
      fadeOut();
    } else if (pending && loaderRef.current) {
      loaderRef.current.style.display = 'block';
      gsap.set(loaderRef.current, { opacity: 1 });
      gsap.to(loaderRef.current.querySelectorAll('.square'), {
        opacity: 1,
        duration: 0.1,
        stagger: 0.01,
      });
    }
  }, [pending]);

  const squares = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => (
    <div key={i} className='square w-full h-full bg-black' />
  ));

  return (
    <div ref={loaderRef} className='fixed inset-0 z-[9999]'>
      <div className='grid grid-cols-10 h-full w-full -scale-x-100'>
        {squares}
      </div>
      <Logo
        color='white'
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[80px] animate-pulse logo'
      />
    </div>
  );
}
