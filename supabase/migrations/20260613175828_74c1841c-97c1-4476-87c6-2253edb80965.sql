
-- 1. DISCOUNTS: remove public read, add SECURITY DEFINER validator
DROP POLICY IF EXISTS "Anyone can view active discounts" ON public.discounts;

CREATE OR REPLACE FUNCTION public.validate_discount_code(_code text)
RETURNS TABLE (
  id uuid,
  code text,
  discount_type text,
  discount_value numeric,
  minimum_purchase_amount numeric,
  applies_to text,
  is_active boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT d.id, d.code, d.discount_type, d.discount_value, d.minimum_purchase_amount, d.applies_to, d.is_active
  FROM public.discounts d
  WHERE upper(d.code) = upper(_code)
    AND d.is_active = true
    AND d.starts_at <= now()
    AND (d.ends_at IS NULL OR d.ends_at > now())
    AND (d.max_uses IS NULL OR d.usage_count < d.max_uses)
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.validate_discount_code(text) FROM public;
GRANT EXECUTE ON FUNCTION public.validate_discount_code(text) TO anon, authenticated;

-- 2. ANALYTICS_EVENTS
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;
CREATE POLICY "Insert analytics events with valid user" ON public.analytics_events
FOR INSERT TO anon, authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- 3. PAGE_VIEWS
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
CREATE POLICY "Insert page views with valid user" ON public.page_views
FOR INSERT TO anon, authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- 4. USER_SESSIONS
DROP POLICY IF EXISTS "Sessions can only update their own data" ON public.user_sessions;
DROP POLICY IF EXISTS "Anyone can insert sessions" ON public.user_sessions;
CREATE POLICY "Insert sessions with valid user" ON public.user_sessions
FOR INSERT TO anon, authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "Users update own sessions" ON public.user_sessions
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 5. AFFILIATE_PROGRAM_SETTINGS
DROP POLICY IF EXISTS "aps public read" ON public.affiliate_program_settings;

-- 6. FORM_SUBMISSIONS
DROP POLICY IF EXISTS "Anyone can insert form submissions" ON public.form_submissions;
CREATE POLICY "Insert form submissions with valid user" ON public.form_submissions
FOR INSERT TO anon, authenticated
WITH CHECK (
  form_type IS NOT NULL
  AND form_name IS NOT NULL
  AND length(form_name) <= 100
  AND (user_id IS NULL OR user_id = auth.uid())
);

-- 7. SECURITY_AUDIT_LOG
DROP POLICY IF EXISTS "Authenticated can insert audit logs" ON public.security_audit_log;
DROP POLICY IF EXISTS "Service role can insert audit logs" ON public.security_audit_log;
CREATE POLICY "Service role inserts audit logs" ON public.security_audit_log
FOR INSERT TO service_role WITH CHECK (true);

-- 8. AFFILIATE_EARNINGS
CREATE POLICY "Affiliate reads own earnings" ON public.affiliate_earnings
FOR SELECT TO authenticated
USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

-- 9. ABANDONED_CHECKOUTS
CREATE POLICY "Users read own abandoned checkouts" ON public.abandoned_checkouts
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- 10. INVENTORY
DROP POLICY IF EXISTS "Anyone can view inventory" ON public.inventory;
CREATE POLICY "Authenticated can view inventory" ON public.inventory
FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.inventory FROM anon;

-- 11. supplier_order_view
ALTER VIEW public.supplier_order_view SET (security_invoker = on);
