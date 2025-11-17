'use client';

import { useEffect, useRef, useState } from 'react';
import { MAIN_EMAIL, navItems, REPO_URL, socials } from '@/config';
import Link from 'next/link';
import { ArrowUpRight, Check, Copy, SquareArrowOutUpRight, Star, X } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import RollingText from '../animations/rolling-text';
import SocialIcons from '../ui/social-icon';
import { GoDash } from 'react-icons/go';
import { usePathname } from 'next/navigation';

interface NavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavOverlay({ isOpen, onClose }: NavOverlayProps) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(isOpen);
  const [mailCopied, setMailCopied] = useState(false);

  useEffect(() => {
    if (mailCopied) {
      setTimeout(() => {
        setMailCopied(false);
      }, 2000);
    }
  }, [mailCopied]);

  useEffect(() => {
    if (isOpen) setVisible(true);
  }, [isOpen]);

  useGSAP(() => {
    if (!overlayRef.current) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    } else {
      document.body.style.overflow = '';
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setVisible(false),
      });
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className='fixed inset-0 z-[9999] bg-[#00000061] flex items-center justify-center backdrop-blur-lg'
    >
      <div className='relative z-10 w-full h-full px-6 md:px-12 flex flex-col items-center justify-center'>
        <button
          onClick={onClose}
          className='p-2 bg-[#00000017] hover:bg-[#00000030] rounded-full transition-colors absolute top-6 right-6 cursor-pointer'
          aria-label='Close menu'
        >
          <X size={32} className='text-malachite' />
        </button>

        <nav className='flex md:flex-row flex-col gap-12 lg:gap-16 mt-16 md:mt-24 md:justify-between w-full max-w-7xl'>
          <div className='flex flex-col gap-4 md:gap-6 lg:gap-10'>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className='text-5xl md:text-6xl lg:text-8xl  font-semibold hover:text-malachite/70 transition-colors w-fit flex items-center gap-2 font-display group'
                >
                  <GoDash
                    className={`${
                      isActive ? 'text-malachite' : 'text-white/60 group-hover:text-white'
                    } mb-2 w-[50px] transition-colors`}
                  />
                  <RollingText className='text-white'>{item.name}</RollingText>
                </Link>
              );
            })}
          </div>

          <div className='hidden md:flex gap-8 flex-col'>
            <div className='flex flex-col gap-2'>
              <span className='text-white/50 text-xs font-sans uppercase tracking-wider'>
                Email
              </span>
              <div className='flex gap-3 items-center text-white text-lg font-sans'>
                <span className='text-white/90'>{MAIN_EMAIL}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(MAIN_EMAIL);
                    setMailCopied(true);
                  }}
                  className='hover:text-malachite transition-colors p-1.5 hover:bg-white/5 rounded cursor-pointer'
                  aria-label='Copy email'
                >
                  {mailCopied ? <Check size={18} /> : <Copy size={18} />}
                </button>
                <Link
                  href={`mailto:${MAIN_EMAIL}`}
                  className='hover:text-malachite transition-colors p-1.5 hover:bg-white/5 rounded'
                  aria-label='Send email'
                >
                  <SquareArrowOutUpRight size={16} />
                </Link>
              </div>
            </div>
            
            <div className='space-y-4'>
              <h2 className='text-white/50 text-xs font-sans uppercase tracking-wider'>
                Follow Mee
              </h2>
              <div className='flex flex-col gap-6'>
                {socials.filter((social) => social.name !== 'Email').map((social) => (
                  <Link
                    key={social.href}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group flex items-center gap-3 text-white hover:text-malachite transition-colors'
                  >
                    <GoDash className='text-white/40 group-hover:text-malachite transition-colors w-6' />
                    <RollingText className='text-lg lg:text-xl font-sans'>
                      {social.name}
                    </RollingText>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className='flex md:hidden gap-3 mt-8 items-center justify-center'>
            {socials.map((social) => (
              <SocialIcons
                key={social.href}
                link={social.href}
                name={social.name}
              />
            ))}
          </div>
        </nav>

        <div className='flex flex-col md:items-end items-center gap-2 md:ml-auto md:mr-5 md:-mt-10 mt-8'>
          <Link
            href={REPO_URL}
            target='_blank'
            className='group flex items-center gap-2 text-white hover:text-malachite transition-colors text-sm md:text-base font-sans'
          >
            <Star size={16} className='group-hover:fill-malachite transition-colors' />
            <span>Star this repo on GitHub!</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
