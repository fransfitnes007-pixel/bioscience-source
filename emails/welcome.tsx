import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  recipientName?: string;
  discountCode?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://resurrectedlabz.com";

export const WelcomeEmail = ({
  recipientName = "Researcher",
  discountCode = "WELCOME10",
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Resurrected Labs — 10% off your first order</Preview>
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
            <Heading style={heading}>Welcome to Resurrected Labs</Heading>
            <Text style={subheading}>
              Research, <span style={italicMuted}>refined.</span>
            </Text>
            <Text style={bodyText}>
              Hi {recipientName}, thanks for joining us. You now have access to premium research peptides, lab-tested for purity and potency.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Offer */}
          <Section style={offerSection}>
            <Text style={offerLabel}>Exclusive Offer</Text>
            <Text style={offerTitle}>10% Off Your First Order</Text>
            <Text style={offerSubtitle}>
              Use the code below at checkout. Valid for the next 14 days.
            </Text>
            <div style={codeBox}>
              <Text style={codeText}>{discountCode}</Text>
            </div>
            <Button href={`${baseUrl}/products`} style={ctaButton}>
              Shop Now
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Features */}
          <Section style={section}>
            <Text style={sectionTitle}>Why Researchers Choose Us</Text>
            <Row style={featureRow}>
              <Column style={featureCol}>
                <Text style={featureIcon}>●</Text>
                <Text style={featureTitle}>Lab-Tested Purity</Text>
                <Text style={featureDesc}>Every batch verified by third-party HPLC analysis.</Text>
              </Column>
              <Column style={featureCol}>
                <Text style={featureIcon}>●</Text>
                <Text style={featureTitle}>Fast Shipping</Text>
                <Text style={featureDesc}>Same-day dispatch on orders placed before 2 PM CST.</Text>
              </Column>
            </Row>
            <Row style={featureRow}>
              <Column style={featureCol}>
                <Text style={featureIcon}>●</Text>
                <Text style={featureTitle}>Secure Packaging</Text>
                <Text style={featureDesc}>Cold-chain insulated boxes for peptide stability.</Text>
              </Column>
              <Column style={featureCol}>
                <Text style={featureIcon}>●</Text>
                <Text style={featureTitle}>Expert Support</Text>
                <Text style={featureDesc}>Dedicated team to answer your research questions.</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Products teaser */}
          <Section style={section}>
            <Text style={sectionTitle}>Popular This Week</Text>
            <Row style={productRow}>
              <Column style={productCol}>
                <div style={productCard}>
                  <Text style={productName}>GLP1-SEMA</Text>
                  <Text style={productMeta}>5mg &middot; $65</Text>
                </div>
              </Column>
              <Column style={productCol}>
                <div style={productCard}>
                  <Text style={productName}>BPC-157</Text>
                  <Text style={productMeta}>10mg &middot; $70</Text>
                </div>
              </Column>
            </Row>
            <Row style={productRow}>
              <Column style={productCol}>
                <div style={productCard}>
                  <Text style={productName}>GLP1-TRIZ</Text>
                  <Text style={productMeta}>10mg &middot; $75</Text>
                </div>
              </Column>
              <Column style={productCol}>
                <div style={productCard}>
                  <Text style={productName}>CAGRILINTIDE</Text>
                  <Text style={productMeta}>5mg &middot; $90</Text>
                </div>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Questions?{" "}
              <Link href="mailto:support@resurrectedlabz.com" style={link}>
                support@resurrectedlabz.com
              </Link>
            </Text>
            <Text style={footerMuted}>
              Resurrected Labs &middot; Research, refined.
            </Text>
            <Text style={footerMuted}>
              You received this because you signed up at{" "}
              <Link href="https://resurrectedlabz.com" style={linkMuted}>resurrectedlabz.com</Link>.
            </Text>
            <Text style={footerMuted}>
              <Link href="https://resurrectedlabz.com/unsubscribe" style={linkMuted}>Unsubscribe</Link>
              {" "}&middot;{" "}
              <Link href="https://resurrectedlabz.com/privacy" style={linkMuted}>Privacy</Link>
              {" "}&middot;{" "}
              <Link href="https://resurrectedlabz.com/sms-terms" style={linkMuted}>SMS Terms</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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
  margin: "0 0 4px 0",
  letterSpacing: "-0.02em",
  lineHeight: "1.2",
};

const subheading: React.CSSProperties = {
  fontSize: "15px",
  color: "#a1a1aa",
  margin: "0 0 20px 0",
  fontFamily: "'Instrument Serif', Georgia, serif",
  fontStyle: "italic",
  letterSpacing: "-0.01em",
};

const italicMuted: React.CSSProperties = {
  fontStyle: "italic",
  opacity: "0.6",
};

const bodyText: React.CSSProperties = {
  fontSize: "14px",
  color: "#d4d4d8",
  lineHeight: "1.6",
  margin: "0",
};

const hr: React.CSSProperties = {
  borderColor: "#27272a",
  borderWidth: "0 0 1px 0",
  margin: "28px 0",
};

const offerSection: React.CSSProperties = {
  textAlign: "center" as const,
  backgroundColor: "#09090b",
  border: "1px solid #18181b",
  borderRadius: "12px",
  padding: "28px 24px",
};

const offerLabel: React.CSSProperties = {
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.12em",
  color: "#71717a",
  margin: "0 0 8px 0",
  fontWeight: "600",
};

const offerTitle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#ffffff",
  margin: "0 0 8px 0",
  letterSpacing: "-0.01em",
};

const offerSubtitle: React.CSSProperties = {
  fontSize: "13px",
  color: "#a1a1aa",
  margin: "0 0 20px 0",
};

const codeBox: React.CSSProperties = {
  display: "inline-block",
  border: "1px solid #ffffff",
  borderRadius: "6px",
  padding: "10px 24px",
  marginBottom: "20px",
};

const codeText: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#ffffff",
  margin: "0",
  fontFamily: "'SF Mono', monospace",
  letterSpacing: "0.04em",
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#ffffff",
  color: "#000000",
  padding: "12px 32px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
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

const featureRow: React.CSSProperties = {
  marginBottom: "12px",
};

const featureCol: React.CSSProperties = {
  width: "50%",
  paddingRight: "8px",
};

const featureIcon: React.CSSProperties = {
  fontSize: "10px",
  color: "#ffffff",
  margin: "0 0 4px 0",
  lineHeight: "1",
};

const featureTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#ffffff",
  margin: "0 0 2px 0",
};

const featureDesc: React.CSSProperties = {
  fontSize: "12px",
  color: "#a1a1aa",
  margin: "0",
  lineHeight: "1.4",
};

const productRow: React.CSSProperties = {
  marginBottom: "8px",
};

const productCol: React.CSSProperties = {
  width: "50%",
  paddingRight: "4px",
  paddingLeft: "4px",
};

const productCard: React.CSSProperties = {
  backgroundColor: "#09090b",
  border: "1px solid #18181b",
  borderRadius: "8px",
  padding: "14px",
  textAlign: "center" as const,
};

const productName: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#ffffff",
  margin: "0 0 2px 0",
};

const productMeta: React.CSSProperties = {
  fontSize: "11px",
  color: "#71717a",
  margin: "0",
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
