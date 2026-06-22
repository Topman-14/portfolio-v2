import { EMAIL_COLORS as C } from '../index';

export type NewsletterWelcomeTemplateParams = {
  unsubscribeUrl: string;
};

export function newsletterWelcomeTemplate({ unsubscribeUrl: _ }: NewsletterWelcomeTemplateParams): {
  subject: string;
  previewText: string;
  html: string;
} {
  return {
    subject: "You're in — welcome to the newsletter",
    previewText: 'Articles, projects, and notes from Tope — straight to your inbox.',
    html: `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
        <tr>
          <td style="height:3px;background:linear-gradient(90deg,${C.malachite},${C.amber});border-radius:2px;"></td>
        </tr>
      </table>

      <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:${C.white};line-height:1.2;letter-spacing:-0.5px;">
        Welcome aboard.
      </h1>
      <p style="margin:0 0 24px;font-size:15px;color:${C.textMuted};line-height:1.7;">
        Thanks for subscribing. I write about building software, shipping products, and the ideas I pick up along the way — usually with a technical slant.
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
        <tr>
          <td style="background-color:${C.surface2};border:1px solid ${C.border};border-radius:10px;padding:20px 22px;">
            <p style="margin:0 0 12px;font-size:12px;color:${C.malachite};font-weight:600;text-transform:uppercase;letter-spacing:1px;">What you'll get</p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr><td style="padding:5px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                  <td style="padding-right:10px;vertical-align:top;"><span style="color:${C.malachite};font-size:14px;">→</span></td>
                  <td><span style="font-size:14px;color:${C.textMuted};line-height:1.6;">New articles and technical posts</span></td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:5px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                  <td style="padding-right:10px;vertical-align:top;"><span style="color:${C.malachite};font-size:14px;">→</span></td>
                  <td><span style="font-size:14px;color:${C.textMuted};line-height:1.6;">Project updates and launches</span></td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:5px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                  <td style="padding-right:10px;vertical-align:top;"><span style="color:${C.malachite};font-size:14px;">→</span></td>
                  <td><span style="font-size:14px;color:${C.textMuted};line-height:1.6;">Occasional notes on things I find interesting</span></td>
                </tr></table>
              </td></tr>
            </table>
          </td>
        </tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td style="border-radius:8px;background-color:${C.malachite};">
            <a href="https://topeakinkuade.com/blog" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#020202;text-decoration:none;border-radius:8px;letter-spacing:-0.2px;">
              Read the latest posts →
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-size:13px;color:${C.textMuted};line-height:1.6;">
        Reply to this email any time — I read every message.
      </p>
    `,
  };
}
