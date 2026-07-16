import { NextResponse } from 'next/server';
import prismadb, { checkAuthentication } from '@/lib/prismadb';

const escapeCsvValue = (value: string) =>
  /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;

export async function GET() {
  try {
    try {
      await checkAuthentication();
    } catch {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const subscribers = await prismadb.newsletterSubscription.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const rows = [
      ['email', 'source', 'subscribedAt'],
      ...subscribers.map((s) => [
        s.email,
        s.source ?? '',
        s.createdAt.toISOString(),
      ]),
    ];

    const csv = rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="newsletter-subscribers.csv"',
      },
    });
  } catch (error) {
    console.error('Newsletter export error:', error);
    return NextResponse.json(
      { message: 'Unable to export subscribers.' },
      { status: 500 }
    );
  }
}
