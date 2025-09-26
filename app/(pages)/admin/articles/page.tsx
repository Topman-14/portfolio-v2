import prismadb from '@/lib/prismadb';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { articlesColumns } from './data';

export default async function ArticlesPage() {
  const articles = await prismadb.article.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="text-muted-foreground">
            Manage your articles and blog posts
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/new">
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Link>
        </Button>
      </div>

      <DataTable
        columns={articlesColumns}
        data={articles}
        searchKey="title"
        searchPlaceholder="Search articles..."
      />
    </div>
  );
}
