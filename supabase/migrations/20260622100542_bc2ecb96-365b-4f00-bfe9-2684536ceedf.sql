-- Revoke column-level SELECT on Stripe identifier columns from authenticated.
-- These IDs are only needed server-side (service_role in edge functions).
REVOKE SELECT (stripe_coupon_id, stripe_promotion_code_id)
  ON public.affiliate_codes
  FROM authenticated, anon;

-- Make sure the rest of the columns remain readable to authenticated
-- (RLS still enforces row visibility).
GRANT SELECT (
  id, affiliate_id, code, code_type, discount_type, discount_value,
  customer_discount_label, is_default, active, max_uses, uses_count,
  max_uses_per_customer, minimum_order_cents, applies_to_product_ids,
  expires_at, created_at, updated_at
) ON public.affiliate_codes TO authenticated;