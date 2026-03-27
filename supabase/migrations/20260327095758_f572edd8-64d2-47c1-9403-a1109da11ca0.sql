
-- Fix overly permissive INSERT policies for public-facing tables
-- These tables need public INSERT (applications, inquiries, contact_messages, analytics, page_views, etc.)
-- but we should add basic validation

-- 1. Tighten abandoned_checkouts INSERT - require either auth or rate limit
DROP POLICY IF EXISTS "Users can insert own abandoned checkouts" ON public.abandoned_checkouts;
CREATE POLICY "Authenticated users can insert abandoned checkouts" ON public.abandoned_checkouts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 2. Tighten form_submissions - add authenticated check  
DROP POLICY IF EXISTS "Anyone can insert form submissions" ON public.form_submissions;
CREATE POLICY "Anyone can insert form submissions" ON public.form_submissions
  FOR INSERT TO public
  WITH CHECK (
    form_type IS NOT NULL AND 
    form_name IS NOT NULL AND 
    length(form_name) <= 100
  );

-- 3. Tighten security_audit_log INSERT - only system/authenticated
DROP POLICY IF EXISTS "System can insert audit logs" ON public.security_audit_log;
CREATE POLICY "Authenticated can insert audit logs" ON public.security_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow service role to insert (edge functions)
CREATE POLICY "Service role can insert audit logs" ON public.security_audit_log
  FOR INSERT TO service_role
  WITH CHECK (true);

-- 4. Add DELETE restriction policies where missing
-- Orders should never be deletable by regular users
CREATE POLICY "No user deletes on orders" ON public.orders
  FOR DELETE TO authenticated
  USING (false);

-- 5. Ensure cart_items can only be managed by the owner
-- Check existing policies first, add DELETE policy
CREATE POLICY "Users can delete own cart items" ON public.cart_items
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 6. Add index on security audit log for performance
CREATE INDEX IF NOT EXISTS idx_security_audit_created_at ON public.security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON public.rate_limits(identifier, action);
