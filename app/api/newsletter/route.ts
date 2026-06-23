import { NextResponse } from 'next/server';
import { z } from 'zod';
import prismadb from '@/lib/prismadb';
import { sendEmail, isEmailConfigured, getAppBaseUrl } from '@/lib/email';
import { newsletterWelcomeTemplate } from '@/lib/email/templates/newsletter-welcome';

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
        { message: 'This email is already subscribed.' },
        { status: 409 }
      );
    }

    await prismadb.newsletterSubscription.create({
      data: { email, source },
    });

    if (isEmailConfigured()) {
      const baseUrl = getAppBaseUrl();
      const { subject, previewText, html } = newsletterWelcomeTemplate({
        blogUrl: `${baseUrl}/blog`,
        unsubscribeUrl: `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`,
      });
      sendEmail({
        to: { email },
        subject,
        html,
        previewText,
        unsubscribeUrl: `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`,
      })
        .then(() => console.log('[newsletter] welcome email sent to', email))
        .catch((err) => console.error('[newsletter] welcome email error:', err));
    } else {
      console.warn('[newsletter] email not sent — BREVO_API_KEY or GMAIL_USER not set');
    }

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
