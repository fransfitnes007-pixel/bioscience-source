
-- Order refunds table
CREATE TABLE public.order_refunds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  reason TEXT,
  refund_type TEXT NOT NULL DEFAULT 'full',
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_refund_id TEXT,
  refunded_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Refund line items (for partial refunds)
CREATE TABLE public.refund_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  refund_id UUID NOT NULL REFERENCES public.order_refunds(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  amount NUMERIC NOT NULL,
  restock BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Order returns table
CREATE TABLE public.order_returns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  return_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'requested',
  reason TEXT,
  customer_notes TEXT,
  admin_notes TEXT,
  return_shipping_carrier TEXT,
  return_tracking_number TEXT,
  refund_id UUID REFERENCES public.order_refunds(id),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  received_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Return line items
CREATE TABLE public.return_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  return_id UUID NOT NULL REFERENCES public.order_returns(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  reason TEXT,
  condition TEXT DEFAULT 'unopened',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Draft orders
CREATE TABLE public.draft_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  draft_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'open',
  customer_email TEXT,
  customer_name TEXT,
  notes TEXT,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  shipping_cost NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  billing_address JSONB,
  shipping_address JSONB,
  created_by UUID,
  converted_order_id UUID REFERENCES public.orders(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Draft order line items
CREATE TABLE public.draft_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  draft_order_id UUID NOT NULL REFERENCES public.draft_orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  variation_name TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  product_id UUID,
  variation_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Shipments table (for split/partial fulfillment)
CREATE TABLE public.order_shipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  shipment_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  carrier TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  estimated_delivery DATE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  weight NUMERIC,
  shipping_cost NUMERIC DEFAULT 0,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Shipment line items (which items are in which shipment)
CREATE TABLE public.shipment_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES public.order_shipments(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.order_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refund_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draft_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draft_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Admins can manage everything
CREATE POLICY "Admins can manage refunds" ON public.order_refunds FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage refund items" ON public.refund_items FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage returns" ON public.order_returns FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage return items" ON public.return_items FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage draft orders" ON public.draft_orders FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage draft order items" ON public.draft_order_items FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage shipments" ON public.order_shipments FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage shipment items" ON public.shipment_items FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own refunds/returns/shipments
CREATE POLICY "Users can view own refunds" ON public.order_refunds FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_refunds.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Users can view own refund items" ON public.refund_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.order_refunds r JOIN public.orders o ON o.id = r.order_id WHERE r.id = refund_items.refund_id AND o.user_id = auth.uid()));
CREATE POLICY "Users can view own returns" ON public.order_returns FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_returns.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Users can view own return items" ON public.return_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.order_returns r JOIN public.orders o ON o.id = r.order_id WHERE r.id = return_items.return_id AND o.user_id = auth.uid()));
CREATE POLICY "Users can view own shipments" ON public.order_shipments FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_shipments.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Users can view own shipment items" ON public.shipment_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.order_shipments s JOIN public.orders o ON o.id = s.order_id WHERE s.id = shipment_items.shipment_id AND o.user_id = auth.uid()));

-- Suppliers can view shipments for their assigned orders
CREATE POLICY "Suppliers can view assigned shipments" ON public.order_shipments FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.supplier_order_assignments soa WHERE soa.order_id = order_shipments.order_id AND soa.supplier_id = get_supplier_id(auth.uid())));
CREATE POLICY "Suppliers can view assigned shipment items" ON public.shipment_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.order_shipments s JOIN public.supplier_order_assignments soa ON soa.order_id = s.order_id WHERE s.id = shipment_items.shipment_id AND soa.supplier_id = get_supplier_id(auth.uid())));
