import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { BASE_URL } from '@/lib/constants';
import { WorkDetail } from '@/components/web/work/work-detail';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const work = await prismadb.work.findUnique({
    where: { id },
  });

  if (!work) {
    return {
      title: 'Work Not Found | Tope Akinkuade',
    };
  }

  return {
    title: `${work.title} | Tope Akinkuade`,
    description: work.description,
    keywords: [
      work.title,
      ...work.tools,
      work.category || '',
      'Tope Akinkuade',
      'Portfolio',
      'Project',
    ].filter(Boolean),
    openGraph: {
      title: `${work.title} | Tope Akinkuade`,
      description: work.description,
      url: `${BASE_URL}/work/${id}`,
      siteName: 'Tope Akinkuade',
      images: work.image
        ? [
            {
              url: work.image,
              width: 1200,
              height: 630,
              alt: work.title,
            },
          ]
        : [
            {
              url: `${BASE_URL}/og-image.png`,
              width: 1200,
              height: 630,
              alt: work.title,
            },
          ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${work.title} | Tope Akinkuade`,
      description: work.description,
      images: work.image ? [work.image] : [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { id } = await params;
  const work = await prismadb.work.findUnique({
    where: { id },
  });

  if (!work) {
    notFound();
  }

  return <WorkDetail work={work} />;
}

