const COLORS = {
  bg: '#020202',
  surface: '#141414',
  border: '#1f1f1f',
  malachite: '#14cc5e',
  amber: '#f4b915',
  white: '#ffffff',
  textMuted: 'rgba(255,255,255,0.65)',
  textDim: 'rgba(255,255,255,0.4)',
};

export function emailLayout(content: string, previewText = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Tope Akinkuade</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    a { color: ${COLORS.malachite}; text-decoration: none; }
    a:hover { text-decoration: underline; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bg};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${COLORS.bg};">${previewText}&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;</div>` : ''}

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.bg};margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Container -->
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${COLORS.surface};border-radius:12px;border:1px solid ${COLORS.border};overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:28px 40px 24px;border-bottom:1px solid ${COLORS.border};" class="mobile-padding">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="font-size:18px;font-weight:700;color:${COLORS.white};letter-spacing:-0.3px;">Tope Akinkuade</span>
                  </td>
                  <td align="right">
                    <span style="font-size:12px;color:${COLORS.textDim};font-weight:500;letter-spacing:1px;text-transform:uppercase;">Newsletter</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;" class="mobile-padding">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid ${COLORS.border};background-color:${COLORS.bg};" class="mobile-padding">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-size:12px;color:${COLORS.textDim};line-height:1.6;">
                      You received this email because you subscribed at
                      <a href="https://topeakinkuade.com" style="color:${COLORS.malachite};">topeakinkuade.com</a>.
                    </p>
                    <p style="margin:0;font-size:12px;color:${COLORS.textDim};line-height:1.6;">
                      <a href="{{unsubscribeUrl}}" style="color:${COLORS.textMuted};">Unsubscribe</a>
                      &nbsp;&middot;&nbsp;
                      <a href="https://topeakinkuade.com" style="color:${COLORS.textMuted};">Visit site</a>
                    </p>
                  </td>
                  <td align="right" valign="top">
                    <span style="font-size:11px;color:${COLORS.textDim};">Lagos, Nigeria</span>
                  </td>
                </tr>
              </table>
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
