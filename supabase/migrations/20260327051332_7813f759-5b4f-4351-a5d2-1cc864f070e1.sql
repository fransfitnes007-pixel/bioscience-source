
-- Create a trigger function that records affiliate earnings when an order is paid
CREATE OR REPLACE FUNCTION public.record_affiliate_earning()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_affiliate RECORD;
  v_commission numeric;
BEGIN
  -- Only fire when payment_status changes to 'paid'
  IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') AND NEW.discount_code IS NOT NULL THEN
    -- Look up if the discount code belongs to an affiliate
    SELECT a.id, a.commission_rate, a.name
    INTO v_affiliate
    FROM affiliates a
    WHERE a.discount_code = NEW.discount_code
      AND a.is_active = true
    LIMIT 1;

    IF v_affiliate.id IS NOT NULL THEN
      -- Calculate commission on the order total
      v_commission := (NEW.total * v_affiliate.commission_rate / 100);

      -- Insert the earning record
      INSERT INTO affiliate_earnings (affiliate_id, order_id, order_number, order_total, commission_rate, commission_amount, status)
      VALUES (v_affiliate.id, NEW.id, NEW.order_number, NEW.total, v_affiliate.commission_rate, v_commission, 'pending');

      -- Increment the affiliate's total_orders
      UPDATE affiliates SET total_orders = total_orders + 1 WHERE id = v_affiliate.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Create the trigger on orders table
CREATE TRIGGER trg_record_affiliate_earning
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.record_affiliate_earning();
