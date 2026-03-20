import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Globe } from 'lucide-react';
import {
  FaGithub,
  FaGlobe,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';
import prismadb from '@/lib/prismadb';
import { BASE_URL } from '@/config';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { BlogPostShare } from '../components/blog-post-share';
import { BlogCard } from '../components/blog-card';
import { formatPublishedDate } from '@/lib/utils';
import { createHtmlRenderData, HtmlRenderer } from '@/components/custom/html-renderer';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = await prismadb.article.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  });

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prismadb.article.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: { category: true },
  });

  if (!article) {
    return {
      title: 'Article Not Found | Tope Akinkuade',
    };
  }

  const description = article.excerpt || `Read ${article.title} on Tope Akinkuade's blog.`;
  const ogImage = article.coverImg || `${BASE_URL}/og-image.png`;

  return {
    title: `${article.title} | Tope Akinkuade`,
    description,
    keywords: [
      article.title,
      ...(article.tags || []),
      article.category?.name || '',
      'Tope Akinkuade',
      'Blog',
      'Web Development',
    ].filter(Boolean),
    openGraph: {
      title: `${article.title} | Tope Akinkuade`,
      description,
      url: `${BASE_URL}/blog/${article.slug}`,
      siteName: 'Tope Akinkuade',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} | Tope Akinkuade`,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await prismadb.article.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: {
      category: true,
      user: {
        select: {
          name: true,
          image: true,
          bio: true,
          twitterUrl: true,
          linkedinUrl: true,
          githubUrl: true,
          websiteUrl: true,
        },
      },
    },
  });

  if (!article) {
    notFound();
  }

  const { html: contentWithIds, toc } = createHtmlRenderData(article.content);

  const categoryRelated = article.categoryId
    ? await prismadb.article.findMany({
      where: {
        status: 'PUBLISHED',
        categoryId: article.categoryId,
        id: { not: article.id },
      },
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
      take: 3,
    })
    : [];

  const relatedIds = new Set(categoryRelated.map((item) => item.id));
  const fallbackNeeded = 3 - categoryRelated.length;

  const fallbackRelated =
    fallbackNeeded > 0
      ? await prismadb.article.findMany({
        where: {
          status: 'PUBLISHED',
          id: { not: article.id },
        },
        orderBy: { publishedAt: 'desc' },
        include: { category: true },
        take: 6,
      })
      : [];

  const relatedArticles = [
    ...categoryRelated,
    ...fallbackRelated.filter((item) => !relatedIds.has(item.id)).slice(0, fallbackNeeded),
  ];

  const author = article.user;
  const displayName = author?.name || 'Tope Akinkuade';
  const authorSocials = [
    { href: author?.twitterUrl, label: 'X', Icon: FaXTwitter },
    { href: author?.linkedinUrl, label: 'LinkedIn', Icon: FaLinkedinIn },
    { href: author?.githubUrl, label: 'GitHub', Icon: FaGithub },
    { href: author?.websiteUrl, label: 'Website', Icon: Globe },
  ].filter(
    (item): item is typeof item & { href: string } =>
      typeof item.href === 'string' && item.href.length > 0
  );

  const articleUrl = `${BASE_URL}/blog/${article.slug}`;
  const socialBtnClass =
    'inline-flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/80 hover:text-malachite hover:border-malachite/40 transition-colors';

  return (
    <main className='bg2 min-h-screen py-24 md:py-28'>
      <div className='max-w-[1500px] mx-auto space-y-14 px-4 md:px-8 lg:px-12'>
        <Link
          href='/blog'
          className='inline-flex items-center gap-2 text-white/70 hover:text-malachite transition-colors font-sans'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Blog
        </Link>

        <section className='rounded-3xl border border-white/10 bg-[linear-gradient(120deg,rgba(255,255,255,0.06),rgba(114,255,168,0.08),rgba(255,177,87,0.07))] p-6 md:p-8 lg:p-10'>
          <div className='grid grid-cols-1 xl:grid-cols-[1fr_620px] gap-8 xl:gap-12 items-stretch'>
            <div className='space-y-5 my-auto'>
              <div className='flex flex-wrap items-center gap-3 text-sm font-sans'>
                {article.category ? (
                  <Badge variant='malachite' className='uppercase tracking-wide'>
                    {article.category.name}
                  </Badge>
                ) : null}
                {article.publishedAt ? (
                  <span className='text-white/70'>{formatPublishedDate(article.publishedAt, 'long')}</span>
                ) : null}
                {article.readTime ? (
                  <span className='text-white/70'>{article.readTime} min read</span>
                ) : null}
              </div>

              <h1 className='text-4xl md:text-5xl xl:text-6xl font-display font-bold text-white leading-tight'>
                {article.title}
              </h1>

              {article.excerpt ? (
                <p className='text-white/80 text-lg md:text-xl leading-relaxed font-sans max-w-3xl'>
                  {article.excerpt}
                </p>
              ) : null}

              {article.tags.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant='white' className='text-xs'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>

            <div className='relative min-h-[300px] md:min-h-[380px] rounded-2xl overflow-hidden bg-white/5 border border-white/10'>
              {article.coverImg ? (
                <Image
                  src={article.coverImg}
                  alt={article.title}
                  fill
                  priority
                  className='object-cover'
                />
              ) : (
                <div className='absolute inset-0 bg-gradient-to-br from-malachite/25 via-amber/20 to-bittersweet/25' />
              )}
            </div>
          </div>
        </section>

        <section className='grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-10'>
          <aside className='hidden lg:block'>
            <div className='sticky top-28 space-y-6'>
              <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                <p className='text-xs uppercase tracking-wide text-white/55 font-sans'>
                  Author
                </p>
                <div className='mt-4 space-y-4'>
                  <div className='flex items-start gap-3.5'>
                    <div className='shrink-0 rounded-full p-[2px] ring-1 ring-inset ring-white/12 bg-gradient-to-br from-white/[0.08] to-transparent'>
                      <Avatar
                        src={author?.image}
                        alt={displayName}
                        className='size-12 border border-white/10'
                        fallbackClassName='bg-white/[0.08] text-white font-display text-base border-0'
                      />
                    </div>
                    <div className='min-w-0 flex-1 pt-1'>
                      <p className='font-display text-lg font-semibold text-white leading-snug tracking-tight'>
                        {displayName}
                      </p>
                    </div>
                  </div>
                  {author?.bio ? (
                    <>
                      <div className='h-px bg-gradient-to-r from-transparent via-white/12 to-transparent' />
                      <p className='text-sm text-white/65 font-sans leading-relaxed'>
                        {author.bio}
                      </p>
                    </>
                  ) : null}
                  {authorSocials.length > 0 ? (
                    <div className='flex flex-wrap gap-2 pt-0.5'>
                      {authorSocials.map(({ href, label, Icon }) => (
                        <Link
                          key={label}
                          href={href}
                          target='_blank'
                          rel='noopener noreferrer'
                          className={socialBtnClass}
                          aria-label={label}
                        >
                          <Icon className='size-4' />
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {toc.length > 0 ? (
                <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                  <p className='text-xs uppercase tracking-wide text-white/55 font-sans mb-3'>
                    Table of contents
                  </p>
                  <nav className='space-y-2'>
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm font-sans text-white/70 hover:text-malachite transition-colors ${item.level === 3 ? 'pl-3' : ''}`}
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              ) : null}

              <BlogPostShare articleUrl={articleUrl} title={article.title} />
            </div>
          </aside>

          <HtmlRenderer html={contentWithIds} />
        </section>

        {relatedArticles.length > 0 ? (
          <section className='space-y-6 pt-8'>
            <div className='flex items-center justify-between gap-4'>
              <h2 className='text-3xl md:text-4xl font-display font-bold text-white'>
                Related articles
              </h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8'>
              {relatedArticles.map((relatedArticle) => (
                <BlogCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
