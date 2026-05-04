import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

const COOKIE_PREFIX = 'blog_read_';

export async function POST(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const article = await prismadb.article.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: { id: true, reads: true },
    });

    if (!article) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({
        counted: false,
        reads: article.reads,
      });
    }

    const cookieStore = await cookies();
    const cookieName = `${COOKIE_PREFIX}${article.id}`;
    if (cookieStore.get(cookieName)?.value === '1') {
      return NextResponse.json({
        counted: false,
        reads: article.reads,
      });
    }

    const updated = await prismadb.article.update({
      where: { id: article.id },
      data: { reads: { increment: 1 } },
      select: { reads: true },
    });

    cookieStore.set(cookieName, '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return NextResponse.json({
      counted: true,
      reads: updated.reads,
    });
  } catch (error) {
    console.error('Article read increment error:', error);
    return NextResponse.json(
      { message: 'Unable to record read.' },
      { status: 500 }
    );
  }
}
