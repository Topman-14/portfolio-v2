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
import { ArticlesChart } from './components/articles-chart';
import { TopArticles } from './components/top-articles';
import { CategoryDistribution } from './components/category-distribution';
import { RecentActivity } from './components/recent-activity';
import { MetricCard, ChartCard } from './components/metric-card';
import { WebVitalsSection } from './components/web-vitals-section';
import { routes } from '@/config';

export default async function AdminDashboard() {
  const [articles, totalComments, works, totalExperiences, categoryStats] =
    await Promise.all([
      prismadb.article.findMany({
        select: { id: true, title: true, status: true, reads: true, publishedAt: true, createdAt: true }
      }),
      prismadb.comment.count(),
      prismadb.work.findMany({ select: { featured: true } }),
      prismadb.experience.count(),
      prismadb.category.findMany({
        include: { _count: { select: { articles: true } } }
      })
    ]);

  const totalArticles = articles.length;
  const totalReadsCount = articles.reduce((sum, a) => sum + a.reads, 0);
  const publishedArticles = articles.filter((a) => a.status === 'PUBLISHED').length;
  const draftArticles = articles.filter((a) => a.status === 'DRAFT').length;
  const archivedArticles = articles.filter((a) => a.status === 'ARCHIVED').length;

  const topArticles = [...articles]
    .sort((a, b) => b.reads - a.reads)
    .slice(0, 5);

  const recentArticles = [...articles]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const totalWorks = works.length;
  const featuredWorks = works.filter((w) => w.featured).length;

  const totalCategories = categoryStats.length;

  const monthlyData = articles.reduce((acc, article) => {
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
        { label: `${publishedArticles} Published`, variant: 'malachite' as const },
        { label: `${draftArticles} Draft`, variant: 'amber' as const },
        { label: `${archivedArticles} Archived`, variant: 'bittersweet' as const }
      ],
      link: routes.adminBlog
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

      <WebVitalsSection />

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