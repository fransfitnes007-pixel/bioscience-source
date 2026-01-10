-- Fix the view to use SECURITY INVOKER (default, explicit for clarity)
DROP VIEW IF EXISTS public.all_customer_leads;

CREATE VIEW public.all_customer_leads 
WITH (security_invoker = true)
AS
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