'use client';

import { useEffect, useRef, useState } from 'react';
import Logo from '../ui/logo';
import { navItems, socials } from '@/config';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
interface NavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavOverlay({ isOpen, onClose }: NavOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(isOpen);

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
      <div className='relative z-10 w-full max-w-6xl px-6'>
        <div className='flex justify-end mb-12'>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
            aria-label='Close menu'
          >
            <X size={32} />
          </button>
        </div>

        <nav className='flex flex-col gap-8'>
          <div className='mb-8'>
            <Logo link color='black' />
          </div>

          <div className='flex flex-col gap-4'>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className='text-4xl md:text-5xl font-semibold hover:text-gray-500 transition-colors'
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className='flex gap-6 mt-8'>
            {socials.map((social) => (
              <Link
                key={social.href}
                href={social.href}
                target='_blank'
                rel='noopener noreferrer'
                className='text-lg hover:text-gray-500 transition-colors'
              >
                {social.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
