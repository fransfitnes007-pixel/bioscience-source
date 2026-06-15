import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrderItem {
  name: string;
  strength: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface OrderConfirmationEmailProps {
  recipientName?: string;
  orderNumber?: string;
  orderDate?: string;
  items?: OrderItem[];
  subtotal?: number;
  shipping?: number;
  tax?: number;
  total?: number;
  shippingAddress?: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  trackingNumber?: string;
  trackingUrl?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://resurrectedlabz.com";

export const OrderConfirmationEmail = ({
  recipientName = "Researcher",
  orderNumber = "RL-78234",
  orderDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  items = [
    { name: "GLP1-SEMA", strength: "5mg", quantity: 1, price: 65 },
    { name: "BPC-157", strength: "10mg", quantity: 1, price: 70 },
  ],
  subtotal = 135,
  shipping = 0,
  tax = 0,
  total = 135,
  shippingAddress = {
    name: "John Doe",
    line1: "123 Research Blvd",
    line2: "Suite 400",
    city: "Austin",
    state: "TX",
    zip: "78701",
    country: "USA",
  },
  trackingNumber = "1Z999AA10123456784",
  trackingUrl = "https://www.ups.com/track?tracknum=1Z999AA10123456784",
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Resurrected Labs order {orderNumber} is confirmed</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Img
              src={`${baseUrl}/resurrected-logo-full.png`}
              width="200"
              height="40"
              alt="Resurrected Labs"
              style={logo}
            />
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Heading style={heading}>Order Confirmed</Heading>
            <Text style={subheading}>
              Thank you, <span style={accentText}>{recipientName}</span>. Your order is confirmed and being prepared.
            </Text>
            <Text style={orderMeta}>
              Order <strong style={strongWhite}>#{orderNumber}</strong> &middot; {orderDate}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Items */}
          <Section style={section}>
            <Text style={sectionTitle}>Order Summary</Text>
            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Column style={itemImageCol}>
                  {item.imageUrl ? (
                    <Img src={item.imageUrl} width="56" height="56" alt={item.name} style={itemImage} />
                  ) : (
                    <div style={placeholderImage}>
                      <Text style={placeholderText}>{item.name.slice(0, 2).toUpperCase()}</Text>
                    </div>
                  )}
                </Column>
                <Column style={itemDetailsCol}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemMeta}>{item.strength} &middot; Qty {item.quantity}</Text>
                </Column>
                <Column style={itemPriceCol}>
                  <Text style={itemPrice}>${item.price.toFixed(2)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Totals */}
          <Section style={totalsSection}>
            <Row style={totalRow}>
              <Text style={totalLabel}>Subtotal</Text>
              <Text style={totalValue}>${subtotal.toFixed(2)}</Text>
            </Row>
            <Row style={totalRow}>
              <Text style={totalLabel}>Shipping</Text>
              <Text style={totalValue}>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</Text>
            </Row>
            {tax > 0 && (
              <Row style={totalRow}>
                <Text style={totalLabel}>Tax</Text>
                <Text style={totalValue}>${tax.toFixed(2)}</Text>
              </Row>
            )}
            <Hr style={hrLight} />
            <Row style={totalRow}>
              <Text style={grandTotalLabel}>Total</Text>
              <Text style={grandTotalValue}>${total.toFixed(2)}</Text>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Tracking */}
          <Section style={section}>
            <Text style={sectionTitle}>Shipping & Tracking</Text>
            <div style={trackingCard}>
              <Text style={trackingLabel}>Tracking Number</Text>
              <Text style={trackingNumberStyle}>{trackingNumber}</Text>
              <Button href={trackingUrl} style={trackButton}>
                Track Package
              </Button>
              {/* Static map representation */}
              <div style={mapContainer}>
                <Img
                  src={`https://maps.googleapis.com/maps/api/staticmap?size=520x200&scale=2&path=color:0xFFFFFF|weight:2|Austin,TX|Dallas,TX&markers=color:white|label:A|Austin,TX&markers=color:white|label:B|Dallas,TX&style=feature:all|element:all|invert_lightness:true|saturation:-100&key=YOUR_API_KEY`}
                  width="520"
                  height="200"
                  alt="Shipping route map"
                  style={mapImage}
                />
                <div style={mapOverlay}>
                  <Text style={mapText}>Route in progress</Text>
                </div>
              </div>
            </div>
          </Section>

          <Hr style={hr} />

          {/* Shipping Address */}
          <Section style={section}>
            <Text style={sectionTitle}>Shipping To</Text>
            <div style={addressCard}>
              <Text style={addressName}>{shippingAddress.name}</Text>
              <Text style={addressLine}>{shippingAddress.line1}</Text>
              {shippingAddress.line2 && <Text style={addressLine}>{shippingAddress.line2}</Text>}
              <Text style={addressLine}>
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
              </Text>
              <Text style={addressLine}>{shippingAddress.country}</Text>
            </div>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Questions about your order?{" "}
              <Link href="mailto:support@resurrectedlabz.com" style={link}>
                Contact support
              </Link>
            </Text>
            <Text style={footerMuted}>
              Resurrected Labs &middot; Research, refined.
            </Text>
            <Text style={footerMuted}>
              <Link href="https://resurrectedlabz.com" style={linkMuted}>Website</Link>
              {" "}&middot;{" "}
              <Link href="https://resurrectedlabz.com/sms-terms" style={linkMuted}>SMS Terms</Link>
              {" "}&middot;{" "}
              <Link href="https://resurrectedlabz.com/privacy" style={linkMuted}>Privacy</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;

/* ─── Styles ─── */
const main: React.CSSProperties = {
  backgroundColor: "#000000",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color: "#f5f5f5",
  lineHeight: "1.5",
  margin: "0 auto",
  padding: "0",
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px 24px",
  backgroundColor: "#000000",
};

const logoSection: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "32px",
};

const logo: React.CSSProperties = {
  margin: "0 auto",
  filter: "brightness(1.2)",
};

const heroSection: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "24px",
};

