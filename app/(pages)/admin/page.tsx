import prismadb from '@/lib/prismadb';
import { 
  FileText, 
  Eye, 
  MessageSquare, 
  Users, 
  Briefcase,
  Award,
  Calendar
} from 'lucide-react';
import { ArticlesChart } from '../../../components/charts/articles-chart';
import { TopArticles } from '../../../components/charts/top-articles';
import { CategoryDistribution } from '../../../components/charts/category-distribution';
import { RecentActivity } from '../../../components/charts/recent-activity';
import { MetricCard, ChartCard } from '../../../components/dashboard/metric-card';

export default async function AdminDashboard() {
  const [
    totalArticles,
    totalReads,
    totalComments,
    publishedArticles,
    draftArticles,
    archivedArticles,
    totalWorks,
    featuredWorks,
    totalExperiences,
    totalCategories,
    topArticles,
    articlesByMonth,
    categoryStats,
    recentArticles
  ] = await Promise.all([
    prismadb.article.count(),
    prismadb.article.aggregate({ _sum: { reads: true } }),
    prismadb.comment.count(),
    prismadb.article.count({ where: { status: 'PUBLISHED' } }),
    prismadb.article.count({ where: { status: 'DRAFT' } }),
    prismadb.article.count({ where: { status: 'ARCHIVED' } }),
    prismadb.work.count(),
    prismadb.work.count({ where: { featured: true } }),
    prismadb.experience.count(),
    prismadb.category.count(),
    prismadb.article.findMany({
      take: 5,
      orderBy: { reads: 'desc' },
      select: { title: true, reads: true, status: true }
    }),
    prismadb.article.findMany({
      where: { publishedAt: { not: null } },
      select: { publishedAt: true },
      orderBy: { publishedAt: 'asc' }
    }),
    prismadb.category.findMany({
      include: { _count: { select: { articles: true } } }
    }),
    prismadb.article.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { title: true, status: true, createdAt: true }
    })
  ]);

  const totalReadsCount = totalReads._sum.reads || 0;

  const monthlyData = articlesByMonth.reduce((acc, article) => {
    if (article.publishedAt) {
      const month = article.publishedAt.toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, count]) => ({
      month: new Date(month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      articles: count
    }));

  const topMetrics = [
    {
      title: 'Total Articles',
      value: totalArticles,
      icon: FileText,
      badges: [
        { label: `${publishedArticles} Published`, variant: 'default' as const },
        { label: `${draftArticles} Draft`, variant: 'secondary' as const },
        { label: `${archivedArticles} Archived`, variant: 'outline' as const }
      ]
    },
    {
      title: 'Total Reads',
      value: totalReadsCount.toLocaleString(),
      icon: Eye,
      description: 'Across all articles'
    },
    {
      title: 'Comments',
      value: totalComments,
      icon: MessageSquare,
      description: 'Total engagement'
    },
    {
      title: 'Portfolio',
      value: totalWorks,
      icon: Briefcase,
      description: `${featuredWorks} featured projects`
    }
  ];

  const bottomMetrics = [
    {
      title: 'Experience',
      value: totalExperiences,
      icon: Users,
      description: 'Work experiences'
    },
    {
      title: 'Categories',
      value: totalCategories,
      icon: Award,
      description: 'Content categories'
    },
    {
      title: 'Avg. Read Time',
      value: publishedArticles > 0 ? Math.round(totalReadsCount / publishedArticles) : 0,
      icon: Calendar,
      description: 'Reads per published article'
    }
  ];

  const chartCards = [
    {
      title: 'Articles Published Over Time',
      children: <ArticlesChart data={chartData} />,
      className: 'col-span-1'
    },
    {
      title: 'Top Performing Articles',
      children: <TopArticles articles={topArticles} />,
      className: 'col-span-1'
    },
    {
      title: 'Category Distribution',
      children: <CategoryDistribution categories={categoryStats} />,
      className: 'col-span-1'
    },
    {
      title: 'Recent Activity',
      children: <RecentActivity articles={recentArticles} />,
      className: 'col-span-2'
    }
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your content and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {topMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {chartCards.slice(0, 2).map((chart) => (
          <ChartCard key={chart.title} {...chart} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {chartCards.slice(2).map((chart) => (
          <ChartCard key={chart.title} {...chart} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {bottomMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>
    </div>
  );
}