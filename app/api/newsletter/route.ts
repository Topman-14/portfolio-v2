import { NextResponse } from 'next/server';
import { z } from 'zod';
import prismadb from '@/lib/prismadb';

const newsletterSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const { email, source } = parsed.data;

    const existing = await prismadb.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'You are already subscribed.' },
        { status: 200 }
      );
    }

    await prismadb.newsletterSubscription.create({
      data: {
        email,
        source,
      },
    });

    return NextResponse.json(
      { message: 'Thanks for subscribing!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { message: 'Unable to subscribe right now.' },
      { status: 500 }
    );
  }
}


