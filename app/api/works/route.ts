import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limitRaw = searchParams.get('limit');
    const q = searchParams.get('q')?.trim() ?? '';

    const baseWhere =
      featured === 'true'
        ? { featured: true }
        : featured === 'false'
          ? { featured: false }
          : {};

    const take = limitRaw
      ? Math.min(Number.parseInt(limitRaw, 10) || 48, 100)
      : featured === 'false'
        ? 48
        : undefined;

    const works = await prismadb.work.findMany({
      where: {
        ...baseWhere,
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { slug: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { category: { contains: q, mode: 'insensitive' } },
                { tools: { has: q } },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take,
    });

    return NextResponse.json(works);
  } catch (error) {
    console.error('Error fetching works:', error);
    return NextResponse.json(
      { error: 'Failed to fetch works' },
      { status: 500 }
    );
  }
}
