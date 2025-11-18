import type { Metadata } from 'next';
import { BASE_URL } from '@/lib/constants';
import { AboutContent } from '@/components/web/about/about-content';

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
  return <AboutContent />;
}
