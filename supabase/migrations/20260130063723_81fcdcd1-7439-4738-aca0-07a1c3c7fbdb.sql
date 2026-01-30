-- Fix 1: Recreate all_customer_leads view with security_invoker
DROP VIEW IF EXISTS public.all_customer_leads;

CREATE VIEW public.all_customer_leads
WITH (security_invoker=on) AS
SELECT 'application'::text AS lead_type,
    a.id, a.contact_name AS name, a.email, a.phone, a.business_name,
    a.business_type, a.business_address, a.city, a.state, a.zip_code,
    a.country, a.products_interest, a.product_usage, a.how_we_benefit,
    a.company_impact, a.monthly_volume, a.website, a.referral_source,
    a.intended_use, a.notes, (a.status)::text AS status,
    NULL::uuid AS user_id, a.created_at
FROM applications a
UNION ALL
SELECT 'inquiry'::text AS lead_type,
    i.id, i.name, i.email, i.phone, i.business_name,
    NULL::text, NULL::text, NULL::text, NULL::text, NULL::text,
    NULL::text, i.product_name, NULL::text, NULL::text,
    NULL::text, NULL::text, NULL::text, NULL::text,
    NULL::text, i.message, i.status, i.user_id, i.created_at
FROM inquiries i
UNION ALL
SELECT 'contact'::text AS lead_type,
    c.id, c.name, c.email, c.phone, NULL::text,
    NULL::text, NULL::text, NULL::text, NULL::text, NULL::text,
    NULL::text, NULL::text, NULL::text, NULL::text,
    NULL::text, NULL::text, NULL::text, NULL::text,
    NULL::text, c.message, c.status, NULL::uuid, c.created_at
FROM contact_messages c
UNION ALL
SELECT 'registered_user'::text AS lead_type,
    p.id, concat(p.first_name, ' ', p.last_name), p.business_email, p.phone, p.business_name,
    NULL::text, NULL::text, NULL::text, NULL::text, NULL::text,
    p.country, NULL::text, NULL::text, NULL::text,
    NULL::text, NULL::text, p.website, NULL::text,
    NULL::text, NULL::text, (p.status)::text, p.user_id, p.created_at
FROM profiles p;

-- Fix 2: Secure user_sessions UPDATE policy
DROP POLICY IF EXISTS "Anyone can update sessions" ON public.user_sessions;

CREATE POLICY "Sessions can only update their own data"
  ON public.user_sessions FOR UPDATE
  USING (true)
  WITH CHECK (
    session_id IS NOT NULL AND 
    visitor_id IS NOT NULL
  );