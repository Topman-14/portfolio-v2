'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Logo from '../ui/logo';
import { navItems, socials } from '@/config';
import NavOverlay from './nav-overlay';
import { useIsMobile } from '@/hooks/use-mobile';
import RollingText from '../animations/rolling-text';
import SocialIcons from '../ui/social-icon';
import DomAnimate from '../animations/dom-animate';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showFullNavbar = !isScrolled && !isMobile;

  return (
    <>
      <nav className='fixed w-full top-0 z-[100] '>
        <div
          className={`flex gap-3 items-center justify-between px-3 md:px-5 py-4 font-sans text-white ${
            showFullNavbar ? 'justify-between' : 'justify-end'
          }`}
        >
          {showFullNavbar && <Logo link color='white' height={32} width={32} />}
          {/* <Logo link color='white' variant="full" height={40} width={120} /> */}

          <DomAnimate show={showFullNavbar}>
            <div className='hidden md:flex gap-8 items-center backdrop-blur-lg bg-white/10 rounded-full p-3 px-6 '>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className='relative overflow-hidden'
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <RollingText className='text-white '>{item.name}</RollingText>
                </Link>
              ))}
            </div>
          </DomAnimate>
          
          <DomAnimate show={showFullNavbar}>
            <div className='hidden md:flex gap-3 items-center'>
              {socials.map((social) => (
                <SocialIcons
                  key={social.href}
                  link={social.href}
                  name={social.name}
                />
              ))}
            </div>
          </DomAnimate>

          <DomAnimate show={!showFullNavbar}>
            <button
              onClick={() => setIsOpen(true)}
              className='rounded-full size-12 flex items-center justify-center transition-colors bg-white/10 backdrop-blur-md border border-transparent hover:border-malachite cursor-pointer'
              aria-label='Open menu'
            >
              <Logo color='white' height={20} width={20} />
            </button>
          </DomAnimate>
        </div>
      </nav>
      <NavOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
