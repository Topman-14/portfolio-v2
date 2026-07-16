import prismadb from '@/lib/prismadb';
import { Zap, Gauge, MousePointerClick } from 'lucide-react';
import { MetricCard } from './metric-card';

const METRICS = [
  { name: 'LCP', title: 'LCP (p75)', icon: Gauge, good: 2500, needsImprovement: 4000, unit: 'ms' },
  { name: 'CLS', title: 'CLS (p75)', icon: Zap, good: 0.1, needsImprovement: 0.25, unit: '' },
  { name: 'INP', title: 'INP (p75)', icon: MousePointerClick, good: 200, needsImprovement: 500, unit: 'ms' },
] as const;

function ratingBadge(value: number, good: number, needsImprovement: number) {
  if (value <= good) return { label: 'Good', variant: 'malachite' as const };
  if (value <= needsImprovement) return { label: 'Needs improvement', variant: 'amber' as const };
  return { label: 'Poor', variant: 'bittersweet' as const };
}

export async function WebVitalsSection() {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const results = await Promise.all(
    METRICS.map(({ name }) =>
      prismadb.$queryRaw<{ p75: number | null }[]>`
        SELECT percentile_cont(0.75) WITHIN GROUP (ORDER BY value) AS p75
        FROM web_vital_metrics
        WHERE name = ${name} AND "createdAt" >= ${since}
      `
    )
  );

  const cards = METRICS.map((metric, i) => {
    const p75 = results[i][0]?.p75;
    if (p75 == null) {
      return {
        title: metric.title,
        value: 'No data',
        icon: metric.icon,
        description: 'Last 7 days',
      };
    }
    const rounded = metric.unit === 'ms' ? Math.round(p75) : Math.round(p75 * 1000) / 1000;
    const badge = ratingBadge(p75, metric.good, metric.needsImprovement);
    return {
      title: metric.title,
      value: `${rounded}${metric.unit}`,
      icon: metric.icon,
      description: 'Last 7 days, field data',
      badges: [badge],
    };
  });

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Core Web Vitals</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <MetricCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}
