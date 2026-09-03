import {
  Body,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { EMAIL_COLORS as C, EMAIL_FONT } from '../theme';

export type EmailLayoutProps = {
  previewText?: string;
  unsubscribeUrl?: string;
  appBaseUrl: string;
  children: React.ReactNode;
};

export function EmailLayout({
  previewText,
  unsubscribeUrl,
  appBaseUrl,
  children,
}: EmailLayoutProps) {
  return (
    <Html lang='en'>
      <Head>
        <Font
          fontFamily='Syne'
          fallbackFontFamily='Arial'
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap',
            format: 'woff2',
          }}
        />
      </Head>
      {previewText ? <Preview>{previewText}</Preview> : null}
      <Body style={{ backgroundColor: C.bg, margin: 0, padding: 0, fontFamily: EMAIL_FONT }}>
        <Container
          style={{
            maxWidth: '560px',
            width: '100%',
            margin: '40px auto',
            backgroundColor: C.surface,
            borderRadius: '12px',
            border: `1px solid ${C.border}`,
            overflow: 'hidden',
          }}
        >
          <Section style={{ padding: '24px 40px', borderBottom: `1px solid ${C.border}` }}>
            <Text
              style={{
                margin: 0,
                fontSize: '13px',
                fontWeight: 700,
                color: C.text,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                fontFamily: EMAIL_FONT,
              }}
            >
              Tope Akinkuade
            </Text>
          </Section>

          <Section style={{ padding: '36px 40px' }}>{children}</Section>

          <Hr style={{ borderColor: C.border, margin: 0 }} />

          <Section style={{ padding: '20px 40px', backgroundColor: C.bg }}>
            <Text style={{ margin: '0 0 8px', fontSize: '12px', color: C.textDim, lineHeight: 1.7, fontFamily: EMAIL_FONT }}>
              You received this because you subscribed at{' '}
              <Link href={appBaseUrl} style={{ color: C.textMuted }}>
                {appBaseUrl}
              </Link>
              .
            </Text>
            <Text style={{ margin: 0, fontSize: '12px', color: C.textDim, lineHeight: 1.7, fontFamily: EMAIL_FONT }}>
              {unsubscribeUrl ? (
                <>
                  <Link href={unsubscribeUrl} style={{ color: C.textMuted }}>
                    Unsubscribe
                  </Link>
                  {' · '}
                </>
              ) : null}
              <Link href={appBaseUrl} style={{ color: C.textMuted }}>
                Visit site
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
