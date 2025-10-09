import { notFound } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { FieldConfig, GenericForm } from '@/components/generic-form';
import { Article, ArticleStatus, Category } from '@prisma/client';
import { generateSlug, cleanErrorMsg } from '@/lib/utils';
import { auth } from '@/auth';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === 'new';
  let article: Article | undefined = undefined;

  if (!isNew) {
    try {
      article =
        (await prismadb.article.findUnique({
          where: {
            id,
          },
          include: {
            category: true,
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

  async function handleSubmit(data: Article & { tags: string }) {
    'use server';

    try {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error('You must be logged in to perform this action');
      }

      if (!isNew) {
        
        const justPublished =
          article?.status === ArticleStatus.DRAFT &&
          data.status === ArticleStatus.PUBLISHED;
          
        await prismadb.article.update({
          where: { id },
          data: {
            ...data,
            publishedAt: justPublished ? new Date() : undefined,
          },
        });
      } else {
        await prismadb.article.create({
          data: {
            ...data,
            slug: generateSlug(data.title),
            userId: session.user.id, 
            tags: data.tags?.split(',').map((tag: string) => tag.trim()).filter(Boolean),
          },
        });
      }
    } catch (error) {
      const message = error instanceof Error ? cleanErrorMsg(error) : 'An unexpected error occurred';
      throw new Error(message);
    }
  }

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
          fields={articleFields(categories)}
          onSubmit={handleSubmit}
          defaultValues={{
            ...article,
            tags: article?.tags.join(','),
          }}
          submitText={isNew ? 'Create' : 'Update'}
          itemName='Article'
          callBackRoute='/admin/articles'
        />
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
    name: 'tags',
    label: 'Tags',
    type: 'text',
    placeholder: 'javascript, react, nextjs',
  },
  {
    name: 'excerpt',
    label: 'Excerpt',
    type: 'textarea',
    placeholder: 'Brief summary of the article',
    colSpan: 2,
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
  {
    name: 'content',
    label: 'Content',
    type: 'rich-text',
    placeholder: 'Write your article content here...',
    required: true,
    colSpan: 3,
    minHeight: 400,
  },
];
