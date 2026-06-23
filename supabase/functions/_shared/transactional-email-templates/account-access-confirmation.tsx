import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import * as S from './_styles.ts'
import { BrandHeader } from './_brand.tsx'

interface Props {
  recipientName?: string
}

const Email = ({ recipientName = 'Researcher' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thank you for signing up — your Resurrected Labs account is ready</Preview>
    <Body style={S.main}>
      <Section style={S.outerWrap}>
        <Container style={S.container}>
          <BrandHeader />

          <Section style={S.hero}>
            <Text style={S.eyebrow}>Account active</Text>
            <Heading style={S.heading}>You now have full access.</Heading>
            <Text style={S.subheading}>
              Hi {recipientName}, thank you for signing up. Your account is active and ready for product access, order history, reorders, tracking, and direct account messages.
            </Text>
          </Section>

          <Hr style={S.hr} />

          <Section style={{ ...S.card, textAlign: 'center' as const }}>
            <Text style={{ fontSize: '15px', color: S.C.inkSoft, margin: '0 0 20px 0', lineHeight: 1.6 }}>
              You can shop now and every order will stay saved inside your account dashboard.
            </Text>
            <Button href={`${S.BASE_URL}/products`} style={S.cta}>Shop products →</Button>
          </Section>

          <Hr style={S.hr} />
          <Section>
            <Text style={S.footerText}>
              Questions? <Link href="mailto:support@resurrectedlabz.com" style={S.link}>support@resurrectedlabz.com</Link>
            </Text>
            <Text style={S.footerMuted}>Resurrected Labs · Research, refined.</Text>
          </Section>
        </Container>
      </Section>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Your Resurrected Labs account is ready',
  displayName: 'Account Access Confirmation',
  previewData: { recipientName: 'Sarah' },
} satisfies TemplateEntry