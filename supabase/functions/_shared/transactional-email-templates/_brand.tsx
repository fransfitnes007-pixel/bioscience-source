import * as React from 'npm:react@18.3.1'
import { Img } from 'npm:@react-email/components@0.0.22'
import * as S from './_styles.ts'

const ASSET_BASE_URL = 'https://resurrectedlabz.com'
const RL_MARK_URL = `${ASSET_BASE_URL}/__l5e/assets-v1/39286c37-ddd7-4383-a875-0840cdceccc3/resurrected-labz-email-rl-mark.png`
const WORDMARK_URL = `${ASSET_BASE_URL}/__l5e/assets-v1/e7b81120-c8c3-4201-a806-3470c6784176/resurrected-labz-email-wordmark.png`

export const BrandHeader = () => (
  <div style={S.logoSection}>
    <div style={S.brandPanel}>
      <Img src={RL_MARK_URL} width="42" height="29" alt="RL" style={S.rlMark} />
      <Img src={WORDMARK_URL} width="252" height="93" alt="Resurrected Labz" style={S.brandLogo} />
    </div>
  </div>
)
