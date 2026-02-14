import type { Metadata } from 'next';
import { BASE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About | Tope Akinkuade',
  description:
    'I\'m a software engineer who\'s spent the last few years building products across logistics, fintech, and business infrastructure. My focus is on clarity, performance, and systems that scale without unnecessary complexity.',
  keywords: [
    'Tope Akinkuade',
    'About',
    'Software Engineer',
    'Full Stack Developer',
    'Product Engineer',
    'Portfolio',
  ],
  openGraph: {
    title: 'About | Tope Akinkuade',
    description:
      'I\'m a software engineer who\'s spent the last few years building products across logistics, fintech, and business infrastructure.',
    url: `${BASE_URL}/about`,
    siteName: 'Tope Akinkuade',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Tope Akinkuade - About',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Tope Akinkuade',
    description:
      'I\'m a software engineer who\'s spent the last few years building products across logistics, fintech, and business infrastructure.',
    images: [`${BASE_URL}/og-image.png`],
  },
};

export default function AboutPage() {
  return (
    <main className='bg1'>
      <section className='relative min-h-screen py-32 px-4 md:px-8 lg:px-16'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='generic-h2'>About</h1>
        </div>
      </section>
    </main>
  );
}
