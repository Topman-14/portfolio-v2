import { BrevoClient } from '@getbrevo/brevo';
import { render } from '@react-email/render';
import { BASE_URL } from '@/config';
import { PasswordResetEmail } from './templates/password-reset';
import { NewsletterWelcomeEmail } from './templates/newsletter-welcome';

export type EmailRecipient = {
  email: string;
  name?: string;
};

export type SendEmailOptions = {
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  html: string;
  from?: EmailRecipient;
  replyTo?: EmailRecipient;
};

const DEFAULT_SENDER_NAME = 'Tops';

function getClient(): BrevoClient {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) throw new Error('BREVO_API_KEY is not configured');
  return new BrevoClient({ apiKey });
}

export function getAppBaseUrl(): string {
  if (process.env.NODE_ENV === 'development') return 'http://localhost:8080';
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}`;
  return BASE_URL.replace(/\/$/, '');
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY?.trim() && process.env.GMAIL_USER?.trim());
}

export async function sendEmail(options: SendEmailOptions) {
  const senderEmail = process.env.MAIL_USER?.trim();
  if (!senderEmail) throw new Error('Sender email (MAIL_USER) is not configured');

  const { to, subject, html, from = { email: senderEmail, name: DEFAULT_SENDER_NAME }, replyTo } =
    options;

  const recipients = Array.isArray(to) ? to : [to];
  const client = getClient();

  return client.transactionalEmails.sendTransacEmail({
    sender: { email: from.email, name: from.name },
    to: recipients,
    subject,
    htmlContent: html,
    ...(replyTo ? { replyTo: { email: replyTo.email, name: replyTo.name } } : {}),
  });
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const appBaseUrl = getAppBaseUrl();
  const resetUrl = `${appBaseUrl}/auth/reset-password?token=${resetToken}`;
  const html = await render(<PasswordResetEmail resetUrl={resetUrl} appBaseUrl={appBaseUrl} />);
  return sendEmail({ to: { email }, subject: 'Reset your password', html });
}

export async function sendNewsletterWelcomeEmail(email: string) {
  const appBaseUrl = getAppBaseUrl();
  const unsubscribeUrl = `${appBaseUrl}/unsubscribe?email=${encodeURIComponent(email)}`;
  const html = await render(
    <NewsletterWelcomeEmail
      blogUrl={`${appBaseUrl}/blog`}
      unsubscribeUrl={unsubscribeUrl}
      appBaseUrl={appBaseUrl}
    />
  );
  return sendEmail({ to: { email }, subject: "You're in.", html });
}
