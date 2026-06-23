import { EMAIL_COLORS as C } from '../index';

const FONT = "'Syne', 'Trebuchet MS', Arial, Helvetica, sans-serif";

export type NewsletterWelcomeTemplateParams = {
  unsubscribeUrl: string;
  blogUrl: string;
};

export function newsletterWelcomeTemplate({ blogUrl }: NewsletterWelcomeTemplateParams): {
  subject: string;
  previewText: string;
  html: string;
} {
  return {
    subject: "You're in.",
    previewText: 'Welcome to the list. Here is what to expect from me.',
    html: `
      <h1 style="margin:0 0 20px;font-size:30px;font-weight:600;color:${C.black};line-height:1.15;letter-spacing:-0.8px;font-family:${FONT};">
        Welcome aboard!
      </h1>

      <p style="margin:0 0 12px;font-size:15px;color:${C.textMuted};line-height:1.75;font-family:${FONT};">
        Thanks for subscribing. I'm a product engineer who writes about building software, shipping things, and the lessons that tend to surface along the way.
      </p>
      <p style="margin:0 0 28px;font-size:15px;color:${C.textMuted};line-height:1.75;font-family:${FONT};">
        Here's what to expect in your inbox:
      </p>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:32px;">
        <tr>
          <td style="padding:0 0 14px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="padding-right:12px;vertical-align:top;padding-top:2px;">
                <span style="color:${C.malachite};font-size:14px;font-weight:700;font-family:'Courier New',Courier,monospace;">&#8594;</span>
              </td>
              <td>
                <span style="font-size:15px;color:${C.black};font-weight:600;font-family:${FONT};">Articles on engineering and craft</span>
                <br />
                <span style="font-size:14px;color:${C.textMuted};line-height:1.6;font-family:${FONT};">Deep dives into the tools, decisions, and trade-offs that come with building real products.</span>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 0 14px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="padding-right:12px;vertical-align:top;padding-top:2px;">
                <span style="color:${C.malachite};font-size:14px;font-weight:700;font-family:'Courier New',Courier,monospace;">&#8594;</span>
              </td>
              <td>
                <span style="font-size:15px;color:${C.black};font-weight:600;font-family:${FONT};">Project updates and launches</span>
                <br />
                <span style="font-size:14px;color:${C.textMuted};line-height:1.6;font-family:${FONT};">Things I'm shipping, what broke, and what I'd do differently.</span>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="padding-right:12px;vertical-align:top;padding-top:2px;">
                <span style="color:${C.malachite};font-size:14px;font-weight:700;font-family:'Courier New',Courier,monospace;">&#8594;</span>
              </td>
              <td>
                <span style="font-size:15px;color:${C.black};font-weight:600;font-family:${FONT};">Occasional notes</span>
                <br />
                <span style="font-size:14px;color:${C.textMuted};line-height:1.6;font-family:${FONT};">Things I find genuinely interesting - no cadence promises, no growth sequences.</span>
              </td>
            </tr></table>
          </td>
        </tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:32px;">
        <tr>
          <td style="border-radius:8px;background-color:${C.malachite};">
            <a href="${blogUrl}" style="display:block;padding:15px 28px;font-size:15px;font-weight:700;color:#020202;text-decoration:none;border-radius:8px;letter-spacing:-0.1px;font-family:${FONT};">
              Read the latest posts &#8594;
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-size:13px;color:${C.textMuted};line-height:1.7;font-family:${FONT};">
        Reply to this email any time. I read everything.
      </p>
    `,
  };
}
