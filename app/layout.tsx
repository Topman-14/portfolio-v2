import type { Metadata } from 'next';
import './globals.css';
import { BASE_URL } from '@/lib/constants';
import Providers from '@/context';
import { bricolageGrotesque, kronaOne, syne } from '@/assets/fonts';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${bricolageGrotesque.variable} ${kronaOne.variable} ${syne.variable} antialiased h-full`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}


export const metadata: Metadata = {
  title: 'Tope Akinkuade | Software Engineer',
  description:
    'I’m Tope — a software engineer building clean, scalable apps with TypeScript & Node.js. Perfectionist at heart, always shipping with style.',
  keywords: [
    'Tope Akinkuade',
    'Tope',
    'React',
    'Software Engineer',
    'TypeScript',
    'Node.js',
    'Next.js',
    'Fullstack Developer',
    'Software Developer',
    'Portfolio',
  ],
  authors: [{ name: 'Tope Akinkuade', url: BASE_URL }],
  openGraph: {
    title: 'Tope Akinkuade | Software Engineer',
    description:
      'I’m Tope — a software engineer building clean, scalable apps with TypeScript & Node.js. Perfectionist at heart, always shipping with style.',
    url: BASE_URL,
    siteName: 'Tope Akinkuade',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Tope Akinkuade Portfolio',
      },
    ],
    locale: 'en_NG',
    alternateLocale: ['en_US', 'en_GB'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tope Akinkuade | Software Engineer',
    description:
      'I’m Tope — a software engineer building clean, scalable apps with TypeScript & Node.js. Perfectionist at heart, always shipping with style.',
    images: [`${BASE_URL}/og-image.png`],
    creator: '@topeakinkuade',
  },
  metadataBase: new URL(BASE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  category: 'Portfolio',
  manifest: '/manifest.json',
  icons: {
    icon: '/img/png/icon.png',
    apple: '/img/png/icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tope Portfolio',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#14cc5e',
    'theme-color': '#14cc5e',
  },
};
