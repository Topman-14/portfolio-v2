import { EMAIL_COLORS as C } from '../index';

const FONT = "'Syne', 'Trebuchet MS', Arial, Helvetica, sans-serif";

export type PasswordResetTemplateParams = {
  resetUrl: string;
};

export function passwordResetTemplate({ resetUrl }: PasswordResetTemplateParams): {
  subject: string;
  previewText: string;
  html: string;
} {
  return {
    subject: 'Reset your password',
    previewText: 'You requested a password reset. The link expires in 1 hour.',
    html: `
      <h1 style="margin:0 0 16px;font-size:28px;font-weight:600;color:${C.black};line-height:1.2;letter-spacing:-0.6px;font-family:${FONT};">
        Reset your password
      </h1>
      <p style="margin:0 0 32px;font-size:15px;color:${C.textMuted};line-height:1.75;font-family:${FONT};">
        You requested a password reset. Click the button below to set a new one. This link expires in <strong style="color:${C.black};font-weight:600;">1 hour</strong>.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
        <tr>
          <td style="border-radius:8px;background-color:${C.malachite};">
            <a href="${resetUrl}" style="display:block;padding:15px 28px;font-size:15px;font-weight:700;color:#020202;text-decoration:none;border-radius:8px;letter-spacing:-0.1px;font-family:${FONT};">
              Set new password &#8594;
            </a>
          </td>
        </tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
        <tr>
          <td style="background-color:{C.textMuted};border:1px solid #222222;border-radius:8px;padding:16px 18px;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:${C.textMuted};text-transform:uppercase;letter-spacing:1px;font-family:${FONT};">Or copy this link</p>
            <p style="margin:0;font-size:12px;color:${C.textDim};word-break:break-all;line-height:1.6;font-family:'Courier New',Courier,monospace;">${resetUrl}</p>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-size:13px;color:${C.textMuted};line-height:1.7;font-family:${FONT};">
        If you didn't request this, you can safely ignore this email. Your password won't change.
      </p>
    `,
  };
}
