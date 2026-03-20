import prismadb from '@/lib/prismadb';
import { GenericForm } from '@/components/ui/generic-form';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { cleanErrorMsg } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { routes } from '@/config';
import { emptyToNull, profileFields } from './data';

export default async function AdminProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(routes.signIn);
  }

  const user = await prismadb.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect(routes.signIn);
  }

  async function handleSubmit(data: unknown) {
    'use server';

    try {
      const s = await auth();
      if (!s?.user?.id) {
        throw new Error('You must be logged in to perform this action');
      }

      const d = data as Record<string, string | undefined>;

      await prismadb.user.update({
        where: { id: s.user.id },
        data: {
          name: emptyToNull(d.name),
          image: emptyToNull(d.image),
          bio: emptyToNull(d.bio),
          twitterUrl: emptyToNull(d.twitterUrl),
          linkedinUrl: emptyToNull(d.linkedinUrl),
          githubUrl: emptyToNull(d.githubUrl),
          websiteUrl: emptyToNull(d.websiteUrl),
        },
      });

      const slugs = await prismadb.article.findMany({
        where: { userId: s.user.id },
        select: { slug: true },
      });
      for (const { slug } of slugs) {
        revalidatePath(`/blog/${slug}`);
      }
      revalidatePath('/blog');
    } catch (error) {
      const message =
        error instanceof Error ? cleanErrorMsg(error) : 'An unexpected error occurred';
      throw new Error(message);
    }
  }

  const defaults = {
    name: user.name ?? '',
    image: user.image ?? '',
    bio: user.bio ?? '',
    twitterUrl: user.twitterUrl ?? '',
    linkedinUrl: user.linkedinUrl ?? '',
    githubUrl: user.githubUrl ?? '',
    websiteUrl: user.websiteUrl ?? '',
  };

  return (
    <div className='container mx-auto py-6 px-4'>
      <div className='mb-6 border-b'>
        <h1 className='text-3xl font-bold'>Profile</h1>
        <p className='text-muted-foreground pb-2'>
          Update how you appear on published blog posts (name, photo, bio, and social links).
        </p>
      </div>

      <GenericForm
        fields={profileFields}
        onSubmit={handleSubmit}
        defaultValues={defaults}
        submitText='Save profile'
        itemName='Profile'
        callBackRoute={routes.admin}
      />
    </div>
  );
}
