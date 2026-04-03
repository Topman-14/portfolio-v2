import type { Metadata } from 'next';
import type { Experience } from '@prisma/client';
import prismadb from '@/lib/prismadb';
import { BASE_URL } from '@/config';
import { WorksHero } from '@/app/(pages)/(web)/work/components/works-hero';
import { WorksBentoGrid } from '@/app/(pages)/(web)/work/components/featured-works';
import {
  ExperienceSection,
  type ExperienceListItem,
} from '@/app/(pages)/(web)/work/components/experience-section';

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
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work | Tope Akinkuade',
    description:
      'A collection of projects I\'ve built — from internal dashboards to public-facing apps.',
  },
};

function serializeExperiences(rows: Experience[]): ExperienceListItem[] {
  return rows.map((e) => ({
    id: e.id,
    jobTitle: e.jobTitle,
    company: e.company,
    location: e.location,
    description: e.description,
    startDate: e.startDate.toISOString(),
    endDate: e.endDate?.toISOString() ?? null,
    isCurrentRole: e.isCurrentRole,
    skills: e.skills,
    achievements: e.achievements,
  }));
}

export default async function WorkPage() {
  const [featuredWorks, otherWorks, experienceRows] = await Promise.all([
    prismadb.work.findMany({
      where: {
        featured: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prismadb.work.findMany({
      where: {
        featured: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 48,
    }),
    prismadb.experience.findMany({
      orderBy: [{ isCurrentRole: 'desc' }, { startDate: 'desc' }],
    }),
  ]);

  const experiences = serializeExperiences(experienceRows);

  return (
    <main className='bg1'>
      <WorksHero />
      <WorksBentoGrid works={featuredWorks} otherWorks={otherWorks} />
      <ExperienceSection experiences={experiences} />
    </main>
  );
}
