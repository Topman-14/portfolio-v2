import { BrevoClient } from '@getbrevo/brevo';
import { emailLayout } from './layout';
import { passwordResetTemplate } from './templates/password-reset';
import { BASE_URL } from '@/config';

export const EMAIL_COLORS = {
  bg: '#020202',
  surface: '#141414',
  surface2: '#1a1a1a',
  border: '#1f1f1f',
  malachite: '#14cc5e',
  amber: '#f4b915',
  bittersweet: '#ff715b',
  white: '#ffffff',
  textMuted: 'rgba(255,255,255,0.65)',
  textDim: 'rgba(255,255,255,0.4)',
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
};

const DEFAULT_SENDER_NAME = 'Tope Akinkuade';

function getClient(): BrevoClient {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) throw new Error('BREVO_API_KEY is not configured');
  return new BrevoClient({ apiKey });
}

function getAppBaseUrl(): string {
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
  const senderEmail = process.env.GMAIL_USER?.trim();
  if (!senderEmail) throw new Error('Sender email (GMAIL_USER) is not configured');

  const {
    to,
    subject,
    html,
    previewText,
    from = { email: senderEmail, name: DEFAULT_SENDER_NAME },
    replyTo,
  } = options;

  const recipients = Array.isArray(to) ? to : [to];
  const fullHtml = emailLayout(html, previewText);
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
