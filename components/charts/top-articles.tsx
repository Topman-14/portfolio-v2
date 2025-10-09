'use client'

import { Badge } from '@/components/ui/badge';

interface Article {
  title: string;
  reads: number;
  status: string;
}

interface TopArticlesProps {
  articles: Article[];
}

export function TopArticles({ articles }: TopArticlesProps) {
  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <div key={article.title} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium text-sm truncate">{article.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={article.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                {article.status}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{article.reads.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">reads</div>
          </div>
        </div>
      ))}
    </div>
  );
}
