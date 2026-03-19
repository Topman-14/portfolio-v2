import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/auth'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
