import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { FaGithub, FaUpRightFromSquare } from 'react-icons/fa6';
import prismadb from '@/lib/prismadb';
import { BASE_URL } from '@/config';
import { Badge } from '@/components/ui/badge';
import { createHtmlRenderData, HtmlRenderer } from '@/components/custom/html-renderer';
import { cn } from '@/lib/utils';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const works = await prismadb.work.findMany({
    select: {
      slug: true,
    },
  });

  return works.map((work) => ({
    slug: work.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = await prismadb.work.findUnique({
    where: { slug },
  });

  if (!work) {
    return {
      title: 'Work Not Found | Tope Akinkuade',
    };
  }

  const projectOg = work.image
    ? {
        openGraph: {
          images: [
            {
              url: work.image,
              width: 1200,
              height: 630,
              alt: work.title,
            },
          ],
        },
        twitter: { images: [work.image] },
      }
    : {};

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
      url: `${BASE_URL}/work/${slug}`,
      siteName: 'Tope Akinkuade',
      type: 'website',
      ...projectOg.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${work.title} | Tope Akinkuade`,
      description: work.description,
      ...projectOg.twitter,
    },
  };
}

const ctaBase =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-sm font-medium transition-colors';

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const work = await prismadb.work.findUnique({
    where: { slug },
  });

  if (!work) {
    notFound();
  }

  const { html: contentHtml, toc } = createHtmlRenderData(work.content || '');
  const hasBodyContent = contentHtml.replaceAll(/<[^>]+>/g, '').trim().length > 0;

  return (
    <main className='bg2 min-h-screen py-24 md:py-28'>
      <div className='mx-auto max-w-[1500px] space-y-12 px-4 md:px-8 lg:px-12'>
        <Link
          href='/work'
          className='inline-flex items-center gap-2 font-sans text-white/70 transition-colors hover:text-malachite'
        >
          <ArrowLeft className='size-4' />
          Back to work
        </Link>

        <div className='relative aspect-[16/10] w-full min-h-[220px] overflow-hidden rounded-3xl md:aspect-[2.6/1] md:min-h-[300px]'>
          {work.image ? (
            <Image
              src={work.image}
              alt=''
              fill
              priority
              className='object-cover'
              sizes='(max-width: 1536px) 100vw, 1500px'
              aria-hidden
            />
          ) : (
            <div
              className='absolute inset-0 bg-gradient-to-br from-malachite/25 via-amber/20 to-bittersweet/25'
              aria-hidden
            />
          )}
          <div
            className='pointer-events-none absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent md:via-black/35'
            aria-hidden
          />
          <div className='relative z-10 flex h-full min-h-0 flex-col justify-end p-6 pb-8 pt-20 md:p-10 md:pb-10 md:pt-28 lg:px-12 lg:pb-12'>
            <div className='max-w-5xl space-y-4 drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]'>
              <div className='flex flex-wrap items-center gap-3'>
                {work.category ? (
                  <Badge variant='malachite' className='uppercase tracking-wide'>
                    {work.category}
                  </Badge>
                ) : null}
                {work.featured ? (
                  <Badge variant='amber' className='uppercase tracking-wide'>
                    Featured
                  </Badge>
                ) : null}
              </div>
              <h1 className='font-display text-4xl font-bold leading-[1.08] text-white md:text-5xl xl:text-6xl'>
                {work.title}
              </h1>
            </div>
          </div>
        </div>

        <section className='overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(120deg,rgba(255,255,255,0.06),rgba(114,255,168,0.08),rgba(255,177,87,0.07))]'>
          <div className='space-y-6 p-6 md:p-8 lg:p-10'>
            <p className='font-sans text-lg leading-relaxed text-white/80 md:text-xl'>
              {work.description}
            </p>

            {work.tools.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {work.tools.map((tool) => (
                  <Badge key={tool} variant='white' className='text-xs'>
                    {tool}
                  </Badge>
                ))}
              </div>
            ) : null}

            <div className='flex flex-wrap gap-3 pt-2'>
              {work.liveUrl ? (
                <a
                  href={work.liveUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={cn(
                    ctaBase,
                    'border border-malachite/35 bg-malachite/15 text-malachite hover:bg-malachite/25'
                  )}
                >
                  <span>View live</span>
                  <FaUpRightFromSquare className='size-4' aria-hidden />
                </a>
              ) : null}
              {work.githubLink ? (
                <a
                  href={work.githubLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={cn(
                    ctaBase,
                    'border border-white/15 bg-white/10 text-white hover:border-white/25 hover:bg-white/[0.14]'
                  )}
                >
                  <span>View code</span>
                  <FaGithub className='size-4' aria-hidden />
                </a>
              ) : null}
            </div>
          </div>
        </section>

        {hasBodyContent ? (
          <section
            className={cn(
              'grid gap-10',
              toc.length > 0 && 'lg:grid-cols-[260px_minmax(0,1fr)]'
            )}
          >
            {toc.length > 0 ? (
              <aside className='hidden lg:block'>
                <div className='sticky top-28 space-y-6'>
                  <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                    <p className='mb-3 font-sans text-xs uppercase tracking-wide text-white/55'>
                      On this page
                    </p>
                    <nav className='space-y-2'>
                      {toc.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={cn(
                            'block font-sans text-sm text-white/70 transition-colors hover:text-malachite',
                            item.level === 3 && 'pl-3'
                          )}
                        >
                          {item.label}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </aside>
            ) : null}
            <HtmlRenderer
              html={contentHtml}
            />
          </section>
        ) : null}

        {work.videoUrl ? (
          <section className='space-y-6'>
            <h2 className='font-display text-3xl font-bold text-white md:text-4xl'>
              Demo video
            </h2>
            <div className='relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5'>
              <iframe
                src={work.videoUrl}
                className='absolute inset-0 size-full'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                title={`${work.title} demo`}
              />
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
