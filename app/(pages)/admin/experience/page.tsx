import prismadb, { checkAuthentication } from '@/lib/prismadb';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { experienceColumns } from './data';
import { revalidatePath } from 'next/cache';

export default async function ExperiencePage() {
  const experiences = await prismadb.experience.findMany({
    orderBy: {
      startDate: 'desc',
    },
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Experience</h1>
          <p className="text-muted-foreground">
            Manage your work experience and career history
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/experience/new">
            <Plus className="mr-2 h-4 w-4" />
            New Experience
          </Link>
        </Button>
      </div>

      <DataTable
        columns={experienceColumns}
        data={experiences}
        searchKey="jobTitle"
        searchPlaceholder="Search experiences..."
        rowNavigate="/admin/experience"
        deleteConfig={{
          onDelete: deleteExperience,
          title: "Delete Experience",
          nameKey: 'jobTitle'
        }}
      />
    </div>
  );
}

async function deleteExperience(id: string) {
  'use server'
  
  try {
    await checkAuthentication()

    await prismadb.experience.delete({
      where: { id }
    })

    revalidatePath('/admin/experience')
  } catch (error) {
    console.error('Error deleting experience:', error)
    throw new Error('Failed to delete experience')
  }
}
