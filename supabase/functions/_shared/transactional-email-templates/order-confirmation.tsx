import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Link, Preview, Section, Text, Hr, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import * as S from './_styles.ts'
import { BrandHeader } from './_brand.tsx'

interface Item {
  name: string
  variation?: string
  quantity: number
  price: number
}

interface Props {
  recipientName?: string
  orderNumber?: string
  orderDate?: string
  items?: Item[]
  subtotal?: number
  discount?: number
  shipping?: number
  total?: number
  shippingAddress?: {
    name?: string
    line1?: string
    line2?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }
}

const fmt = (n: number) => `$${n.toFixed(2)}`

const Email = ({
  recipientName = 'Researcher',
  orderNumber = 'RL-00000',
  orderDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  items = [],
  subtotal = 0,
  discount = 0,
  shipping = 0,
  total = 0,
  shippingAddress,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Order {orderNumber} confirmed — thank you for your order</Preview>
    <Body style={S.main}>
      <Section style={S.outerWrap}>
        <Container style={S.container}>
          <BrandHeader />

          <Section style={S.hero}>
            <Text style={S.eyebrow}>Order confirmed</Text>
            <Heading style={S.heading}>Thank you, {recipientName}.</Heading>
            <Text style={S.subheading}>Your order is being prepared and will ship shortly.</Text>
            <Text style={{ fontSize: '13px', color: S.C.muted, margin: '4px 0 0 0' }}>
              Order <strong style={{ color: S.C.ink }}>#{orderNumber}</strong> · {orderDate}
            </Text>
          </Section>

          <Hr style={S.hr} />

          <Section>
            <Text style={S.sectionTitle}>Order summary</Text>
            {items.map((item, i) => (
              <Row key={i} style={{ ...S.card, marginBottom: '10px', padding: '14px' }}>
                <Column>
                  <Text style={{ fontSize: '14px', fontWeight: 600, color: S.C.ink, margin: '0 0 2px 0' }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: '12px', color: S.C.muted, margin: '0' }}>
                    {item.variation ? `${item.variation} · ` : ''}Qty {item.quantity}
                  </Text>
                </Column>
                <Column style={{ textAlign: 'right' as const, verticalAlign: 'middle' }}>
                  <Text style={{ fontSize: '14px', fontWeight: 600, color: S.C.ink, margin: '0' }}>
                    {fmt(item.price)}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Section style={{ ...S.card, marginTop: '8px' }}>
            <Row>
              <Column><Text style={{ fontSize: '13px', color: S.C.muted, margin: '0 0 8px 0' }}>Subtotal</Text></Column>
              <Column style={{ textAlign: 'right' as const }}><Text style={{ fontSize: '13px', color: S.C.ink, margin: '0 0 8px 0' }}>{fmt(subtotal)}</Text></Column>
            </Row>
            {discount > 0 && (
              <Row>
                <Column><Text style={{ fontSize: '13px', color: S.C.muted, margin: '0 0 8px 0' }}>Discount</Text></Column>
                <Column style={{ textAlign: 'right' as const }}><Text style={{ fontSize: '13px', color: S.C.ink, margin: '0 0 8px 0' }}>-{fmt(discount)}</Text></Column>
              </Row>
            )}
            <Row>
              <Column><Text style={{ fontSize: '13px', color: S.C.muted, margin: '0 0 8px 0' }}>Shipping</Text></Column>
              <Column style={{ textAlign: 'right' as const }}><Text style={{ fontSize: '13px', color: S.C.ink, margin: '0 0 8px 0' }}>{shipping === 0 ? 'Free' : fmt(shipping)}</Text></Column>
            </Row>
            <Hr style={{ ...S.hr, margin: '12px 0' }} />
            <Row>
              <Column><Text style={{ fontSize: '16px', color: S.C.ink, fontWeight: 700, margin: '0' }}>Total</Text></Column>
              <Column style={{ textAlign: 'right' as const }}><Text style={{ fontSize: '16px', color: S.C.ink, fontWeight: 700, margin: '0' }}>{fmt(total)}</Text></Column>
            </Row>
          </Section>

          {shippingAddress && (
            <>
              <Hr style={S.hr} />
              <Section>
                <Text style={S.sectionTitle}>Shipping to</Text>
                <div style={S.card}>
                  {shippingAddress.name && <Text style={{ color: S.C.ink, margin: '0 0 4px 0', fontWeight: 600 }}>{shippingAddress.name}</Text>}
                  {shippingAddress.line1 && <Text style={{ color: S.C.inkSoft, margin: '0', fontSize: '13px' }}>{shippingAddress.line1}</Text>}
                  {shippingAddress.line2 && <Text style={{ color: S.C.inkSoft, margin: '0', fontSize: '13px' }}>{shippingAddress.line2}</Text>}
                  <Text style={{ color: S.C.inkSoft, margin: '0', fontSize: '13px' }}>
                    {[shippingAddress.city, shippingAddress.state, shippingAddress.zip].filter(Boolean).join(', ')}
                  </Text>
                  {shippingAddress.country && <Text style={{ color: S.C.inkSoft, margin: '0', fontSize: '13px' }}>{shippingAddress.country}</Text>}
                </div>
              </Section>
            </>
          )}

          <Hr style={S.hr} />
          <Section>
            <Text style={S.footerText}>
              Need help? Reply to this email or write to{' '}
              <Link href="mailto:support@resurrectedlabz.com" style={S.link}>support@resurrectedlabz.com</Link>
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
  subject: (d: Props) => `Order ${d?.orderNumber ?? ''} confirmed`,
  displayName: 'Order Confirmation',
  previewData: {
    recipientName: 'Sarah',
    orderNumber: 'RL-78234',
    items: [
      { name: 'GLP1-SEMA', variation: '5mg', quantity: 1, price: 65 },
      { name: 'BPC-157', variation: '10mg', quantity: 2, price: 70 },
    ],
    subtotal: 205,
    discount: 20,
    shipping: 0,
    total: 185,
    shippingAddress: {
      name: 'Sarah Chen', line1: '123 Research Blvd', city: 'Austin', state: 'TX', zip: '78701', country: 'USA',
    },
  },
} satisfies TemplateEntry
