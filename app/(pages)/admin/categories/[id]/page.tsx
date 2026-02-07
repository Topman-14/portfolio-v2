import { notFound } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { GenericForm } from '@/components/ui/generic-form';
import { Category } from '@prisma/client';
import { generateSlug, cleanErrorMsg } from '@/lib/utils';
import { auth } from '@/auth';
import { categoryFields } from '../data';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === 'new';
  let category: Category | undefined = undefined;

  if (!isNew) {
    try {
      category =
        (await prismadb.category.findUnique({
          where: {
            id,
          },
        })) || undefined;
      if (!category) {
        throw new Error('category not found');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      notFound();
    }
  }

  async function handleSubmit(data: Category) {
    'use server';

    try {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error('You must be logged in to perform this action');
      }

      if (!isNew) {
        await prismadb.category.update({
          where: { id },
          data: {
            ...data,
            slug: generateSlug(data.name),
          },
        });
      } else {
        await prismadb.category.create({
          data: {
            ...data,
            slug: generateSlug(data.name),
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
          {isNew ? 'New Category' : `${category?.name}`}
        </h1>
        <p className='text-muted-foreground pb-2'>
          {isNew
            ? 'Fill in the details below to create a new category.'
            : 'Update the category details and save your changes.'}
        </p>
      </div>

      <GenericForm
        fields={categoryFields}
        onSubmit={handleSubmit}
        defaultValues={category}
        submitText={isNew ? 'Create' : 'Update'}
        itemName='Category'
        callBackRoute='/admin/categories'
      />
    </div>
  );
}

