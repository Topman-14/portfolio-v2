import { BrevoClient } from '@getbrevo/brevo';
import { emailLayout } from './layout';
import { passwordResetTemplate } from './templates/password-reset';
import { BASE_URL } from '@/config';

export const EMAIL_COLORS = {
  bg: '#eaeaea',
  surface: '#fafafa',
  border: '#1e1e1e',
  surface2: '#1a1a1a',
  malachite: '#14cc5e',
  amber: '#f4b915',
  bittersweet: '#ff715b',
  white: '#ffffff',
  textMuted: '#222',
  textDim: '#1e1e1e',
  black: '#000',
} as const;

export type EmailRecipient = {
  email: string;
  name?: string;
};

export type SendEmailOptions = {
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  html: string;
  previewText?: string;
  from?: EmailRecipient;
  replyTo?: EmailRecipient;
  unsubscribeUrl?: string;
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

  const {
    to,
    subject,
    html,
    previewText,
    from = { email: senderEmail, name: DEFAULT_SENDER_NAME },
    replyTo,
    unsubscribeUrl,
  } = options;

  const recipients = Array.isArray(to) ? to : [to];
  const fullHtml = emailLayout(html, previewText, unsubscribeUrl);
  const client = getClient();

  return client.transactionalEmails.sendTransacEmail({
    sender: { email: from.email, name: from.name },
    to: recipients,
    subject,
    htmlContent: fullHtml,
    ...(replyTo ? { replyTo: { email: replyTo.email, name: replyTo.name } } : {}),
  });
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${getAppBaseUrl()}/auth/reset-password?token=${resetToken}`;
  const { subject, previewText, html } = passwordResetTemplate({ resetUrl });
  return sendEmail({ to: { email }, subject, html, previewText });
}