const heading: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "600",
  color: "#ffffff",
  margin: "0 0 8px 0",
  letterSpacing: "-0.02em",
  lineHeight: "1.2",
};

const subheading: React.CSSProperties = {
  fontSize: "15px",
  color: "#a1a1aa",
  margin: "0 0 12px 0",
  lineHeight: "1.5",
};

const accentText: React.CSSProperties = {
  color: "#ffffff",
  fontWeight: "500",
};

const orderMeta: React.CSSProperties = {
  fontSize: "13px",
  color: "#71717a",
  margin: "0",
};

const strongWhite: React.CSSProperties = {
  color: "#ffffff",
  fontWeight: "600",
};

const hr: React.CSSProperties = {
  borderColor: "#27272a",
  borderWidth: "0 0 1px 0",
  margin: "28px 0",
};

const hrLight: React.CSSProperties = {
  borderColor: "#27272a",
  borderWidth: "0 0 1px 0",
  margin: "12px 0",
};

const section: React.CSSProperties = {
  marginBottom: "8px",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  color: "#71717a",
  margin: "0 0 16px 0",
  fontWeight: "600",
};

const itemRow: React.CSSProperties = {
  marginBottom: "16px",
  backgroundColor: "#09090b",
  border: "1px solid #18181b",
  borderRadius: "8px",
  padding: "12px",
};

const itemImageCol: React.CSSProperties = {
  width: "56px",
  verticalAlign: "middle",
};

const itemImage: React.CSSProperties = {
  borderRadius: "6px",
  display: "block",
};

const placeholderImage: React.CSSProperties = {
  width: "56px",
  height: "56px",
  borderRadius: "6px",
  backgroundColor: "#18181b",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #27272a",
};

const placeholderText: React.CSSProperties = {
  fontSize: "11px",
  color: "#71717a",
  margin: "0",
  fontWeight: "600",
};

const itemDetailsCol: React.CSSProperties = {
  paddingLeft: "12px",
  verticalAlign: "middle",
};

const itemName: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#ffffff",
  margin: "0 0 2px 0",
};

const itemMeta: React.CSSProperties = {
  fontSize: "12px",
  color: "#a1a1aa",
  margin: "0",
};

const itemPriceCol: React.CSSProperties = {
  textAlign: "right" as const,
  verticalAlign: "middle",
  width: "80px",
};

const itemPrice: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#ffffff",
  margin: "0",
};

const totalsSection: React.CSSProperties = {
  backgroundColor: "#09090b",
  border: "1px solid #18181b",
  borderRadius: "8px",
  padding: "16px",
  marginTop: "8px",
};

const totalRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

const totalLabel: React.CSSProperties = {
  fontSize: "13px",
  color: "#a1a1aa",
  margin: "0",
};

const totalValue: React.CSSProperties = {
  fontSize: "13px",
  color: "#ffffff",
  margin: "0",
  fontWeight: "500",
};

const grandTotalLabel: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "700",
  color: "#ffffff",
  margin: "0",
};

const grandTotalValue: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "700",
  color: "#ffffff",
  margin: "0",
};

const trackingCard: React.CSSProperties = {
  backgroundColor: "#09090b",
  border: "1px solid #18181b",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center" as const,
};

const trackingLabel: React.CSSProperties = {
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  color: "#71717a",
  margin: "0 0 6px 0",
  fontWeight: "600",
};

const trackingNumberStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#ffffff",
  margin: "0 0 16px 0",
  fontFamily: "'SF Mono', monospace",
  letterSpacing: "0.02em",
};

const trackButton: React.CSSProperties = {
  backgroundColor: "#ffffff",
  color: "#000000",
  padding: "10px 28px",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
  marginBottom: "20px",
};

const mapContainer: React.CSSProperties = {
  position: "relative",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #18181b",
  backgroundColor: "#000000",
};

const mapImage: React.CSSProperties = {
  width: "100%",
  height: "auto",
  display: "block",
  borderRadius: "8px",
  filter: "grayscale(1) contrast(1.1)",
  opacity: "0.7",
};

const mapOverlay: React.CSSProperties = {
  position: "absolute",
  bottom: "0",
  left: "0",
  right: "0",
  padding: "12px 16px",
  background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
  borderRadius: "0 0 8px 8px",
};

const mapText: React.CSSProperties = {
  fontSize: "11px",
  color: "#a1a1aa",
  margin: "0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
};

const addressCard: React.CSSProperties = {
  backgroundColor: "#09090b",
  border: "1px solid #18181b",
  borderRadius: "8px",
  padding: "16px 20px",
};

const addressName: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#ffffff",
  margin: "0 0 6px 0",
};

const addressLine: React.CSSProperties = {
  fontSize: "13px",
  color: "#a1a1aa",
  margin: "0 0 2px 0",
};

const footerSection: React.CSSProperties = {
  textAlign: "center" as const,
  marginTop: "8px",
};

const footerText: React.CSSProperties = {
  fontSize: "13px",
  color: "#a1a1aa",
  margin: "0 0 8px 0",
};

const footerMuted: React.CSSProperties = {
  fontSize: "11px",
  color: "#52525b",
  margin: "0 0 4px 0",
};

const link: React.CSSProperties = {
  color: "#ffffff",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
};

const linkMuted: React.CSSProperties = {
  color: "#52525b",
  textDecoration: "none",
};
