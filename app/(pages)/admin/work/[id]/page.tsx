import { notFound } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { GenericForm } from '@/components/generic-form';
import { Work } from '@prisma/client';
import { cleanErrorMsg } from '@/lib/utils';
import { auth } from '@/auth';
import { workFields } from '../data';

interface PageProps {
  params: {
    id: string;
  };
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

  async function handleSubmit(data: Work & { tools: string }) {
    'use server';

    try {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error('You must be logged in to perform this action');
      }

      const processedData = {
        ...data,
        tools: data.tools?.split(',').map((tool: string) => tool.trim()).filter(Boolean) || [],
      };

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
          ...work,
          tools: work?.tools.join(','),
        }}
        submitText={isNew ? 'Create' : 'Update'}
        itemName='Work'
        callBackRoute='/admin/work'
      />
    </div>
  );
}

