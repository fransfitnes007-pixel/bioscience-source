-- =============================================
-- CONTACT MESSAGES TABLE
-- =============================================

CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  source_page TEXT,
  session_id TEXT,
  visitor_id TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact messages" ON public.contact_messages FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE INDEX idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX idx_contact_messages_created ON public.contact_messages(created_at DESC);

-- =============================================
-- WEBHOOK LOGS TABLE (for Vellum integration)
-- =============================================

CREATE TABLE public.webhook_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_type TEXT NOT NULL,
  endpoint_url TEXT NOT NULL,
  request_payload JSONB,
  response_payload JSONB,
  response_status INTEGER,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  triggered_by TEXT,
  related_table TEXT,
  related_id UUID,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage webhook logs" ON public.webhook_logs FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE INDEX idx_webhook_logs_type ON public.webhook_logs(webhook_type);
CREATE INDEX idx_webhook_logs_created ON public.webhook_logs(created_at DESC);
CREATE INDEX idx_webhook_logs_related ON public.webhook_logs(related_table, related_id);

-- =============================================
-- UNIFIED CUSTOMER LEADS VIEW (for Vellum AI)
-- =============================================

CREATE OR REPLACE VIEW public.all_customer_leads AS
SELECT 
  'application' as lead_type,
  a.id,
  a.contact_name as name,
  a.email,
  a.phone,
  a.business_name,
  a.business_type,
  a.business_address,
  a.city,
  a.state,
  a.zip_code,
  a.country,
  a.products_interest,
  a.product_usage,
  a.how_we_benefit,
  a.company_impact,
  a.monthly_volume,
  a.website,
  a.referral_source,
  a.intended_use,
  a.notes,
  a.status::text as status,
  NULL::uuid as user_id,
  a.created_at
FROM public.applications a

UNION ALL

SELECT 
  'inquiry' as lead_type,
  i.id,
  i.name,
  i.email,
  i.phone,
  i.business_name,
  NULL as business_type,
  NULL as business_address,
  NULL as city,
  NULL as state,
  NULL as zip_code,
  NULL as country,
  i.product_name as products_interest,
  NULL as product_usage,
  NULL as how_we_benefit,
  NULL as company_impact,
  NULL as monthly_volume,
  NULL as website,
  NULL as referral_source,
  NULL as intended_use,
  i.message as notes,
  i.status as status,
  i.user_id,
  i.created_at
FROM public.inquiries i

UNION ALL

SELECT 
  'contact' as lead_type,
  c.id,
  c.name,
  c.email,
  c.phone,
  NULL as business_name,
  NULL as business_type,
  NULL as business_address,
  NULL as city,
  NULL as state,
  NULL as zip_code,
  NULL as country,
  NULL as products_interest,
  NULL as product_usage,
  NULL as how_we_benefit,
  NULL as company_impact,
  NULL as monthly_volume,
  NULL as website,
  NULL as referral_source,
  NULL as intended_use,
  c.message as notes,
  c.status as status,
  NULL::uuid as user_id,
  c.created_at
FROM public.contact_messages c

UNION ALL

SELECT 
  'registered_user' as lead_type,
  p.id,
  CONCAT(p.first_name, ' ', p.last_name) as name,
  p.business_email as email,
  p.phone,
  p.business_name,
  NULL as business_type,
  NULL as business_address,
  NULL as city,
  NULL as state,
  NULL as zip_code,
  p.country,
  NULL as products_interest,
  NULL as product_usage,
  NULL as how_we_benefit,
  NULL as company_impact,
  NULL as monthly_volume,
  p.website,
  NULL as referral_source,
  NULL as intended_use,
  NULL as notes,
  p.status::text as status,
  p.user_id,
  p.created_at
FROM public.profiles p;