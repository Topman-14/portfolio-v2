import prismadb from '@/lib/prismadb';
import { ProjectsStack } from './projects-stack';


export const Projects = async () => {
  const works = await prismadb.work.findMany({
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
    },
  });


  return (
    <section className='max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-28'>
      <ProjectsStack works={works} />
    </section>
  );
}
