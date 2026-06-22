import { EMAIL_COLORS as C } from '../index';

export type PasswordResetTemplateParams = {
  resetUrl: string;
};

export function passwordResetTemplate({ resetUrl }: PasswordResetTemplateParams): {
  subject: string;
  previewText: string;
  html: string;
} {
  return {
    subject: 'Reset Your Password',
    previewText: 'You requested a password reset. Click the link inside to get back in.',
    html: `
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:${C.white};line-height:1.2;letter-spacing:-0.5px;">
        Reset your password
      </h1>
      <p style="margin:0 0 28px;font-size:15px;color:${C.textMuted};line-height:1.7;">
        You requested a password reset for your account. Click the button below — it expires in <strong style="color:${C.white};">1 hour</strong>.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td style="border-radius:8px;background-color:${C.malachite};">
            <a href="${resetUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#020202;text-decoration:none;border-radius:8px;letter-spacing:-0.2px;">
              Reset Password
            </a>
          </td>
        </tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
        <tr>
          <td style="background-color:${C.surface2};border:1px solid ${C.border};border-radius:8px;padding:14px 16px;">
            <p style="margin:0 0 4px;font-size:11px;color:${C.textMuted};text-transform:uppercase;letter-spacing:0.8px;">Or copy this link</p>
            <p style="margin:0;font-size:12px;color:${C.malachite};word-break:break-all;line-height:1.5;">${resetUrl}</p>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-size:13px;color:${C.textMuted};line-height:1.6;">
        If you didn't request this, you can safely ignore this email. Your password won't change.
      </p>
    `,
  };
}
