import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { BASE_URL } from '@/lib/constants';
import { WorksGrid } from '@/components/web/work/works-grid';
import { WorksHero } from '@/components/web/work/works-hero';

export const metadata: Metadata = {
  title: 'Work | Tope Akinkuade',
  description:
    'A collection of projects I\'ve built — from internal dashboards to public-facing apps. Explore my work across web development, mobile apps, and cloud infrastructure.',
  keywords: [
    'Tope Akinkuade',
    'Portfolio',
    'Projects',
    'Web Development',
    'Software Engineering',
    'Work Samples',
  ],
  openGraph: {
    title: 'Work | Tope Akinkuade',
    description:
      'A collection of projects I\'ve built — from internal dashboards to public-facing apps.',
    url: `${BASE_URL}/work`,
    siteName: 'Tope Akinkuade',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Tope Akinkuade - Work',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work | Tope Akinkuade',
    description:
      'A collection of projects I\'ve built — from internal dashboards to public-facing apps.',
    images: [`${BASE_URL}/og-image.png`],
  },
};

export default async function WorkPage() {
  const works = await prismadb.work.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!works) {
    notFound();
  }

  return (
    <main>
      <WorksHero />
      <WorksGrid works={works} />
    </main>
  );
}
