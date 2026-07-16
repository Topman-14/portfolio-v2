import { Projects2 } from './projects-2';
import prismadb from '@/lib/prismadb';

export async function FeaturedProjectsSection() {
  const featuredWorks = await prismadb.work.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      tools: true,
      category: true,
      slug: true,
    },
  });

  return <Projects2 works={featuredWorks} />;
}
