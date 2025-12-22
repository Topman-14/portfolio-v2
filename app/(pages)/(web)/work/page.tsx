import type { Metadata } from 'next';
import prismadb from '@/lib/prismadb';
import { BASE_URL } from '@/lib/constants';
import { WorksHero } from '@/app/(pages)/(web)/work/components/works-hero';
import { WorksBentoGrid } from '@/app/(pages)/(web)/work/components/featured-works';
import { ExperienceSection } from '@/app/(pages)/(web)/work/components/experience-section';

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
  const featuredWorks = await prismadb.work.findMany({
    where: {
      featured: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main>
      <WorksHero />
      <WorksBentoGrid works={featuredWorks} />
      <ExperienceSection />
    </main>
  );
}
