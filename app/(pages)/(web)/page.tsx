import { Hero, About, Projects, Expertise } from '@/components/web/home';
import prismadb from '@/lib/prismadb';

export default async function Home() {
  const works = await prismadb.work.findMany({
    where: {
      featured: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });

  return (
    <main>
      <Hero />
      <About />
      <Expertise />
      <Projects works={works} />
    </main>
  );
}
