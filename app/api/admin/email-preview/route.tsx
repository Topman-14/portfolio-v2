import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { checkAuthentication } from '@/lib/prismadb';
import { NewsletterWelcomeEmail } from '@/lib/email/templates/newsletter-welcome';
import { PasswordResetEmail } from '@/lib/email/templates/password-reset';
import { getAppBaseUrl } from '@/lib/email';
import { EMAIL_PREVIEW_TEMPLATES, type EmailPreviewTemplateId } from '@/lib/email/preview-templates';

const RENDERERS: Record<EmailPreviewTemplateId, () => Promise<string>> = {
  'newsletter-welcome': () => {
    const appBaseUrl = getAppBaseUrl();
    return render(
      <NewsletterWelcomeEmail
        blogUrl={`${appBaseUrl}/blog`}
        unsubscribeUrl={`${appBaseUrl}/unsubscribe?email=preview%40example.com`}
        appBaseUrl={appBaseUrl}
      />
    );
  },
  'password-reset': () => {
    const appBaseUrl = getAppBaseUrl();
    return render(
      <PasswordResetEmail
        resetUrl={`${appBaseUrl}/auth/reset-password?token=preview-token-123`}
        appBaseUrl={appBaseUrl}
      />
    );
  },
};

export async function GET(request: Request) {
  try {
    await checkAuthentication();
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const template = searchParams.get('t') as EmailPreviewTemplateId | null;

  if (!template || !(template in RENDERERS)) {
    const list = EMAIL_PREVIEW_TEMPLATES.map((t) => t.id).join(', ');
    return NextResponse.json({ message: `Unknown template. Available: ${list}` }, { status: 400 });
  }

  const html = await RENDERERS[template]();
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
