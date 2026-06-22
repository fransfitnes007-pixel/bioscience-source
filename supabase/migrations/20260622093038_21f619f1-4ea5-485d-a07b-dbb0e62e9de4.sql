ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS fulfillment_service text,
  ADD COLUMN IF NOT EXISTS shipstation_order_id text,
  ADD COLUMN IF NOT EXISTS shipstation_order_key text;