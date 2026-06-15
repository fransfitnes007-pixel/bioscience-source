import * as React from 'npm:react@18.3.1'
import * as S from './_styles.ts'

export const BrandHeader = () => (
  <div style={S.logoSection}>
    <span style={S.brandRow}>
      <span style={S.chromeDot} />
      <span style={S.wordmark}>Resurrected Labs</span>
    </span>
  </div>
)
