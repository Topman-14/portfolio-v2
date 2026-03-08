import type { Metadata } from 'next';
import prismadb from '@/lib/prismadb';
import { BASE_URL } from '@/lib/constants';
import { RevealHeader } from '@/components/custom/reveal-header';
import { Badge } from '@/components/ui/badge';
import NewsletterForm from '@/app/(pages)/(web)/components/newsletter-form';
import { BlogCard } from './components/blog-card';
import { BlogHero } from './components/blog-hero';
import { BlogSearch } from './components/blog-search';

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Blog({ searchParams }: PageProps) {
  const { q = '' } = await searchParams;
  const query = q.trim();

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
      where: {
        status: 'PUBLISHED',
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { excerpt: { contains: query, mode: 'insensitive' } },
                { tags: { has: query } },
                { category: { is: { name: { contains: query, mode: 'insensitive' } } } },
              ],
            }
          : {}),
      },
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
      take: 16,
    }),
  ]);

  const fallbackPopular = heroArticles.filter(
    (article) => !popularArticles.some((popular) => popular.id === article.id)
  );
  const mergedPopular = [...popularArticles, ...fallbackPopular].slice(0, 4);

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

          <div className='grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-end border-b border-white/10 pb-6'>
            <div className='flex items-center gap-2 flex-wrap'>
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant='white'
                  className='uppercase tracking-wide text-xs px-2.5 py-0.5'
                >
                  {category.name}
                </Badge>
              ))}
            </div>
            <BlogSearch
              initialQuery={query}
              mode='hero'
              targetId='browse-all'
            />
          </div>

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
                Unlock exclusive content
              </h3>
              <p className='text-white/70 font-sans mt-2'>
                Subscribe for practical engineering notes, product essays, and new article updates.
              </p>
            </div>
            <NewsletterForm source='blog-page' />
          </div>
        </section>

        <section id='browse-all' className='space-y-8 md:mt-36'>
          <div className='grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-end border-b border-white/10 pb-5'>
            <h2 className='text-4xl md:text-5xl font-display font-bold text-white'>
              Browse all
            </h2>
            <BlogSearch initialQuery={query} mode='debounced' placeholder='Search for an article' />
          </div>

          {allArticles.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-10'>
              {allArticles.map((article, index) => (
                <BlogCard key={article.id} article={article} priority={index < 4} />
              ))}
            </div>
          ) : (
            <div className='rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60 font-sans'>
              {query ? `No articles found for "${query}".` : 'No articles found.'}
            </div>
          )}
        </section>
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