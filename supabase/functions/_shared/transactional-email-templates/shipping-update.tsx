import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Img, Link, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import * as S from './_styles.ts'

interface Item {
  name: string
  variation?: string
  quantity: number
}

interface Props {
  recipientName?: string
  orderNumber?: string
  carrier?: string
  trackingNumber?: string
  trackingUrl?: string
  mapImageUrl?: string
  estimatedDelivery?: string
  items?: Item[]
}

const Email = ({
  recipientName = 'Researcher',
  orderNumber = 'RL-00000',
  carrier = 'Carrier',
  trackingNumber = '',
  trackingUrl = '#',
  mapImageUrl,
  estimatedDelivery,
  items = [],
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Resurrected Labs order {orderNumber} is on the way</Preview>
    <Body style={S.main}>
      <Section style={S.outerWrap}>
        <Container style={S.container}>
          <Section style={S.logoSection}>
            <Img src={S.LOGO_URL} width="200" height="40" alt="Resurrected Labs" style={S.logo} />
          </Section>
          <Section style={S.hero}>
            <Heading style={S.heading}>On the way</Heading>
            <Text style={S.subheading}>Your order is moving.</Text>
            <Text style={S.bodyText}>
              Hi {recipientName}, order <strong style={{ color: '#fff' }}>#{orderNumber}</strong> just shipped via {carrier}.
            </Text>
          </Section>
          <Hr style={S.hr} />
          <Section style={{ ...S.card, textAlign: 'center' as const }}>
            <Text style={{ ...S.sectionTitle, margin: '0 0 6px 0' }}>Tracking number</Text>
            <Text style={{ fontSize: '16px', fontWeight: '600', color: '#fff', margin: '0 0 16px 0', fontFamily: "'SF Mono', monospace" }}>
              {trackingNumber || '—'}
            </Text>
            {mapImageUrl && (
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #18181b', marginBottom: '16px' }}>
                <Img src={mapImageUrl} width="520" height="200" alt="Shipping route"
                  style={{ width: '100%', height: 'auto', display: 'block', filter: 'grayscale(1) contrast(1.1)', opacity: '0.85' }} />
              </div>
            )}
            <Button href={trackingUrl} style={S.cta}>Track package</Button>
            {estimatedDelivery && (
              <Text style={{ fontSize: '12px', color: '#71717a', margin: '14px 0 0 0' }}>
                Estimated delivery: {estimatedDelivery}
              </Text>
            )}
          </Section>
          {items.length > 0 && (
            <>
              <Hr style={S.hr} />
              <Section>
                <Text style={S.sectionTitle}>Items shipped</Text>
                <div style={S.card}>
                  {items.map((item, i) => (
                    <Text key={i} style={{ fontSize: '13px', color: '#d4d4d8', margin: '0 0 6px 0' }}>
                      {item.name}{item.variation ? ` · ${item.variation}` : ''} · Qty {item.quantity}
                    </Text>
                  ))}
                </div>
              </Section>
            </>
          )}
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
  subject: (d: Props) => `Your order ${d?.orderNumber ?? ''} is on the way`,
  displayName: 'Shipping Update',
  previewData: {
    recipientName: 'Sarah',
    orderNumber: 'RL-78234',
    carrier: 'UPS',
    trackingNumber: '1Z999AA10123456784',
    trackingUrl: 'https://www.ups.com/track?tracknum=1Z999AA10123456784',
    estimatedDelivery: 'Mon, Jun 22',
    items: [
      { name: 'GLP1-SEMA', variation: '5mg', quantity: 1 },
      { name: 'BPC-157', variation: '10mg', quantity: 2 },
    ],
  },
} satisfies TemplateEntry
