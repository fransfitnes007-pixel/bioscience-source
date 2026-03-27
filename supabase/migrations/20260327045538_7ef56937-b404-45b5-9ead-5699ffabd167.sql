
-- Discount codes table
CREATE TABLE public.discounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_shipping')),
  discount_value NUMERIC NOT NULL DEFAULT 0,
  applies_to TEXT NOT NULL DEFAULT 'order' CHECK (applies_to IN ('order', 'product')),
  method TEXT NOT NULL DEFAULT 'code' CHECK (method IN ('code', 'automatic')),
  minimum_purchase_amount NUMERIC,
  minimum_quantity INTEGER,
  max_uses INTEGER,
  max_uses_per_customer INTEGER DEFAULT 1,
  usage_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE,
  combine_with_product_discounts BOOLEAN DEFAULT false,
  combine_with_order_discounts BOOLEAN DEFAULT false,
  combine_with_shipping_discounts BOOLEAN DEFAULT false,
  is_affiliate BOOLEAN NOT NULL DEFAULT false,
  affiliate_id UUID,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Affiliates (athletes) table
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  instagram TEXT,
  tiktok TEXT,
  youtube TEXT,
  sport TEXT,
  commission_rate NUMERIC NOT NULL DEFAULT 10 CHECK (commission_rate IN (10, 15, 20, 25, 30)),
  discount_code TEXT,
  total_earnings NUMERIC NOT NULL DEFAULT 0,
  total_orders INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Affiliate earnings tracking
CREATE TABLE public.affiliate_earnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id),
  order_number TEXT,
  order_total NUMERIC NOT NULL DEFAULT 0,
  commission_rate NUMERIC NOT NULL,
  commission_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key from discounts to affiliates
ALTER TABLE public.discounts ADD CONSTRAINT discounts_affiliate_id_fkey FOREIGN KEY (affiliate_id) REFERENCES public.affiliates(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_earnings ENABLE ROW LEVEL SECURITY;

-- RLS policies for discounts
CREATE POLICY "Admins can manage discounts" ON public.discounts FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view active discounts" ON public.discounts FOR SELECT USING (is_active = true AND starts_at <= now() AND (ends_at IS NULL OR ends_at > now()));

-- RLS policies for affiliates
CREATE POLICY "Admins can manage affiliates" ON public.affiliates FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for affiliate_earnings
CREATE POLICY "Admins can manage affiliate earnings" ON public.affiliate_earnings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed RESURRECT10 discount code
INSERT INTO public.discounts (code, description, discount_type, discount_value, applies_to, method, is_active)
VALUES ('RESURRECT10', '10% off your entire order', 'percentage', 10, 'order', 'code', true);
