'use client';

import { Check, Copy } from 'lucide-react';
import Link from 'next/link';
import {
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from 'react-icons/fa6';
import { useCopy } from '@/hooks/use-copy';

type BlogPostShareProps = {
  articleUrl: string;
  title: string;
};

export function BlogPostShare({ articleUrl, title }: BlogPostShareProps) {
  const { isCopied: copied, copy } = useCopy();

  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title);
  const whatsappText = encodeURIComponent(`${title}\n${articleUrl}`);

  const shareLinks = [
    {
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      Icon: FaXTwitter,
    },
    {
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: FaLinkedinIn,
    },
    {
      label: 'Share on WhatsApp',
      href: `https://wa.me/?text=${whatsappText}`,
      Icon: FaWhatsapp,
    },
  ];

  const btnClass =
    'inline-flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/80 hover:text-malachite hover:border-malachite/40 transition-colors';

  return (
    <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
      <p className='text-xs uppercase tracking-wide text-white/55 font-sans'>
        Share Via
      </p>
      <div className='flex flex-wrap gap-2 mt-3'>
        {shareLinks.map(({ label, href, Icon }) => (
          <Link
            key={label}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className={btnClass}
            aria-label={label}
          >
            <Icon className='size-4' />
          </Link>
        ))}
        <button
          type='button'
          onClick={() => void copy(articleUrl)}
          className={btnClass}
          aria-label={copied ? 'Link copied' : 'Copy link'}
        >
          {copied ? (
            <Check className='size-4 text-malachite' strokeWidth={2.5} />
          ) : (
            <Copy className='size-4' />
          )}
        </button>
      </div>
    </div>
  );
}
