'use client';

import { useEffect, useState, useRef } from 'react';

interface UseScrollPositionReturn {
  scrollY: number;
  isAtTop: boolean;
  isAtBottom: boolean;
  isScrollingUp: boolean;
  isScrollingDown: boolean;
}

export function useScrollPosition(): UseScrollPositionReturn {
  const [scrollY, setScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      setScrollY(currentScrollY);
      setIsAtTop(currentScrollY <= 10);
      setIsAtBottom(currentScrollY >= maxScroll - 10);
      
      const scrollingUp = currentScrollY < lastScrollY.current;
      const scrollingDown = currentScrollY > lastScrollY.current;
      
      if (scrollingUp) {
        setIsScrollingUp(true);
        setIsScrollingDown(false);
      } else if (scrollingDown) {
        setIsScrollingDown(true);
        setIsScrollingUp(false);
      }
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrollingUp(false);
        setIsScrollingDown(false);
      }, 2000);
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollY,
    isAtTop,
    isAtBottom,
    isScrollingUp,
    isScrollingDown,
  };
}

