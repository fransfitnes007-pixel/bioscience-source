ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS app_subscription boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS app_subscription_cost numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS app_subscription_interval text DEFAULT 'month';