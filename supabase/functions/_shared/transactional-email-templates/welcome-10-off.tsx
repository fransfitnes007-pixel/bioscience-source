import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Img, Link, Preview, Section, Text, Hr, Button,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import * as S from './_styles.ts'

interface Props {
  recipientName?: string
  discountCode?: string
}

const Email = ({ recipientName = 'Researcher', discountCode = 'WELCOME10' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to Resurrected Labs — 10% off your first order</Preview>
    <Body style={S.main}>
      <Section style={S.outerWrap}>
        <Container style={S.container}>
          <Section style={S.logoSection}>
            <Img src={S.LOGO_URL} width="200" height="40" alt="Resurrected Labs" style={S.logo} />
          </Section>
          <Section style={S.hero}>
            <Heading style={S.heading}>Welcome to Resurrected Labs</Heading>
            <Text style={S.subheading}>Research, refined.</Text>
            <Text style={S.bodyText}>
              Hi {recipientName}, thanks for joining. You now have access to premium research peptides — lab-tested for purity and potency.
            </Text>
          </Section>
          <Hr style={S.hr} />
          <Section style={{ ...S.card, textAlign: 'center' as const }}>
            <Text style={{ ...S.sectionTitle, margin: '0 0 8px 0' }}>Exclusive offer</Text>
            <Text style={{ fontSize: '22px', fontWeight: '700', color: '#ffffff', margin: '0 0 8px 0' }}>
              10% off your first order
            </Text>
            <Text style={{ fontSize: '13px', color: '#a1a1aa', margin: '0 0 20px 0' }}>
              Use this code at checkout. Valid for the next 14 days.
            </Text>
            <div style={S.codeBox}><Text style={S.codeText}>{discountCode}</Text></div>
            <br />
            <Button href={`${S.BASE_URL}/products`} style={S.cta}>Shop now</Button>
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
  subject: 'Welcome to Resurrected Labs — 10% off inside',
  displayName: 'Welcome (10% off)',
  previewData: { recipientName: 'Sarah', discountCode: 'WELCOME10' },
} satisfies TemplateEntry
