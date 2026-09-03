import { Button, Row, Section, Text } from '@react-email/components';
import { EmailLayout } from '../components/email-layout';
import { EMAIL_COLORS as C, EMAIL_FONT } from '../theme';

export type NewsletterWelcomeEmailProps = {
  blogUrl: string;
  unsubscribeUrl: string;
  appBaseUrl: string;
};

const POINTS = [
  {
    title: 'Articles on engineering and craft',
    body: 'Deep dives into the tools, decisions, and trade-offs that come with building real products.',
  },
  {
    title: 'Project updates and launches',
    body: "Things I'm shipping, what broke, and what I'd do differently.",
  },
  {
    title: 'Occasional notes',
    body: 'Things I find genuinely interesting - no cadence promises, no growth sequences.',
  },
];

export function NewsletterWelcomeEmail({
  blogUrl,
  unsubscribeUrl,
  appBaseUrl,
}: NewsletterWelcomeEmailProps) {
  return (
    <EmailLayout
      appBaseUrl={appBaseUrl}
      unsubscribeUrl={unsubscribeUrl}
      previewText='Welcome to the list. Here is what to expect from me.'
    >
      <Text style={{ margin: '0 0 20px', fontSize: '22px', fontWeight: 600, color: C.text, lineHeight: 1.3, fontFamily: EMAIL_FONT }}>
        Welcome aboard!
      </Text>

      <Text style={{ margin: '0 0 12px', fontSize: '15px', color: C.textMuted, lineHeight: 1.75, fontFamily: EMAIL_FONT }}>
        Thanks for subscribing. I&apos;m a product engineer who writes about building software,
        shipping things, and the lessons that tend to surface along the way.
      </Text>
      <Text style={{ margin: '0 0 28px', fontSize: '15px', color: C.textMuted, lineHeight: 1.75, fontFamily: EMAIL_FONT }}>
        Here&apos;s what to expect in your inbox:
      </Text>

      <Section style={{ marginBottom: '28px' }}>
        {POINTS.map((point) => (
          <Row key={point.title} style={{ marginBottom: '14px' }}>
            <Text style={{ margin: 0, fontSize: '15px', color: C.text, fontWeight: 600, fontFamily: EMAIL_FONT }}>
              {point.title}
            </Text>
            <Text style={{ margin: '2px 0 0', fontSize: '14px', color: C.textMuted, lineHeight: 1.6, fontFamily: EMAIL_FONT }}>
              {point.body}
            </Text>
          </Row>
        ))}
      </Section>

      <Section style={{ marginBottom: '28px' }}>
        <Button
          href={blogUrl}
          style={{
            display: 'block',
            width: '100%',
            padding: '14px 28px',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: 700,
            color: '#020202',
            backgroundColor: C.malachite,
            borderRadius: '8px',
            textDecoration: 'none',
            fontFamily: EMAIL_FONT,
          }}
        >
          Read the latest posts
        </Button>
      </Section>

      <Text style={{ margin: 0, fontSize: '13px', color: C.textMuted, lineHeight: 1.7, fontFamily: EMAIL_FONT }}>
        Reply to this email any time. I read everything.
      </Text>
    </EmailLayout>
  );
}

export default NewsletterWelcomeEmail;
