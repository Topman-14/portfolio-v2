'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[data.indexOf(entry) % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            content={({ payload }) => (
              <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-2">
                {payload?.map((entry) => (
                  <li key={entry.value} className="flex items-center gap-1.5">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-semibold">{entry.value}</span>
                  </li>
                ))}
              </ul>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
