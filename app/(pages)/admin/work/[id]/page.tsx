import { notFound } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { FieldConfig, GenericForm } from '@/components/ui/generic-form';
import { Work, Category } from '@prisma/client';
import { cleanErrorMsg, generateSlug } from '@/lib/utils';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === 'new';
  let work: (Work & { category: Category | null }) | undefined = undefined;

  if (!isNew) {
    try {
      work =
        (await prismadb.work.findUnique({
          where: {
            id,
          },
          include: { category: true },
        })) || undefined;
      if (!work) {
        throw new Error('work not found');
      }
    } catch (error) {
      console.error('Error fetching work:', error);
      notFound();
    }
  }

  const categories = await prismadb.category.findMany();

  const wasFeaturedBefore = !isNew && work ? work.featured : false;
  const previousPublicSlug = !isNew && work ? work.slug : null;

  async function handleSubmit(data: Work & { tools: string }) {
    'use server';

    try {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error('You must be logged in to perform this action');
      }

      const slugInput =
        typeof data.slug === 'string' ? data.slug.trim() : '';
      const resolvedSlug =
        slugInput ||
        previousPublicSlug ||
        generateSlug(data.title);

      const processedData = {
        ...data,
        slug: resolvedSlug,
        tools: data.tools?.split(',').map((tool: string) => tool.trim()).filter(Boolean) || [],
        videoUrl: data.videoUrl || null,
        liveUrl: data.liveUrl || null,
        githubLink: data.githubLink || null,
        content: data.content ?? '',
      };

      const isNowFeatured = processedData.featured;
      const featuredStatusChanged = wasFeaturedBefore !== isNowFeatured;
      
      if (!isNew) {
        await prismadb.work.update({
          where: { id },
          data: processedData,
        });
      } else {
        await prismadb.work.create({
          data: {
            ...processedData,
            userId: session.user.id,
          },
        });
      }

      revalidatePath('/work');
      if (previousPublicSlug && previousPublicSlug !== resolvedSlug) {
        revalidatePath(`/work/${previousPublicSlug}`);
      }
      revalidatePath(`/work/${resolvedSlug}`);
      
      // Only revalidate home page if featured status changed or new work is featured
      if (featuredStatusChanged || isNowFeatured) {
        revalidatePath('/');
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
          {isNew ? 'New Work' : `${work?.title}`}
        </h1>
        <p className='text-muted-foreground pb-2'>
          {isNew
            ? 'Fill in the details below to create a new work entry.'
            : 'Update the work details and save your changes.'}
        </p>
      </div>

      <GenericForm
        fields={workFields(categories)}
        onSubmit={handleSubmit}
        defaultValues={{
          ...(work
            ? (() => {
                const { category, ...rest } = work;
                void category;
                return rest;
              })()
            : {}),
          tools: work?.tools.join(',') ?? '',
          content: work?.content ?? '',
          slug: work?.slug ?? '',
        }}
        submitText={isNew ? 'Create' : 'Update'}
        itemName='Work'
        callBackRoute='/admin/work'
      />
    </div>
  );
}

const workFields = (categories: Category[]): FieldConfig[] => [
  {
    name: 'image',
    label: 'Project Image',
    type: 'file',
    accept: 'image/*',
    maxSize: 5,
    colSpan: 3,
  },
  {
    name: 'title',
    label: 'Project Title',
    type: 'text',
    placeholder: 'E-commerce Platform',
    required: true,
    colSpan: 1,
  },
  {
    name: 'slug',
    label: 'URL slug',
    type: 'text',
    placeholder: 'my-project',
    colSpan: 1,
    description: 'Leave empty when creating to generate from the title.',
  },
  {
    name: 'categoryId',
    label: 'Category',
    type: 'async-select',
    placeholder: 'Select or search category',
    colSpan: 1,
    fetchOptions: categories.map((cat) => ({
      label: cat.name,
      value: cat.id,
    })),
  },
  {
    name: 'featured',
    label: 'Featured Project',
    type: 'boolean',
    colSpan: 1,
  },
  {
    name: 'tools',
    label: 'Tools & Technologies',
    type: 'text',
    placeholder: 'React, TypeScript, Node.js',
    colSpan: 2,
  },
  {
    name: 'githubLink',
    label: 'GitHub Link',
    type: 'url',
    placeholder: 'https://github.com/username/project',
    colSpan: 1,
  },
  {
    name: 'liveUrl',
    label: 'Live URL',
    type: 'url',
    placeholder: 'https://project.com',
    colSpan: 1,
  },
  {
    name: 'videoUrl',
    label: 'Demo Video URL',
    type: 'url',
    placeholder: 'https://youtube.com/watch?v=...',
    colSpan: 1,
    required: false,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Short summary for cards and meta (plain text)...',
    required: true,
    colSpan: 3,
    minHeight: 120,
  },
  {
    name: 'content',
    label: 'Project content',
    type: 'rich-text',
    placeholder: 'Full case study, features, screenshots, etc...',
    required: true,
    colSpan: 3,
    minHeight: 400,
  },
];
