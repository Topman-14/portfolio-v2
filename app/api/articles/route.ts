import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() ?? '';
    const categoryId = searchParams.get('category')?.trim() ?? '';
    const limitRaw = searchParams.get('limit');
    const take = limitRaw
      ? Math.min(Number.parseInt(limitRaw, 10) || 48, 100)
      : 48;

    const articles = await prismadb.article.findMany({
      where: {
        status: 'PUBLISHED',
        ...(categoryId ? { categoryId } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { excerpt: { contains: q, mode: 'insensitive' } },
                { tags: { has: q } },
                { category: { is: { name: { contains: q, mode: 'insensitive' } } } },
              ],
            }
          : {}),
      },
      orderBy: { publishedAt: 'desc' },
      take,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImg: true,
        readTime: true,
        publishedAt: true,
        tags: true,
        status: true,
        categoryId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        category: true,
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
