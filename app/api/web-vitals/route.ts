import { NextResponse } from 'next/server';
import { z } from 'zod';
import prismadb from '@/lib/prismadb';

const webVitalSchema = z.object({
  name: z.enum(['TTFB', 'FCP', 'LCP', 'FID', 'CLS', 'INP']),
  value: z.number(),
  rating: z.enum(['good', 'needs-improvement', 'poor']),
  path: z.string(),
  navigationType: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = webVitalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    const { name, value, rating, path, navigationType } = parsed.data;

    await prismadb.webVitalMetric.create({
      data: { name, value, rating, path, navigationType },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('Web vitals ingestion error:', error);
    return NextResponse.json({ message: 'Unable to record metric' }, { status: 500 });
  }
}
