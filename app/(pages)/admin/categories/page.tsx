import prismadb, { checkAuthentication } from '@/lib/prismadb';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { categoryColumns } from './data';
import { revalidatePath } from 'next/cache';

export default async function CategoriesPage() {
  const categories = await prismadb.category.findMany({
    include: {
      _count: {
        select: {
          articles: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage article categories and organize your content
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Link>
        </Button>
      </div>

      <DataTable
        columns={categoryColumns}
        data={categories}
        searchKey="name"
        searchPlaceholder="Search categories..."
        rowNavigate="/admin/categories"
        deleteConfig={{
          onDelete: deleteCategory,
          title: "Delete Category",
          getContent: (category) => `Are you sure you want to delete "${category?.name}"? This action cannot be undone.`,
        }}
      />
    </div>
  );
}

async function deleteCategory(id: string) {
  'use server'
  
  try {
    await checkAuthentication()

    await prismadb.category.delete({
      where: { id }
    })

    revalidatePath('/admin/categories')
  } catch (error) {
    console.error('Error deleting category:', error)
    throw new Error('Failed to delete category')
  }
}

