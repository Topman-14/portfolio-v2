import { EMAIL_COLORS as COLORS, getAppBaseUrl } from './index';

const FONT = "'Syne', 'Trebuchet MS', Arial, Helvetica, sans-serif";

export function emailLayout(content: string, previewText = '', unsubscribeUrl?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Tope Akinkuade</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    a { color: ${COLORS.malachite}; text-decoration: none; }
    a:hover { text-decoration: underline; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .mobile-padding { padding-left: 24px !important; padding-right: 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bg};font-family:${FONT};">
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${COLORS.black};">${previewText}&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;</div>` : ''}

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.bg};margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:36px 16px 48px;">

        <!-- Container -->
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${COLORS.surface};border-radius:12px;border:1px solid ${COLORS.border};overflow:hidden;">

          <!-- Top accent bar -->
          <tr>
            <td height="3" style="height:3px;background:linear-gradient(90deg,${COLORS.malachite},${COLORS.amber});font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:26px 44px 22px;border-bottom:1px solid ${COLORS.border};" class="mobile-padding">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle">
                    <span style="font-family:${FONT};font-size:13px;font-weight:700;color:${COLORS.black};letter-spacing:1.2px;text-transform:uppercase;">Tope Akinkuade</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 44px;" class="mobile-padding">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:22px 44px 28px;border-top:1px solid ${COLORS.border};background-color:${COLORS.bg};" class="mobile-padding">
              <p style="margin:0 0 8px;font-size:12px;color:${COLORS.textDim};line-height:1.7;font-family:${FONT};">
                You received this because you subscribed at
                <a href="${getAppBaseUrl()}" style="color:${COLORS.textMuted};">${getAppBaseUrl()}</a>.
              </p>
              <p style="margin:0;font-size:12px;color:${COLORS.textDim};line-height:1.7;font-family:${FONT};">
                ${unsubscribeUrl ? `<a href="${unsubscribeUrl}" style="color:${COLORS.textMuted};">Unsubscribe</a>&nbsp;&middot;&nbsp;` : ''}<a href="${getAppBaseUrl()}" style="color:${COLORS.textMuted};">Visit site</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- /Container -->

      </td>
    </tr>
  </table>
</body>
</html>`;
}
