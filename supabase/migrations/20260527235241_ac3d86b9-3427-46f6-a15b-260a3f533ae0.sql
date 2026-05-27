
CREATE OR REPLACE FUNCTION public.recompute_affiliate_tier(_affiliate_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_volume_cents bigint;
  v_new_tier affiliate_tier;
  v_current_tier affiliate_tier;
BEGIN
  -- Sum eligible conversion volume in last 30 days
  SELECT COALESCE(SUM(gross_amount_cents), 0)
  INTO v_volume_cents
  FROM public.affiliate_conversions
  WHERE affiliate_id = _affiliate_id
    AND status IN ('approved','paid','cleared')
    AND created_at >= now() - interval '30 days';

  -- Pick highest tier the affiliate qualifies for
  SELECT tier INTO v_new_tier
  FROM public.commission_tiers
  WHERE monthly_volume_threshold_cents <= v_volume_cents
  ORDER BY monthly_volume_threshold_cents DESC
  LIMIT 1;

  IF v_new_tier IS NULL THEN
    v_new_tier := 'bronze';
  END IF;

  SELECT tier INTO v_current_tier FROM public.affiliates WHERE id = _affiliate_id;

  IF v_current_tier IS DISTINCT FROM v_new_tier THEN
    UPDATE public.affiliates SET tier = v_new_tier, updated_at = now() WHERE id = _affiliate_id;
    INSERT INTO public.affiliate_notifications (affiliate_id, type, title, body)
    VALUES (
      _affiliate_id,
      'tier_change',
      'You''ve been promoted!',
      'Your affiliate tier is now ' || v_new_tier::text || '. Higher commission rates and perks unlocked.'
    );
  END IF;
END;
$$;

-- Chain tier recompute into the existing totals refresh
CREATE OR REPLACE FUNCTION public.refresh_affiliate_totals(_affiliate_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.affiliates a SET
    total_clicks = COALESCE((SELECT COUNT(*) FROM public.affiliate_clicks WHERE affiliate_id = _affiliate_id), 0),
    total_conversions = COALESCE((SELECT COUNT(*) FROM public.affiliate_conversions WHERE affiliate_id = _affiliate_id AND status IN ('approved','paid','cleared')), 0),
    total_gross_cents = COALESCE((SELECT SUM(gross_amount_cents) FROM public.affiliate_conversions WHERE affiliate_id = _affiliate_id AND status IN ('approved','paid','cleared')), 0),
    total_commission_cents = COALESCE((SELECT SUM(commission_cents) FROM public.affiliate_conversions WHERE affiliate_id = _affiliate_id AND status IN ('approved','paid','cleared')), 0),
    total_paid_cents = COALESCE((SELECT SUM(amount_cents) FROM public.affiliate_payouts WHERE affiliate_id = _affiliate_id AND status = 'paid'), 0),
    last_activity_at = now(),
    updated_at = now()
  WHERE a.id = _affiliate_id;

  PERFORM public.recompute_affiliate_tier(_affiliate_id);
END;
$$;
