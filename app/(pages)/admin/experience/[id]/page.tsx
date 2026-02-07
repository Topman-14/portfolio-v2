import { notFound } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { GenericForm } from '@/components/ui/generic-form';
import { Experience } from '@prisma/client';
import { cleanErrorMsg } from '@/lib/utils';
import { auth } from '@/auth';
import { experienceFields } from '../data';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ExperiencePage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === 'new';
  let experience: Experience | undefined = undefined;

  if (!isNew) {
    try {
      experience =
        (await prismadb.experience.findUnique({
          where: {
            id,
          },
        })) || undefined;
      if (!experience) {
        throw new Error('experience not found');
      }
    } catch (error) {
      console.error('Error fetching experience:', error);
      notFound();
    }
  }

  async function handleSubmit(data: Experience & { skills: string; achievements: string }) {
    'use server';

    try {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error('You must be logged in to perform this action');
      }

      const processedData = {
        ...data,
        skills: data.skills?.split(',').map((skill: string) => skill.trim()).filter(Boolean) || [],
        achievements: data.achievements?.split(',').map((achievement: string) => achievement.trim()).filter(Boolean) || [],
      };

      if (!isNew) {
        await prismadb.experience.update({
          where: { id },
          data: processedData,
        });
      } else {
        await prismadb.experience.create({
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
          {isNew ? 'New Experience' : `${experience?.jobTitle} at ${experience?.company}`}
        </h1>
        <p className='text-muted-foreground pb-2'>
          {isNew
            ? 'Fill in the details below to create a new experience entry.'
            : 'Update the experience details and save your changes.'}
        </p>
      </div>

      <GenericForm
        fields={experienceFields}
        onSubmit={handleSubmit}
        defaultValues={{
          ...experience,
          skills: experience?.skills.join(','),
          achievements: experience?.achievements.join(','),
        }}
        submitText={isNew ? 'Create' : 'Update'}
        itemName='Experience'
        callBackRoute='/admin/experience'
      />
    </div>
  );
}
