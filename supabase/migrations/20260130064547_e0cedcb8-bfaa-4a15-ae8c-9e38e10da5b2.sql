-- Fix: Replace all_customer_leads view with a secure function
-- Views in PostgreSQL don't directly support RLS policies
-- Using a function with admin check provides proper access control

DROP VIEW IF EXISTS public.all_customer_leads;

-- Create a secure function that only admins can use
CREATE OR REPLACE FUNCTION public.get_all_customer_leads()
RETURNS TABLE (
  lead_type text,
  id uuid,
  name text,
  email text,
  phone text,
  business_name text,
  business_type text,
  business_address text,
  city text,
  state text,
  zip_code text,
  country text,
  products_interest text,
  product_usage text,
  how_we_benefit text,
  company_impact text,
  monthly_volume text,
  website text,
  referral_source text,
  intended_use text,
  notes text,
  status text,
  user_id uuid,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Only admins can access this data
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY
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
END;
$$;

-- Grant execute permission to authenticated users (function will check admin role internally)
GRANT EXECUTE ON FUNCTION public.get_all_customer_leads() TO authenticated;