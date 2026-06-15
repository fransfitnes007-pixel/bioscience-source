// Shared inline styles for Resurrected Labs branded emails.
// Body background MUST stay white per email infra rules; inner card is dark.
import type * as React from 'npm:react@18.3.1'

export const BASE_URL = 'https://resurrectedlabz.com'
export const LOGO_URL = `${BASE_URL}/resurrected-logo-full.png`

export const main: React.CSSProperties = {
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  margin: '0 auto',
  padding: '0',
}

export const outerWrap: React.CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '24px 12px',
}

export const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '40px 24px',
  backgroundColor: '#000000',
  borderRadius: '14px',
  color: '#f5f5f5',
}

export const logoSection: React.CSSProperties = { textAlign: 'center', marginBottom: '32px' }
export const logo: React.CSSProperties = { margin: '0 auto', filter: 'brightness(1.2)' }

export const hero: React.CSSProperties = { textAlign: 'center', marginBottom: '24px' }
export const heading: React.CSSProperties = {
  fontSize: '28px', fontWeight: '600', color: '#ffffff',
  margin: '0 0 8px 0', letterSpacing: '-0.02em', lineHeight: '1.2',
}
export const subheading: React.CSSProperties = {
  fontSize: '15px', color: '#a1a1aa', margin: '0 0 12px 0',
  fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic',
}
export const bodyText: React.CSSProperties = {
  fontSize: '14px', color: '#d4d4d8', lineHeight: '1.6', margin: '0',
}
export const hr: React.CSSProperties = {
  borderColor: '#27272a', borderWidth: '0 0 1px 0', margin: '28px 0',
}
export const section: React.CSSProperties = { marginBottom: '8px' }
export const sectionTitle: React.CSSProperties = {
  fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.08em',
  color: '#71717a', margin: '0 0 16px 0', fontWeight: '600',
}
export const card: React.CSSProperties = {
  backgroundColor: '#09090b', border: '1px solid #18181b',
  borderRadius: '10px', padding: '20px',
}
export const cta: React.CSSProperties = {
  backgroundColor: '#ffffff', color: '#000000',
  padding: '12px 32px', borderRadius: '6px', fontSize: '14px',
  fontWeight: '600', textDecoration: 'none', display: 'inline-block',
}
export const codeBox: React.CSSProperties = {
  display: 'inline-block', border: '1px solid #ffffff', borderRadius: '6px',
  padding: '10px 24px', marginBottom: '20px',
}
export const codeText: React.CSSProperties = {
  fontSize: '20px', fontWeight: '700', color: '#ffffff', margin: '0',
  fontFamily: "'SF Mono', monospace", letterSpacing: '0.08em',
}
export const footerText: React.CSSProperties = {
  fontSize: '13px', color: '#a1a1aa', margin: '0 0 8px 0', textAlign: 'center' as const,
}
export const footerMuted: React.CSSProperties = {
  fontSize: '11px', color: '#52525b', margin: '0 0 4px 0', textAlign: 'center' as const,
}
export const link: React.CSSProperties = {
  color: '#ffffff', textDecoration: 'underline', textUnderlineOffset: '3px',
}
