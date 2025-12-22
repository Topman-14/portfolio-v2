'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Category {
  name: string;
  _count: {
    articles: number;
  };
}

interface CategoryDistributionProps {
  categories: Category[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function CategoryDistribution({ categories }: CategoryDistributionProps) {
  const data = categories.map(category => ({
    name: category.name,
    value: category._count.articles
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent as number * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[data.indexOf(entry) % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
