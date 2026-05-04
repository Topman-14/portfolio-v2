'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Logo from './logo';

const GRID_COLS = 10;
const GRID_ROWS = 10;

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showLoader = () => {
    if (!loaderRef.current || !logoWrapRef.current) return;
    gsap.killTweensOf([loaderRef.current, logoWrapRef.current, loaderRef.current.querySelectorAll('.square')]);
    loaderRef.current.style.display = 'block';
    gsap.set(loaderRef.current, { opacity: 1 });
    gsap.set(logoWrapRef.current, { opacity: 1, scale: 1 });
    gsap.to(loaderRef.current.querySelectorAll('.square'), {
      opacity: 1,
      duration: 0.1,
      stagger: 0.01,
    });
  };

  const fadeOut = () => {
    if (!loaderRef.current || !logoWrapRef.current) return;
    const squares = loaderRef.current.querySelectorAll('.square');
    const contentElements = document.querySelectorAll('[data-content]');

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(contentElements, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
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

    tl.to(logoWrapRef.current, { opacity: 0, scale: 0.92, duration: 0.28, ease: 'power2.in' }).to(
      squares,
      {
        duration: 0.2,
        opacity: 0,
        ease: 'sine',
        stagger: { grid: [GRID_ROWS, GRID_COLS], from: 'end', amount: 0.5 },
      },
      0.12
    );
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
    const toAbsolute = (url: string) => new URL(url, window.location.href).href;

    const isSameOrigin = (url: string) =>
      new URL(toAbsolute(url)).hostname.replace(/^www\./, '') ===
      new URL(window.location.href).hostname.replace(/^www\./, '');

    const isHashChange = (url: string) =>
      new URL(toAbsolute(url)).href.split('#')[0] ===
      new URL(window.location.href).href.split('#')[0];

    const handleClick = (e: MouseEvent) => {
      try {
        let el = e.target as HTMLElement | null;
        while (el && el.tagName.toLowerCase() !== 'a') el = el.parentElement;
        const anchor = el as HTMLAnchorElement | null;
        if (!anchor?.href) return;

        const { href } = anchor;
        if (
          !isSameOrigin(href) ||
          anchor.target === '_blank' ||
          ['tel:', 'mailto:', 'sms:', 'blob:', 'download:'].some(p => href.startsWith(p)) ||
          e.ctrlKey || e.metaKey || e.shiftKey || e.altKey ||
          href === window.location.href ||
          isHashChange(href)
        ) return;

        showLoader();
      } catch (_) {}
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('popstate', showLoader);
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('popstate', showLoader);
    };
  }, []);

  useEffect(() => {
    if (!initialLoad) fadeOut();
  }, [pathname, searchParams]);

  const squares = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => (
    <div key={i} className='square w-full h-full bg-black' />
  ));

  return (
    <div ref={loaderRef} className='fixed inset-0 z-[9999]'>
      <div className='grid grid-cols-10 h-full w-full -scale-x-100'>
        {squares}
      </div>
      <div
        ref={logoWrapRef}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'
      >
        <Logo color='white' className='size-[80px]' />
      </div>
    </div>
  );
}
