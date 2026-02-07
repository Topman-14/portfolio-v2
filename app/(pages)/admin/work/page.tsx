import prismadb, { checkAuthentication } from '@/lib/prismadb';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { workColumns } from './data';
import { revalidatePath } from 'next/cache';

export default async function WorkPage() {
  const works = await prismadb.work.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects and work samples
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/work/new">
            <Plus className="mr-2 h-4 w-4" />
            New Work
          </Link>
        </Button>
      </div>

      <DataTable
        columns={workColumns}
        data={works}
        searchKey="title"
        searchPlaceholder="Search work..."
        rowNavigate="/admin/work"
        deleteConfig={{
          onDelete: deleteWork,
          title: "Delete Work",
          nameKey: 'title'
        }}
      />
    </div>
  );
}

async function deleteWork(id: string) {
  'use server'
  
  try {
    await checkAuthentication()

    const work = await prismadb.work.findUnique({
      where: { id },
      select: { featured: true }
    })

    await prismadb.work.delete({
      where: { id }
    })

    revalidatePath('/admin/work')
    revalidatePath('/work')
    revalidatePath(`/work/${id}`)
    
    // Only revalidate home page if deleted work was featured
    if (work?.featured) {
      revalidatePath('/')
    }
  } catch (error) {
    console.error('Error deleting work:', error)
    throw new Error('Failed to delete work')
  }
}

