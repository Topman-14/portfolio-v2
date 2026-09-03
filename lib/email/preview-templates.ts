export const EMAIL_PREVIEW_TEMPLATES = [
  { id: 'newsletter-welcome', label: 'Newsletter welcome' },
  { id: 'password-reset', label: 'Password reset' },
] as const;

export type EmailPreviewTemplateId = (typeof EMAIL_PREVIEW_TEMPLATES)[number]['id'];
