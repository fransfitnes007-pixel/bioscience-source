
-- =========================================================
-- 1) affiliate_resources: require authentication to read
-- =========================================================
DROP POLICY IF EXISTS "res public read" ON public.affiliate_resources;
CREATE POLICY "res authenticated read"
  ON public.affiliate_resources
  FOR SELECT
  TO authenticated
  USING (active = true);

-- =========================================================
-- 2) affiliates: prevent self-insert from setting financial fields
-- =========================================================
CREATE OR REPLACE FUNCTION public.enforce_affiliate_self_insert_defaults()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    NEW.status := 'pending';
    NEW.is_active := false;
    NEW.commission_rate := NULL;
    NEW.custom_commission_rate := NULL;
    NEW.tier := NULL;
    NEW.total_earnings := 0;
    NEW.total_orders := 0;
    NEW.total_clicks := 0;
    NEW.total_conversions := 0;
    NEW.total_gross_cents := 0;
    NEW.total_commission_cents := 0;
    NEW.total_paid_cents := 0;
    NEW.approved_at := NULL;
    NEW.approved_by := NULL;
    NEW.reviewed_at := NULL;
    NEW.reviewed_by := NULL;
    NEW.tax_form_filed := false;
    NEW.tax_form_url := NULL;
    NEW.internal_notes := NULL;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.enforce_affiliate_self_insert_defaults() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_enforce_affiliate_self_insert_defaults ON public.affiliates;
CREATE TRIGGER trg_enforce_affiliate_self_insert_defaults
  BEFORE INSERT ON public.affiliates
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_affiliate_self_insert_defaults();

-- =========================================================
-- 3) payout_methods: block affiliates from flipping verification flags
-- =========================================================
CREATE OR REPLACE FUNCTION public.enforce_payout_method_protected_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    IF TG_OP = 'INSERT' THEN
      NEW.is_verified := false;
      NEW.stripe_connect_payouts_enabled := false;
      NEW.verified_at := NULL;
    ELSIF TG_OP = 'UPDATE' THEN
      NEW.is_verified := OLD.is_verified;
      NEW.stripe_connect_payouts_enabled := OLD.stripe_connect_payouts_enabled;
      NEW.verified_at := OLD.verified_at;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.enforce_payout_method_protected_fields() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_payout_method_protected_fields_ins ON public.payout_methods;
DROP TRIGGER IF EXISTS trg_payout_method_protected_fields_upd ON public.payout_methods;
CREATE TRIGGER trg_payout_method_protected_fields_ins
  BEFORE INSERT ON public.payout_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_payout_method_protected_fields();
CREATE TRIGGER trg_payout_method_protected_fields_upd
  BEFORE UPDATE ON public.payout_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_payout_method_protected_fields();

-- =========================================================
-- 4) tracking_links: stop exposing business metrics to anon
--    Replace anon SELECT policy with a SECURITY DEFINER resolver
--    that returns only the minimum fields needed for redirects.
-- =========================================================
DROP POLICY IF EXISTS "links public read active" ON public.tracking_links;

CREATE OR REPLACE FUNCTION public.resolve_tracking_link(_slug text)
RETURNS TABLE (
  id uuid,
  affiliate_id uuid,
  code_id uuid,
  destination_url text,
  active boolean,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    tl.id,
    tl.affiliate_id,
    tl.code_id,
    tl.destination_url,
    tl.active,
    tl.utm_source,
    tl.utm_medium,
    tl.utm_campaign,
    tl.utm_content
  FROM public.tracking_links tl
  WHERE tl.short_slug = _slug
    AND tl.active = true
  LIMIT 1;
$$;
REVOKE EXECUTE ON FUNCTION public.resolve_tracking_link(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_tracking_link(text) TO anon, authenticated;

-- =========================================================
-- 5) content-files storage: add explicit public-read policy
-- =========================================================
DROP POLICY IF EXISTS "content-files public read" ON storage.objects;
CREATE POLICY "content-files public read"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'content-files');

-- =========================================================
-- 6) Revoke EXECUTE on internal SECURITY DEFINER helpers
--    Keep has_role + is_approved usable by authenticated (client-side checks).
--    Trigger functions and server/edge-only helpers are locked down.
-- =========================================================
REVOKE EXECUTE ON FUNCTION public.validate_discount_code(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_supplier(uuid)            FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_supplier_id(uuid)        FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_all_customer_leads()     FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recompute_affiliate_tier(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.refresh_affiliate_totals(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb)     FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint)     FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb)   FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user()            FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.auto_grant_owner_admin()     FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_refresh_affiliate_totals() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.record_affiliate_earning()   FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column()   FROM PUBLIC, anon, authenticated;

-- has_role + is_approved remain callable by authenticated (used by client UI)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_approved(uuid)        TO authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_approved(uuid)        FROM PUBLIC, anon;
