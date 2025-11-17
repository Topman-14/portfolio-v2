'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from '../ui/logo';
import { navItems, socials } from '@/config';
import NavOverlay from './nav-overlay';
import { useWindowSize } from '@/hooks/use-window-size';
import RollingText from '../animations/rolling-text';
import SocialIcons from '../ui/social-icon';
import DomAnimate from '../animations/dom-animate';
import CircleButton from '../ui/circle-button';
import { Menu } from 'lucide-react';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isMobile } = useWindowSize();

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
              {navItems.filter((item) => item.name !== 'Home').map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className='relative overflow-hidden'
                >
                  <RollingText className='text-white '>{item.name}</RollingText>
                </Link>
              ))}
            </div>
          </DomAnimate>
          
          <DomAnimate show={showFullNavbar}>
            <div className='hidden md:flex gap-3 items-center'>
              {socials.filter((social) => social.name !== 'Email').map((social) => (
                <SocialIcons
                  key={social.href}
                  link={social.href}
                  name={social.name}
                />
              ))}
            </div>
          </DomAnimate>

          <DomAnimate show={!showFullNavbar}>
            <CircleButton
              onClick={() => setIsOpen(true)}
              size={isMobile ? 48 : 62}
            >
              {/* <Logo color='white' height={20} width={20} className='relative z-10' /> */}
              <HiOutlineMenuAlt3 size={isMobile ? 20 : 24} className='relative z-10 text-malachite' />
            </CircleButton>
          </DomAnimate>
        </div>
      </nav>
      <NavOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
