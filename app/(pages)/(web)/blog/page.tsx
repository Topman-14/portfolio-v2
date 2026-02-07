import type { Metadata } from 'next';
import prismadb from '@/lib/prismadb';
import { BASE_URL } from '@/lib/constants';
import { BlogHero } from './components/blog-hero';



export default async function Blog() {
  const latestArticles = await prismadb.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 5,
    include: { category: true },
  });

  return (
    <section className="bg2 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
          <div className="text-center space-y-4 pt-30">
            <h1 className="h2">Blog</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
              Thoughts, tutorials, and insights about web development and technology
            </p>
          </div>
            <BlogHero articles={latestArticles} />
      </div>
      <div className="min-h-screen"/>
      <div className="min-h-screen"/>
    </section>
  );
}

export const metadata: Metadata = {
  title: 'Blog | Tope Akinkuade',
  description:
    'Thoughts, tutorials, and insights about web development, software engineering, and technology.',
  keywords: [
    'Tope Akinkuade',
    'Blog',
    'Web Development',
    'Software Engineering',
    'Technical Writing',
    'Tutorials',
  ],
  openGraph: {
    title: 'Blog | Tope Akinkuade',
    description:
      'Thoughts, tutorials, and insights about web development, software engineering, and technology.',
    url: `${BASE_URL}/blog`,
    siteName: 'Tope Akinkuade',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Tope Akinkuade - Blog',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Tope Akinkuade',
    description:
      'Thoughts, tutorials, and insights about web development, software engineering, and technology.',
    images: [`${BASE_URL}/og-image.png`],
  },
};