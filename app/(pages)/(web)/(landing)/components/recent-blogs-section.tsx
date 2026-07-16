import { RecentBlogCard } from './recent-blog-card';
import { RevealHeader } from '@/components/custom/reveal-header';
import { GButton } from '@/components/ui/gbutton';
import prismadb from '@/lib/prismadb';
import { ArrowRight } from 'lucide-react';

export async function RecentBlogsSection() {
  const articles = await prismadb.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
    take: 4,
  });

  if (articles.length === 0) return null;

  return (
    <section className='px-4 md:px-8 lg:px-16'>
      <div className='mx-auto max-w-7xl md:py-28'>
        <RevealHeader
          title='My Blog'
          className='mb-12 md:mb-16'
        />
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10'>
          {articles.map((article, index) => (
            <RecentBlogCard
              key={article.id}
              article={article}
              priority={index < 4}
            />
          ))}
        </div>
        <GButton
          href='/blog'
          className='w-full'
          containerClassName='block group mt-12 md:mt-16 w-full md:w-fit mx-auto'
        >
          <span>All articles</span>
          <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
        </GButton>
      </div>
    </section>
  );
}
