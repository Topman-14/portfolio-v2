'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from '../../../../components/ui/logo';
import { navItems, socials } from '@/lib/constants';
import NavOverlay from './nav-overlay';
import { useViewport } from '@/hooks/use-viewport';
import RollingText from '../../../../components/animations/rolling-text';
import SocialIcons from '../../../../components/ui/social-icon';
import DomAnimate from '../../../../components/animations/dom-animate';
import CircleButton from '../../../../components/ui/circle-button';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isMobile } = useViewport();
  const pathname = usePathname();

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
          className={`flex gap-3 items-center justify-between px-3 md:px-5 py-4 font-sans text-white ${showFullNavbar ? 'justify-between' : 'justify-end'
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
                  className='relative overflow-hidden leading-[normal]'
                >
                  <RollingText className={`${pathname.replaceAll('/', '') === item.href.replaceAll('/', '') ? 'text-malachite' : 'text-white'}`}>{item.name}</RollingText>
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
