import { NextResponse } from 'next/server';
import { emailLayout } from '@/lib/email/layout';
import { newsletterWelcomeTemplate } from '@/lib/email/templates/newsletter-welcome';
import { passwordResetTemplate } from '@/lib/email/templates/password-reset';

const TEMPLATES = {
  'newsletter-welcome': () => {
    const { html, previewText } = newsletterWelcomeTemplate({
      blogUrl: 'http://localhost:8080/blog',
      unsubscribeUrl: 'http://localhost:8080/unsubscribe?email=preview%40example.com',
    });
    return emailLayout(html, previewText, 'http://localhost:8080/unsubscribe?email=preview%40example.com');
  },
  'password-reset': () => {
    const { html, previewText } = passwordResetTemplate({
      resetUrl: 'http://localhost:8080/auth/reset-password?token=preview-token-123',
    });
    return emailLayout(html, previewText);
  },
} as const;

type TemplateName = keyof typeof TEMPLATES;

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const template = (searchParams.get('t') ?? 'newsletter-welcome') as TemplateName;

  if (!(template in TEMPLATES)) {
    const list = Object.keys(TEMPLATES).join(', ');
    return new NextResponse(`Unknown template. Available: ${list}`, { status: 400 });
  }

  const html = TEMPLATES[template]();
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
