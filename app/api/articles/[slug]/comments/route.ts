import { NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { z } from 'zod';
import prismadb from '@/lib/prismadb';

const commentBodySchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty.')
    .max(4000, 'Comment is too long.'),
  email: z
    .string()
    .nullish()
    .transform((s) => (s == null || s.trim() === '' ? undefined : s.trim()))
    .pipe(z.union([z.undefined(), z.string().email('Invalid email address.')]))
});

const postLimiter = new RateLimiterMemory({
  points: 10,
  duration: 3600,
});

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const article = await prismadb.article.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: { id: true },
    });

    if (!article) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const comments = await prismadb.comment.findMany({
      where: { articleId: article.id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        text: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Comments fetch error:', error);
    return NextResponse.json(
      { message: 'Unable to load comments.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const article = await prismadb.article.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: { id: true },
    });

    if (!article) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const ip = getClientIp(request);
    try {
      await postLimiter.consume(ip);
    } catch {
      return NextResponse.json(
        { message: 'Too many comments from this network. Try again later.' },
        { status: 429 }
      );
    }

    const json = await request.json().catch(() => null);
    const parsed = commentBodySchema.safeParse(json);

    if (!parsed.success) {
      const msg =
        parsed.error.issues[0]?.message ?? 'Invalid comment.';
      return NextResponse.json({ message: msg }, { status: 400 });
    }

    const { text, email } = parsed.data;

    const comment = await prismadb.comment.create({
      data: {
        text,
        email: email ?? null,
        articleId: article.id,
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('Comment create error:', error);
    return NextResponse.json(
      { message: 'Unable to post comment.' },
      { status: 500 }
    );
  }
}
