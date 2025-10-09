'use client'

import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Article {
  title: string;
  status: string;
  createdAt: Date;
}

interface RecentActivityProps {
  articles: Article[];
}

export function RecentActivity({ articles }: RecentActivityProps) {
  return (
    <div className="space-y-3">
      {articles.map((article) => (
        <div key={article.title} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium text-sm truncate">{article.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={article.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                {article.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {format(new Date(article.createdAt), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
