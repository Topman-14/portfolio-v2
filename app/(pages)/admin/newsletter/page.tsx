import prismadb, { checkAuthentication } from '@/lib/prismadb';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Download, Mail, CalendarClock } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { startOfMonth } from 'date-fns';
import { MetricCard } from '../components/metric-card';
import { newsletterColumns } from './data';

export default async function NewsletterPage() {
  const [subscribers, total, thisMonth, bySource] = await Promise.all([
    prismadb.newsletterSubscription.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prismadb.newsletterSubscription.count(),
    prismadb.newsletterSubscription.count({
      where: { createdAt: { gte: startOfMonth(new Date()) } },
    }),
    prismadb.newsletterSubscription.groupBy({
      by: ['source'],
      _count: true,
    }),
  ]);

  const sourceBadges = bySource.map((s) => ({
    label: `${s._count} ${s.source ?? 'unknown'}`,
    variant: 'white' as const,
  }));

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Newsletter</h1>
          <p className="text-muted-foreground">
            View and manage your newsletter subscribers
          </p>
        </div>
        <Button asChild variant="outline">
          <a href="/api/admin/newsletter/export" download>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <MetricCard
          title="Total Subscribers"
          value={total}
          icon={Mail}
          badges={sourceBadges.length > 0 ? sourceBadges : undefined}
        />
        <MetricCard
          title="New This Month"
          value={thisMonth}
          icon={CalendarClock}
        />
      </div>

      <DataTable
        columns={newsletterColumns}
        data={subscribers}
        searchKey="email"
        searchPlaceholder="Search by email..."
        deleteConfig={{
          onDelete: deleteSubscriber,
          title: "Delete Subscriber",
          nameKey: 'email'
        }}
      />
    </div>
  );
}

async function deleteSubscriber(id: string) {
  'use server'

  try {
    await checkAuthentication()

    await prismadb.newsletterSubscription.delete({
      where: { id }
    })

    revalidatePath('/admin/newsletter')
  } catch (error) {
    console.error('Error deleting subscriber:', error)
    throw new Error('Failed to delete subscriber')
  }
}
