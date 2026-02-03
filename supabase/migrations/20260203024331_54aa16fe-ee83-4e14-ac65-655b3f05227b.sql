-- Phase 1: Supplier-Restricted Fulfillment System Database Schema

-- Step 1: Add 'supplier' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'supplier';

-- Step 2: Create fulfillment_status enum
CREATE TYPE public.fulfillment_status AS ENUM ('pending', 'in_production', 'packed', 'shipped', 'completed');

-- Step 3: Create suppliers table
CREATE TABLE public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  phone text,
  address text,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Step 4: Create supplier_order_assignments table
CREATE TABLE public.supplier_order_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE CASCADE NOT NULL,
  assigned_by uuid NOT NULL,
  assigned_at timestamp with time zone DEFAULT now() NOT NULL,
  notes text,
  UNIQUE(order_id, supplier_id)
);

-- Step 5: Create order_item_fulfillment table
CREATE TABLE public.order_item_fulfillment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid REFERENCES public.order_items(id) ON DELETE CASCADE NOT NULL,
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE CASCADE NOT NULL,
  status public.fulfillment_status DEFAULT 'pending' NOT NULL,
  shipping_carrier text,
  tracking_number text,
  shipped_at timestamp with time zone,
  notes text,
  updated_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(order_item_id)
);

-- Step 6: Create supplier_messages table
CREATE TABLE public.supplier_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE CASCADE NOT NULL,
  sender_user_id uuid NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('admin', 'supplier')),
  message text NOT NULL,
  is_read boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Step 7: Create order_activity_log table (immutable audit trail)
CREATE TABLE public.order_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  user_id uuid,
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Step 8: Add shipping columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS fulfillment_carrier text,
ADD COLUMN IF NOT EXISTS fulfillment_tracking_number text,
ADD COLUMN IF NOT EXISTS estimated_delivery_date date,
ADD COLUMN IF NOT EXISTS shipped_at timestamp with time zone;

-- Step 9: Create supplier-safe order view (excludes customer contact info)
CREATE OR REPLACE VIEW public.supplier_order_view AS
SELECT 
  o.id,
  o.order_number,
  o.status,
  o.subtotal,
  o.total,
  o.shipping_address,
  o.shipping_address_2,
  o.shipping_city,
  o.shipping_state,
  o.shipping_zip,
  o.shipping_country,
  o.shipping_company,
  o.shipping_first_name,
  o.shipping_last_name,
  o.fulfillment_carrier,
  o.fulfillment_tracking_number,
  o.estimated_delivery_date,
  o.shipped_at,
  o.notes,
  o.created_at,
  o.updated_at
FROM public.orders o;

-- Step 10: Create helper function to check if user is a supplier
CREATE OR REPLACE FUNCTION public.is_supplier(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.suppliers
    WHERE user_id = _user_id
      AND is_active = true
  )
$$;

-- Step 11: Create helper function to get supplier_id from user_id
CREATE OR REPLACE FUNCTION public.get_supplier_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.suppliers WHERE user_id = _user_id AND is_active = true LIMIT 1
$$;

-- Step 12: Enable RLS on all new tables
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_order_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_item_fulfillment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_activity_log ENABLE ROW LEVEL SECURITY;

-- Step 13: RLS Policies for suppliers table
CREATE POLICY "Admins can manage all suppliers"
ON public.suppliers FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Suppliers can view own record"
ON public.suppliers FOR SELECT
USING (auth.uid() = user_id);

-- Step 14: RLS Policies for supplier_order_assignments table
CREATE POLICY "Admins can manage all assignments"
ON public.supplier_order_assignments FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Suppliers can view own assignments"
ON public.supplier_order_assignments FOR SELECT
USING (supplier_id = get_supplier_id(auth.uid()));

-- Step 15: RLS Policies for order_item_fulfillment table
CREATE POLICY "Admins can manage all fulfillment"
ON public.order_item_fulfillment FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Suppliers can view own fulfillment"
ON public.order_item_fulfillment FOR SELECT
USING (supplier_id = get_supplier_id(auth.uid()));

CREATE POLICY "Suppliers can insert own fulfillment"
ON public.order_item_fulfillment FOR INSERT
WITH CHECK (supplier_id = get_supplier_id(auth.uid()));

CREATE POLICY "Suppliers can update own fulfillment"
ON public.order_item_fulfillment FOR UPDATE
USING (supplier_id = get_supplier_id(auth.uid()));

-- Step 16: RLS Policies for supplier_messages table
CREATE POLICY "Admins can manage all supplier messages"
ON public.supplier_messages FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Suppliers can view own messages"
ON public.supplier_messages FOR SELECT
USING (supplier_id = get_supplier_id(auth.uid()));

CREATE POLICY "Suppliers can insert own messages"
ON public.supplier_messages FOR INSERT
WITH CHECK (supplier_id = get_supplier_id(auth.uid()) AND sender_type = 'supplier');

CREATE POLICY "Suppliers can update own messages read status"
ON public.supplier_messages FOR UPDATE
USING (supplier_id = get_supplier_id(auth.uid()));

-- Step 17: RLS Policies for order_activity_log table (admin only, insert only for system)
CREATE POLICY "Admins can view all activity logs"
ON public.order_activity_log FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert activity logs"
ON public.order_activity_log FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin') OR is_supplier(auth.uid()));

-- Step 18: Add policy for suppliers to view assigned orders (via the view)
CREATE POLICY "Suppliers can view assigned orders"
ON public.orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.supplier_order_assignments soa
    WHERE soa.order_id = orders.id
    AND soa.supplier_id = get_supplier_id(auth.uid())
  )
);

-- Step 19: Add policy for suppliers to view order items for assigned orders
CREATE POLICY "Suppliers can view assigned order items"
ON public.order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.supplier_order_assignments soa
    WHERE soa.order_id = order_items.order_id
    AND soa.supplier_id = get_supplier_id(auth.uid())
  )
);

-- Step 20: Create updated_at triggers
CREATE TRIGGER update_suppliers_updated_at
BEFORE UPDATE ON public.suppliers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_order_item_fulfillment_updated_at
BEFORE UPDATE ON public.order_item_fulfillment
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Step 21: Create indexes for performance
CREATE INDEX idx_supplier_order_assignments_order_id ON public.supplier_order_assignments(order_id);
CREATE INDEX idx_supplier_order_assignments_supplier_id ON public.supplier_order_assignments(supplier_id);
CREATE INDEX idx_order_item_fulfillment_order_item_id ON public.order_item_fulfillment(order_item_id);
CREATE INDEX idx_order_item_fulfillment_supplier_id ON public.order_item_fulfillment(supplier_id);
CREATE INDEX idx_order_item_fulfillment_status ON public.order_item_fulfillment(status);
CREATE INDEX idx_supplier_messages_order_id ON public.supplier_messages(order_id);
CREATE INDEX idx_supplier_messages_supplier_id ON public.supplier_messages(supplier_id);
CREATE INDEX idx_order_activity_log_order_id ON public.order_activity_log(order_id);

-- Step 22: Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_item_fulfillment;
ALTER PUBLICATION supabase_realtime ADD TABLE public.supplier_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.supplier_order_assignments;