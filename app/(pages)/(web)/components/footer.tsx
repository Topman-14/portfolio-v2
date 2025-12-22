import Link from 'next/link';
import { Star } from 'lucide-react';
import RollingText from '@/components/animations/rolling-text';
import SocialIcons from '@/components/ui/social-icon';
import { navItems, REPO_URL, socials } from '@/lib/constants';
import NewsletterForm from '@/app/(pages)/(web)/components/newsletter-form';
import ScrollToTopButton from '@/app/(pages)/(web)/components/scroll-to-top-button';

export default function Footer() {

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

          <div className='lg:col-span-2 space-y-4'>
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
                  <RollingText className='text-white/70 hover:text-white text-sm transition-colors'>
                    {item.name}
                  </RollingText>
                </Link>
              ))}
            </nav>
          </div>

          <div className='lg:col-span-5 space-y-4'>
            <h4 className='text-lg font-display font-bold text-white mb-4'>
              Stay Updated
            </h4>
            <p className='text-white/70 text-sm font-sans'>
              Get notified about new articles, projects, and updates.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className='mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-white/50 text-sm font-sans'>
            By Tope Akinkuade | {new Date().getFullYear()}
          </p>
          <div className='flex gap-6 text-sm font-sans'>
            <Link
              href={REPO_URL}
              target='_blank'
              className='group flex items-center gap-2 text-white/50 hover:text-malachite transition-colors text-sm md:text-base font-sans'
            >
              <Star
                size={16}
                className='group-hover:fill-malachite transition-colors'
              />
              <span>Star this repo on GitHub!</span>
            </Link>
          </div>
        </div>
      </div>

      <ScrollToTopButton />
    </footer>
  );
}
