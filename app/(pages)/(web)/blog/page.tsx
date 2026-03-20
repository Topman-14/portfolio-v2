import type { Metadata } from 'next';
import { Suspense } from 'react';
import prismadb from '@/lib/prismadb';
import { BASE_URL } from '@/config';
import { RevealHeader } from '@/components/custom/reveal-header';
import NewsletterForm from '@/app/(pages)/(web)/components/newsletter-form';
import { BlogHero } from './components/blog-hero';
import { BlogBrowseSection } from './components/browse-blogs';
import { BlogSearch } from './components/blog-search';
import { LoadingFallback } from '@/components/ui/suspense';

export default async function Blog() {
  const [heroArticles, popularArticles, categories, allArticles] = await Promise.all([
    prismadb.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
      take: 4,
    }),
    prismadb.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ reads: 'desc' }, { publishedAt: 'desc' }],
      include: { category: true },
      take: 4,
    }),
    prismadb.category.findMany({
      orderBy: { name: 'asc' },
      take: 6,
    }),
    prismadb.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
      take: 16,
    }),
  ]);

  const fallbackPopular = heroArticles.filter(
    (article) => !popularArticles.some((popular) => popular.id === article.id)
  );
  const mergedPopular = [...popularArticles, ...fallbackPopular].slice(0, 4);

  const categoryChips = categories.map((c) => ({ id: c.id, name: c.name }));

  return (
      <main className='bg2 min-h-screen py-28 px-4 md:px-8 lg:px-16'>
        <div className='max-w-wide mx-auto space-y-18'>
          <section className='space-y-8'>
            <RevealHeader
              title='Stories, opinions, and engineering insights'
              subtitle='Transform how you design and build for the web.'
              className='max-w-6xl md:mt-16'
              subtitleClassName='mt-5'
            />

            <BlogSearch categories={categoryChips} />

            {heroArticles.length > 0 ? (
              <BlogHero articles={heroArticles} title='Latest articles' className='md:mt-16'/>
            ) : (
              <div className='rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60 font-sans'>
                No published articles yet.
              </div>
            )}
          </section>

          {mergedPopular.length > 0 ? (
            <section className='md:py-20'>
              <BlogHero articles={mergedPopular} title='Popular' reverse />
            </section>
          ) : null}

          <section className='rounded-2xl border border-white/10 bg-[linear-gradient(120deg,rgba(255,255,255,0.04),rgba(114,255,168,0.07),rgba(255,177,87,0.06))] p-6 md:p-8 lg:p-10'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center'>
              <div>
                <h3 className='text-2xl md:text-3xl font-display font-bold text-white'>
                  Join my Newsletter!
                </h3>
                <p className='text-white/70 font-sans mt-2'>
                  Subscribe for practical engineering notes, product essays, and new article updates.
                </p>
              </div>
              <NewsletterForm source='blog-page' />
            </div>
          </section>

          <Suspense fallback={<LoadingFallback />}>
            <BlogBrowseSection
              initialBrowseArticles={allArticles}
              categories={categoryChips}
            />
          </Suspense>
        </div>
      </main>
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
