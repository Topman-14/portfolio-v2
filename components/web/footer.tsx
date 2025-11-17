'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronUp, Send } from 'lucide-react';
import RollingText from '../animations/rolling-text';
import SocialIcons from '../ui/social-icon';
import { navItems, socials } from '@/config';
import CircleButton from '../ui/circle-button';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { cn } from '@/lib/utils';
import GInput from '../ui/ginput';
import { GButton } from '../ui/gbutton';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isScrollingUp, isAtBottom } = useScrollPosition();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setEmail('');
    setIsSubmitting(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showScrollButton = isScrollingUp || isAtBottom;

  return (
    <footer className='relative bg-coal border-t border-white/10'>
      <div className='max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-20'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16'>
          <div className='lg:col-span-5 space-y-6'>
            <h3 className='text-2xl md:text-3xl font-display font-bold text-white'>
              Let&apos;s build something great.
            </h3>
            <p className='text-white/70 text-base leading-relaxed font-sans max-w-md'>
              I&apos;m always interested in hearing about new projects and
              opportunities. Whether you have a question or just want to say hi,
              I&apos;ll try my best to get back to you.
            </p>
            <div className='flex gap-3'>
              {socials.map((social) => (
                <SocialIcons
                  key={social.href}
                  link={social.href}
                  name={social.name}
                />
              ))}
            </div>
          </div>

          <div className='lg:col-span-3 space-y-4'>
            <h4 className='text-lg font-display font-bold text-white mb-4'>
              Quick Links
            </h4>
            <nav className='flex flex-col gap-2'>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className='relative overflow-hidden w-fit'
                >
                  <RollingText className='text-white/70 hover:text-white transition-colors'>
                    {item.name}
                  </RollingText>
                </Link>
              ))}
            </nav>
          </div>

          <div className='lg:col-span-4 space-y-4'>
            <h4 className='text-lg font-display font-bold text-white mb-4'>
              Stay Updated
            </h4>
            <p className='text-white/70 text-sm font-sans'>
              Get notified about new articles, projects, and updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className='space-y-3'>
              <GInput
                type='email'
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder='Enter your email'
                required
              />
              <GButton
                type='submit'
                variant='green'
                disabled={isSubmitting}
                className='w-full'
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                <Send className='w-4 h-4' />
              </GButton>
            </form>
          </div>
        </div>

        <div className='mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-white/50 text-sm font-sans'>
            © {new Date().getFullYear()} Tope Akinkuade. All rights reserved.
          </p>
          <div className='flex gap-6 text-sm font-sans'>
            <Link
              href='/privacy'
              className='text-white/50 hover:text-white transition-colors'
            >
              Privacy
            </Link>
            <Link
              href='/terms'
              className='text-white/50 hover:text-white transition-colors'
            >
              Terms
            </Link>
          </div>
        </div>
      </div>

      <CircleButton
        onClick={scrollToTop}
        className={cn(
          'fixed bottom-8 right-8 z-50 transition-opacity duration-300',
          showScrollButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        size={48}
        aria-label='Back to top'
      >
        <ChevronUp style={{ fill: 'transparent' }} />
      </CircleButton>
    </footer>
  );
}
