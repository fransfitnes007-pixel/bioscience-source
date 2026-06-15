// Shared inline styles for Resurrected Labs branded emails.
// Pearl / glass aesthetic — light, premium product-launch feel.
// Body background stays #ffffff per email infra rules; outer wrap paints the pearl gradient.
import type * as React from 'npm:react@18.3.1'

export const BASE_URL = 'https://resurrectedlabz.com'
export const LOGO_URL = `${BASE_URL}/resurrected-logo-full.png`

// Palette
export const C = {
  pearl1: '#F5F4F2',
  pearl2: '#DDDCD8',
  ink: '#1A1A1A',
  inkSoft: '#3F3F46',
  muted: '#71717A',
  mutedSoft: '#A1A1AA',
  hairline: '#E7E5E1',
  cardBg: '#FFFFFF',
}

export const main: React.CSSProperties = {
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: '0 auto',
  padding: '0',
}

export const outerWrap: React.CSSProperties = {
  background: `linear-gradient(135deg, ${C.pearl1} 0%, ${C.pearl2} 100%)`,
  backgroundColor: C.pearl1,
  padding: '40px 16px',
}

export const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '40px 36px',
  backgroundColor: C.cardBg,
  borderRadius: '20px',
  border: `1px solid ${C.hairline}`,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 12px 40px rgba(40,40,40,0.08)',
  color: C.ink,
}

// Brand header: real Resurrected Labz RL mark + full logo.
export const logoSection: React.CSSProperties = { textAlign: 'center', marginBottom: '30px' }
export const brandPanel: React.CSSProperties = {
  backgroundColor: '#050505',
  borderRadius: '16px',
  padding: '18px 20px 20px',
  textAlign: 'center' as const,
  border: '1px solid rgba(255,255,255,0.10)',
}
export const rlMark: React.CSSProperties = {
  display: 'block',
  margin: '0 auto 10px',
  width: '42px',
  height: '29px',
  objectFit: 'contain' as const,
}
export const brandLogo: React.CSSProperties = {
  display: 'block',
  margin: '0 auto',
  width: '252px',
  maxWidth: '100%',
  height: 'auto',
  objectFit: 'contain' as const,
}
// Kept for back-compat; not used in pearl theme.
export const logo: React.CSSProperties = { margin: '0', display: 'none' }

export const hero: React.CSSProperties = { textAlign: 'left', marginBottom: '8px' }
export const eyebrow: React.CSSProperties = {
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.14em',
  color: C.muted,
  margin: '0 0 12px 0',
  fontWeight: 600,
}
export const heading: React.CSSProperties = {
  fontSize: '34px',
  fontWeight: 700,
  color: C.ink,
  margin: '0 0 12px 0',
  letterSpacing: '-0.025em',
  lineHeight: 1.1,
}
export const subheading: React.CSSProperties = {
  fontSize: '17px',
  color: C.inkSoft,
  margin: '0 0 16px 0',
  fontWeight: 400,
  lineHeight: 1.4,
}
export const bodyText: React.CSSProperties = {
  fontSize: '15px',
  color: C.inkSoft,
  lineHeight: 1.6,
  margin: '0',
}
export const hr: React.CSSProperties = {
  borderColor: C.hairline,
  borderWidth: '0 0 1px 0',
  margin: '28px 0',
}
export const section: React.CSSProperties = { marginBottom: '8px' }
export const sectionTitle: React.CSSProperties = {
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: C.muted,
  margin: '0 0 14px 0',
  fontWeight: 600,
}
// Inner "glass" card on top of the white container — very subtle.
export const card: React.CSSProperties = {
  backgroundColor: '#FAFAF9',
  border: `1px solid ${C.hairline}`,
  borderRadius: '14px',
  padding: '20px',
}
export const cta: React.CSSProperties = {
  backgroundColor: C.ink,
  color: '#FFFFFF',
  padding: '14px 28px',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 600,
  textDecoration: 'none',
  display: 'inline-block',
  letterSpacing: '-0.01em',
}
export const codeBox: React.CSSProperties = {
  display: 'inline-block',
  border: `1px dashed ${C.ink}`,
  borderRadius: '10px',
  padding: '12px 28px',
  marginBottom: '20px',
  backgroundColor: '#FFFFFF',
}
export const codeText: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 700,
  color: C.ink,
  margin: '0',
  fontFamily: "'SF Mono', ui-monospace, Menlo, monospace",
  letterSpacing: '0.12em',
}
export const footerText: React.CSSProperties = {
  fontSize: '13px',
  color: C.muted,
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
}
export const footerMuted: React.CSSProperties = {
  fontSize: '11px',
  color: C.mutedSoft,
  margin: '0 0 4px 0',
  textAlign: 'center' as const,
}
export const link: React.CSSProperties = {
  color: C.ink,
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
}
