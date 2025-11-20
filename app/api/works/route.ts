import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    const where =
      featured === 'true'
        ? { featured: true }
        : featured === 'false'
          ? { featured: false }
          : {};
    const take = limit ? parseInt(limit) : undefined;

    const works = await prismadb.work.findMany({
      where,
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

