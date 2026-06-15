import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, unknown>
  to?: string | ((data: any) => string)
}

import { template as welcome10Off } from './welcome-10-off.tsx'
import { template as orderConfirmation } from './order-confirmation.tsx'
import { template as shippingUpdate } from './shipping-update.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'welcome-10-off': welcome10Off,
  'order-confirmation': orderConfirmation,
  'shipping-update': shippingUpdate,
}
