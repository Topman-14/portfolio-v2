import { notFound } from 'next/navigation';
import prismadb, { checkAuthentication } from '@/lib/prismadb';
import { FieldConfig, GenericForm } from '@/components/ui/generic-form';
import { Article, ArticleStatus, Category } from '@prisma/client';
import { generateSlug, cleanErrorMsg } from '@/lib/utils';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { ArticleCommentsPanel } from '../components/article-comments-panel';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === 'new';
  let article: (Article & {
    category: Category | null;
    comments: { id: string; name: string | null; text: string; email: string | null; createdAt: Date }[];
  }) | undefined = undefined;

  if (!isNew) {
    try {
      article =
        (await prismadb.article.findUnique({
          where: {
            id,
          },
          include: {
            category: true,
            comments: {
              orderBy: { createdAt: 'desc' },
              select: { id: true, name: true, text: true, email: true, createdAt: true },
            },
          },
        })) || undefined;
      if (!article) {
        throw new Error('article not found');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      notFound();
    }
  }

  const categories = await prismadb.category.findMany();

  const existingSlug = article?.slug ?? null;
  const existingStatus = article?.status ?? null;

  async function handleSubmit(data: Article) {
    'use server';

    try {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error('You must be logged in to perform this action');
      }

      if (!isNew) {

        const justPublished =
          existingStatus === ArticleStatus.DRAFT &&
          data.status === ArticleStatus.PUBLISHED;

        await prismadb.article.update({
          where: { id },
          data: {
            ...data,
            publishedAt: justPublished ? new Date() : undefined,
          },
        });
        revalidatePath('/blog');
        if (existingSlug) {
          revalidatePath(`/blog/${existingSlug}`);
        }
      } else {
        const slug = generateSlug(data.title);
        await prismadb.article.create({
          data: {
            ...data,
            slug,
            userId: session.user.id,
          },
        });
        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);
      }
    } catch (error) {
      const message = error instanceof Error ? cleanErrorMsg(error) : 'An unexpected error occurred';
      throw new Error(message);
    }
  }

  async function deleteArticleComment(commentId: string) {
    'use server';

    await checkAuthentication();

    const comment = await prismadb.comment.findUnique({
      where: { id: commentId },
      select: { articleId: true, article: { select: { slug: true } } },
    });

    if (!comment || comment.articleId !== id) {
      throw new Error('Comment not found or does not belong to this article.');
    }

    await prismadb.comment.delete({ where: { id: commentId } });

    revalidatePath(`/admin/articles/${id}`);
    revalidatePath('/blog');
    if (comment.article.slug) {
      revalidatePath(`/blog/${comment.article.slug}`);
    }
  }

  const commentRows =
    !isNew && article
      ? article.comments.map((c) => ({
          id: c.id,
          name: c.name,
          text: c.text,
          email: c.email,
          createdAt: c.createdAt.toISOString(),
        }))
      : [];

  return (
    <div className='container mx-auto py-6 px-4'>
      <div className='mb-6 border-b'>
        <h1 className='text-3xl font-bold'>
          {isNew ? 'New Article' : `${article?.title}`}
        </h1>
        <p className='text-muted-foreground pb-2'>
          {isNew
            ? 'Fill in the details below to create a new article.'
            : 'Update the article details and save your changes.'}
        </p>
      </div>

      <GenericForm
        fields={[
          ...articleFields(categories),
        ]}
        onSubmit={handleSubmit}
        defaultValues={{
          ...(article
            ? (() => {
                const { comments, category, ...rest } = article;
                void comments;
                void category;
                return rest;
              })()
            : {}),
        }}
        submitText={isNew ? 'Create' : 'Update'}
        itemName='Article'
        callBackRoute='/admin/articles'
      />

      {!isNew ? (
        <div className='mt-10 space-y-4'>
          <div>
            <h2 className='text-xl font-semibold'>Comments</h2>
            <p className='text-sm text-muted-foreground'>
              Reader comments on this post. Email is only stored if they chose to leave one.
            </p>
          </div>
          <ArticleCommentsPanel comments={commentRows} deleteComment={deleteArticleComment} />
        </div>
      ) : null}
    </div>
  );
}

const articleFields = (categories: Category[]): FieldConfig[] => [
  {
    name: 'coverImg',
    label: 'Cover Image',
    type: 'file',
    accept: 'image/*',
    maxSize: 5,
    colSpan: 3,
  },
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'Enter article title',
    required: true,
    colSpan: 1,
  },
  {
    name: 'categoryId',
    label: 'Category',
    type: 'async-select',
    placeholder: 'Select or search category',
    fetchOptions: categories.map((cat) => ({
      label: cat.name,
      value: cat.id,
    })),
  },
  {
    name: 'readTime',
    label: 'Read Time (minutes)',
    type: 'number',
    min: 1,
    max: 120,
    defaultValue: 5,
  },
  {
    name: 'excerpt',
    label: 'Excerpt',
    type: 'textarea',
    placeholder: 'Brief summary of the article',
    colSpan: 2,
  },

  {
    name: 'tags',
    label: 'Tags',
    type: 'tags',
    placeholder: 'Type a tag and press Enter',
  },
  {
    name: 'content',
    label: 'Content',
    type: 'rich-text',
    placeholder: 'Write your article content here...',
    required: true,
    colSpan: 3,
    minHeight: 400,
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Draft', value: ArticleStatus.DRAFT },
      { label: 'Published', value: ArticleStatus.PUBLISHED },
      { label: 'Archived', value: ArticleStatus.ARCHIVED },
    ],
    defaultValue: ArticleStatus.DRAFT,
  },
];
