
-- 1. site_settings
DROP POLICY IF EXISTS "Anyone can view settings" ON public.site_settings;
CREATE POLICY "Admins can view settings"
  ON public.site_settings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. affiliates
DROP POLICY IF EXISTS "Anyone can submit affiliate applications" ON public.affiliates;
CREATE POLICY "Authenticated users can apply for affiliate"
  ON public.affiliates FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending'
    AND is_active = false
  );

-- 3. payout_methods drop plaid token
ALTER TABLE public.payout_methods DROP COLUMN IF EXISTS plaid_access_token_id;

-- 4. affiliate_applications
ALTER TABLE public.affiliate_applications
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_affiliate_applications_user_id ON public.affiliate_applications(user_id);

DROP POLICY IF EXISTS "aa public insert" ON public.affiliate_applications;
CREATE POLICY "aa anon insert"
  ON public.affiliate_applications FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL AND status = 'pending');
CREATE POLICY "aa auth insert own"
  ON public.affiliate_applications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "aa applicant read own"
  ON public.affiliate_applications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 5. content-files: add admin-only INSERT/UPDATE/DELETE policies
CREATE POLICY "content-files admin insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'content-files' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "content-files admin update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'content-files' AND public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'content-files' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "content-files admin delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'content-files' AND public.has_role(auth.uid(), 'admin'::app_role));

-- 6. company-logos tighten public upload to images only
DROP POLICY IF EXISTS "Anyone can upload application logos" ON storage.objects;
CREATE POLICY "Public can upload application logos (image only)"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'company-logos'
    AND (storage.foldername(name))[1] = 'applications'
    AND (lower(coalesce(metadata->>'mimetype','')) LIKE 'image/%')
  );

-- 7. search_path
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pg_temp;
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pg_temp;

-- 8. revoke EXECUTE on SECURITY DEFINER helpers
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.refresh_affiliate_totals(uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recompute_affiliate_tier(uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_refresh_affiliate_totals() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.record_affiliate_earning() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.auto_grant_owner_admin() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_all_customer_leads() FROM anon;
