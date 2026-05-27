
-- Function to recompute affiliate aggregates from conversions/payouts
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
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_refresh_affiliate_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.refresh_affiliate_totals(OLD.affiliate_id);
    RETURN OLD;
  ELSE
    PERFORM public.refresh_affiliate_totals(NEW.affiliate_id);
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS conversions_refresh_totals ON public.affiliate_conversions;
CREATE TRIGGER conversions_refresh_totals
AFTER INSERT OR UPDATE OR DELETE ON public.affiliate_conversions
FOR EACH ROW EXECUTE FUNCTION public.trg_refresh_affiliate_totals();

DROP TRIGGER IF EXISTS payouts_refresh_totals ON public.affiliate_payouts;
CREATE TRIGGER payouts_refresh_totals
AFTER INSERT OR UPDATE OR DELETE ON public.affiliate_payouts
FOR EACH ROW EXECUTE FUNCTION public.trg_refresh_affiliate_totals();

-- Ledger entries table for double-entry-style tracking (if missing add minimal grants)
GRANT SELECT ON public.affiliate_conversions TO authenticated;
GRANT SELECT ON public.affiliate_payouts TO authenticated;
