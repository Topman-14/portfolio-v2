import { notFound } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { GenericForm } from '@/components/ui/generic-form';
import { Work } from '@prisma/client';
import { cleanErrorMsg, generateSlug } from '@/lib/utils';
import { auth } from '@/auth';
import { workFields } from '../data';
import { revalidatePath } from 'next/cache';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === 'new';
  let work: Work | undefined = undefined;

  if (!isNew) {
    try {
      work =
        (await prismadb.work.findUnique({
          where: {
            id,
          },
        })) || undefined;
      if (!work) {
        throw new Error('work not found');
      }
    } catch (error) {
      console.error('Error fetching work:', error);
      notFound();
    }
  }

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
        fields={workFields}
        onSubmit={handleSubmit}
        defaultValues={{
          ...(work ? work : {}),
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

