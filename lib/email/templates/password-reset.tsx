import { Button, Section, Text } from '@react-email/components';
import { EmailLayout } from '../components/email-layout';
import { EMAIL_COLORS as C, EMAIL_FONT } from '../theme';

export type PasswordResetEmailProps = {
  resetUrl: string;
  appBaseUrl: string;
};

export function PasswordResetEmail({ resetUrl, appBaseUrl }: PasswordResetEmailProps) {
  return (
    <EmailLayout
      appBaseUrl={appBaseUrl}
      previewText='You requested a password reset. The link expires in 1 hour.'
    >
      <Text style={{ margin: '0 0 16px', fontSize: '22px', fontWeight: 600, color: C.text, lineHeight: 1.3, fontFamily: EMAIL_FONT }}>
        Reset your password
      </Text>
      <Text style={{ margin: '0 0 28px', fontSize: '15px', color: C.textMuted, lineHeight: 1.75, fontFamily: EMAIL_FONT }}>
        You requested a password reset. Click the button below to set a new one. This link
        expires in <strong style={{ color: C.text, fontWeight: 600 }}>1 hour</strong>.
      </Text>

      <Section style={{ marginBottom: '24px' }}>
        <Button
          href={resetUrl}
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            fontSize: '15px',
            fontWeight: 700,
            color: '#020202',
            backgroundColor: C.malachite,
            borderRadius: '8px',
            textDecoration: 'none',
            fontFamily: EMAIL_FONT,
          }}
        >
          Set new password
        </Button>
      </Section>

      <Section
        style={{
          backgroundColor: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: '8px',
          padding: '14px 18px',
          marginBottom: '24px',
        }}
      >
        <Text style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: EMAIL_FONT }}>
          Or copy this link
        </Text>
        <Text style={{ margin: 0, fontSize: '12px', color: C.textDim, wordBreak: 'break-all', lineHeight: 1.6, fontFamily: 'monospace' }}>
          {resetUrl}
        </Text>
      </Section>

      <Text style={{ margin: 0, fontSize: '13px', color: C.textMuted, lineHeight: 1.7, fontFamily: EMAIL_FONT }}>
        If you didn&apos;t request this, you can safely ignore this email. Your password
        won&apos;t change.
      </Text>
    </EmailLayout>
  );
}

export default PasswordResetEmail;
