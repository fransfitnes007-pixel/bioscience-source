-- =============================================
-- SHOPPING CART SYSTEM
-- =============================================

-- Cart items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  variation_id UUID REFERENCES public.product_variations(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id, variation_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert to own cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from own cart" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_cart_items_user ON public.cart_items(user_id);

-- =============================================
-- ORDERS SYSTEM
-- =============================================

CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  
  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  discount_code TEXT,
  discount_tier TEXT,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  buyer_protection BOOLEAN DEFAULT false,
  buyer_protection_cost DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  -- Billing info
  billing_first_name TEXT NOT NULL,
  billing_last_name TEXT NOT NULL,
  billing_email TEXT NOT NULL,
  billing_phone TEXT,
  billing_company TEXT,
  billing_address TEXT NOT NULL,
  billing_address_2 TEXT,
  billing_city TEXT NOT NULL,
  billing_state TEXT,
  billing_zip TEXT NOT NULL,
  billing_country TEXT NOT NULL,
  
  -- Shipping info
  shipping_same_as_billing BOOLEAN DEFAULT true,
  shipping_first_name TEXT,
  shipping_last_name TEXT,
  shipping_company TEXT,
  shipping_address TEXT,
  shipping_address_2 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_zip TEXT,
  shipping_country TEXT,
  
  -- Payment
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  notes TEXT,
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_number ON public.orders(order_number);
CREATE INDEX idx_orders_status ON public.orders(status);

-- Order items
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  variation_id UUID REFERENCES public.product_variations(id),
  product_name TEXT NOT NULL,
  variation_name TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- =============================================
-- TIERED DEALS/REWARDS SYSTEM
-- =============================================

CREATE TABLE public.deal_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tier_number INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  min_spend DECIMAL(10,2) NOT NULL,
  reward_type TEXT NOT NULL, -- 'percent_off', 'fixed_off', 'free_shipping', 'free_product', 'bogo_half', 'bogo_free'
  reward_value DECIMAL(10,2), -- percentage or fixed amount
  reward_product_id UUID REFERENCES public.products(id),
  reward_description TEXT NOT NULL,
  celebration_text TEXT NOT NULL DEFAULT 'Congratulations!',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.deal_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active deal tiers" ON public.deal_tiers FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage deal tiers" ON public.deal_tiers FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Insert default 6 tiers
INSERT INTO public.deal_tiers (tier_number, name, min_spend, reward_type, reward_value, reward_description, celebration_text) VALUES
(1, 'Bronze', 250.00, 'percent_off', 5, '5% off your order', '🎉 You unlocked 5% off!'),
(2, 'Silver', 500.00, 'free_shipping', 0, 'Free shipping on your order', '🚀 Free shipping unlocked!'),
(3, 'Gold', 1000.00, 'percent_off', 10, '10% off your order', '✨ Amazing! 10% off!'),
(4, 'Platinum', 2500.00, 'percent_off', 15, '15% off your order', '💎 Platinum status! 15% off!'),
(5, 'Diamond', 5000.00, 'bogo_half', 0, 'Buy one get one 50% off', '💫 Diamond! BOGO 50% off!'),
(6, 'Elite', 10000.00, 'percent_off', 25, '25% off + Free shipping', '🏆 ELITE STATUS! 25% off + Free shipping!');