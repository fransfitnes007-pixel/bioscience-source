CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
CREATE OR REPLACE FUNCTION private.is_supplier(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.suppliers WHERE user_id = _user_id AND is_active = true)
$$;
CREATE OR REPLACE FUNCTION private.is_approved(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = _user_id AND status = 'approved')
$$;
CREATE OR REPLACE FUNCTION private.get_supplier_id(_user_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.suppliers WHERE user_id = _user_id AND is_active = true LIMIT 1
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_supplier(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_approved(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.get_supplier_id(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_supplier(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_approved(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.get_supplier_id(uuid) TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Admins can manage abandoned checkouts" ON public.abandoned_checkouts;
CREATE POLICY "Admins can manage abandoned checkouts" ON public.abandoned_checkouts AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "aa admin all" ON public.affiliate_applications;
CREATE POLICY "aa admin all" ON public.affiliate_applications AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "clicks admin all" ON public.affiliate_clicks;
CREATE POLICY "clicks admin all" ON public.affiliate_clicks AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "codes admin all" ON public.affiliate_codes;
CREATE POLICY "codes admin all" ON public.affiliate_codes AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "conv admin all" ON public.affiliate_conversions;
CREATE POLICY "conv admin all" ON public.affiliate_conversions AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage affiliate earnings" ON public.affiliate_earnings;
CREATE POLICY "Admins can manage affiliate earnings" ON public.affiliate_earnings AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "notif admin" ON public.affiliate_notifications;
CREATE POLICY "notif admin" ON public.affiliate_notifications AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "po admin all" ON public.affiliate_payouts;
CREATE POLICY "po admin all" ON public.affiliate_payouts AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "aps admin write" ON public.affiliate_program_settings;
CREATE POLICY "aps admin write" ON public.affiliate_program_settings AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "res admin write" ON public.affiliate_resources;
CREATE POLICY "res admin write" ON public.affiliate_resources AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage affiliates" ON public.affiliates;
CREATE POLICY "Admins can manage affiliates" ON public.affiliates AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Affiliates can read own row or admins read all" ON public.affiliates;
CREATE POLICY "Affiliates can read own row or admins read all" ON public.affiliates AS PERMISSIVE FOR SELECT TO authenticated USING (((user_id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::app_role)));
DROP POLICY IF EXISTS "Admins update signatures (counter-sign)" ON public.agreement_signatures;
CREATE POLICY "Admins update signatures (counter-sign)" ON public.agreement_signatures AS PERMISSIVE FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Users view own signatures" ON public.agreement_signatures;
CREATE POLICY "Users view own signatures" ON public.agreement_signatures AS PERMISSIVE FOR SELECT TO authenticated USING (((user_id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::app_role)));
DROP POLICY IF EXISTS "Admins can manage analytics daily" ON public.analytics_daily;
CREATE POLICY "Admins can manage analytics daily" ON public.analytics_daily AS PERMISSIVE FOR ALL USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view analytics events" ON public.analytics_events;
CREATE POLICY "Admins can view analytics events" ON public.analytics_events AS PERMISSIVE FOR SELECT USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
CREATE POLICY "Admins can update applications" ON public.applications AS PERMISSIVE FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
CREATE POLICY "Admins can view all applications" ON public.applications AS PERMISSIVE FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage campaigns" ON public.campaigns;
CREATE POLICY "Admins can manage campaigns" ON public.campaigns AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can insert messages" ON public.client_messages;
CREATE POLICY "Admins can insert messages" ON public.client_messages AS PERMISSIVE FOR INSERT WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update messages" ON public.client_messages;
CREATE POLICY "Admins can update messages" ON public.client_messages AS PERMISSIVE FOR UPDATE USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view all messages" ON public.client_messages;
CREATE POLICY "Admins can view all messages" ON public.client_messages AS PERMISSIVE FOR SELECT USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage COAs" ON public.coa_documents;
CREATE POLICY "Admins can manage COAs" ON public.coa_documents AS PERMISSIVE FOR ALL USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Approved users can view COAs" ON public.coa_documents;
CREATE POLICY "Approved users can view COAs" ON public.coa_documents AS PERMISSIVE FOR SELECT USING (((is_public = true) OR private.is_approved(auth.uid())));
DROP POLICY IF EXISTS "tiers admin write" ON public.commission_tiers;
CREATE POLICY "tiers admin write" ON public.commission_tiers AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Admins can update contact messages" ON public.contact_messages AS PERMISSIVE FOR UPDATE USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages" ON public.contact_messages AS PERMISSIVE FOR SELECT USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage segments" ON public.customer_segments;
CREATE POLICY "Admins can manage segments" ON public.customer_segments AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage deal tiers" ON public.deal_tiers;
CREATE POLICY "Admins can manage deal tiers" ON public.deal_tiers AS PERMISSIVE FOR ALL USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage discounts" ON public.discounts;
CREATE POLICY "Admins can manage discounts" ON public.discounts AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Only admins can read discounts" ON public.discounts;
CREATE POLICY "Only admins can read discounts" ON public.discounts AS PERMISSIVE FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage draft order items" ON public.draft_order_items;
CREATE POLICY "Admins can manage draft order items" ON public.draft_order_items AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage draft orders" ON public.draft_orders;
CREATE POLICY "Admins can manage draft orders" ON public.draft_orders AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage email logs" ON public.email_logs;
CREATE POLICY "Admins can manage email logs" ON public.email_logs AS PERMISSIVE FOR ALL USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Only admins can read email logs" ON public.email_logs;
CREATE POLICY "Only admins can read email logs" ON public.email_logs AS PERMISSIVE FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view form submissions" ON public.form_submissions;
CREATE POLICY "Admins can view form submissions" ON public.form_submissions AS PERMISSIVE FOR SELECT USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "fraud admin" ON public.fraud_events;
CREATE POLICY "fraud admin" ON public.fraud_events AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can create gift cards" ON public.gift_cards;
CREATE POLICY "Admins can create gift cards" ON public.gift_cards AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can delete gift cards" ON public.gift_cards;
CREATE POLICY "Admins can delete gift cards" ON public.gift_cards AS PERMISSIVE FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update gift cards" ON public.gift_cards;
CREATE POLICY "Admins can update gift cards" ON public.gift_cards AS PERMISSIVE FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view gift cards" ON public.gift_cards;
CREATE POLICY "Admins can view gift cards" ON public.gift_cards AS PERMISSIVE FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.inquiries;
CREATE POLICY "Admins can update inquiries" ON public.inquiries AS PERMISSIVE FOR UPDATE USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view all inquiries" ON public.inquiries;
CREATE POLICY "Admins can view all inquiries" ON public.inquiries AS PERMISSIVE FOR SELECT USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage inventory" ON public.inventory;
CREATE POLICY "Admins can manage inventory" ON public.inventory AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "ledger admin" ON public.ledger_entries;
CREATE POLICY "ledger admin" ON public.ledger_entries AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage media files" ON public.media_files;
CREATE POLICY "Admins can manage media files" ON public.media_files AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage nav menu items" ON public.nav_menu_items;
CREATE POLICY "Admins can manage nav menu items" ON public.nav_menu_items AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage nav menus" ON public.nav_menus;
CREATE POLICY "Admins can manage nav menus" ON public.nav_menus AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can insert activity logs" ON public.order_activity_log;
CREATE POLICY "Admins can insert activity logs" ON public.order_activity_log AS PERMISSIVE FOR INSERT WITH CHECK ((private.has_role(auth.uid(), 'admin'::app_role) OR private.is_supplier(auth.uid())));
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.order_activity_log;
CREATE POLICY "Admins can view all activity logs" ON public.order_activity_log AS PERMISSIVE FOR SELECT USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage all fulfillment" ON public.order_item_fulfillment;
CREATE POLICY "Admins can manage all fulfillment" ON public.order_item_fulfillment AS PERMISSIVE FOR ALL USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Suppliers can insert own fulfillment" ON public.order_item_fulfillment;
CREATE POLICY "Suppliers can insert own fulfillment" ON public.order_item_fulfillment AS PERMISSIVE FOR INSERT WITH CHECK ((supplier_id = private.get_supplier_id(auth.uid())));
DROP POLICY IF EXISTS "Suppliers can update own fulfillment" ON public.order_item_fulfillment;
CREATE POLICY "Suppliers can update own fulfillment" ON public.order_item_fulfillment AS PERMISSIVE FOR UPDATE USING ((supplier_id = private.get_supplier_id(auth.uid())));
DROP POLICY IF EXISTS "Suppliers can view own fulfillment" ON public.order_item_fulfillment;
CREATE POLICY "Suppliers can view own fulfillment" ON public.order_item_fulfillment AS PERMISSIVE FOR SELECT USING ((supplier_id = private.get_supplier_id(auth.uid())));
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
CREATE POLICY "Admins can view all order items" ON public.order_items AS PERMISSIVE FOR SELECT USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Suppliers can view assigned order items" ON public.order_items;
CREATE POLICY "Suppliers can view assigned order items" ON public.order_items AS PERMISSIVE FOR SELECT USING ((EXISTS ( SELECT 1 FROM supplier_order_assignments soa WHERE ((soa.order_id = order_items.order_id) AND (soa.supplier_id = private.get_supplier_id(auth.uid()))))));
DROP POLICY IF EXISTS "Admins can manage refunds" ON public.order_refunds;
CREATE POLICY "Admins can manage refunds" ON public.order_refunds AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage returns" ON public.order_returns;
CREATE POLICY "Admins can manage returns" ON public.order_returns AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage shipments" ON public.order_shipments;
CREATE POLICY "Admins can manage shipments" ON public.order_shipments AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Suppliers can view assigned shipments" ON public.order_shipments;
CREATE POLICY "Suppliers can view assigned shipments" ON public.order_shipments AS PERMISSIVE FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1 FROM supplier_order_assignments soa WHERE ((soa.order_id = order_shipments.order_id) AND (soa.supplier_id = private.get_supplier_id(auth.uid()))))));
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders AS PERMISSIVE FOR UPDATE USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders AS PERMISSIVE FOR SELECT USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Suppliers can view assigned orders" ON public.orders;
CREATE POLICY "Suppliers can view assigned orders" ON public.orders AS PERMISSIVE FOR SELECT USING ((EXISTS ( SELECT 1 FROM supplier_order_assignments soa WHERE ((soa.order_id = orders.id) AND (soa.supplier_id = private.get_supplier_id(auth.uid()))))));
DROP POLICY IF EXISTS "Admins can view page views" ON public.page_views;
CREATE POLICY "Admins can view page views" ON public.page_views AS PERMISSIVE FOR SELECT USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "pm admin all" ON public.payout_methods;
CREATE POLICY "pm admin all" ON public.payout_methods AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage categories" ON public.product_categories;
CREATE POLICY "Admins can manage categories" ON public.product_categories AS PERMISSIVE FOR ALL USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage variations" ON public.product_variations;
CREATE POLICY "Admins can manage variations" ON public.product_variations AS PERMISSIVE FOR ALL USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view product views" ON public.product_views;
CREATE POLICY "Admins can view product views" ON public.product_views AS PERMISSIVE FOR SELECT USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products AS PERMISSIVE FOR ALL USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles AS PERMISSIVE FOR UPDATE USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles AS PERMISSIVE FOR SELECT USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage refund items" ON public.refund_items;
CREATE POLICY "Admins can manage refund items" ON public.refund_items AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage return items" ON public.return_items;
CREATE POLICY "Admins can manage return items" ON public.return_items AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.security_audit_log;
CREATE POLICY "Admins can view audit logs" ON public.security_audit_log AS PERMISSIVE FOR SELECT USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage shipment items" ON public.shipment_items;
CREATE POLICY "Admins can manage shipment items" ON public.shipment_items AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Suppliers can view assigned shipment items" ON public.shipment_items;
CREATE POLICY "Suppliers can view assigned shipment items" ON public.shipment_items AS PERMISSIVE FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1 FROM (order_shipments s JOIN supplier_order_assignments soa ON ((soa.order_id = s.order_id))) WHERE ((s.id = shipment_items.shipment_id) AND (soa.supplier_id = private.get_supplier_id(auth.uid()))))));
DROP POLICY IF EXISTS "Admins can manage settings" ON public.site_settings;
CREATE POLICY "Admins can manage settings" ON public.site_settings AS PERMISSIVE FOR ALL USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view settings" ON public.site_settings;
CREATE POLICY "Admins can view settings" ON public.site_settings AS PERMISSIVE FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view opt-ins" ON public.sms_optins;
CREATE POLICY "Admins can view opt-ins" ON public.sms_optins AS PERMISSIVE FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage all supplier messages" ON public.supplier_messages;
CREATE POLICY "Admins can manage all supplier messages" ON public.supplier_messages AS PERMISSIVE FOR ALL USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Suppliers can insert own messages" ON public.supplier_messages;
CREATE POLICY "Suppliers can insert own messages" ON public.supplier_messages AS PERMISSIVE FOR INSERT WITH CHECK (((supplier_id = private.get_supplier_id(auth.uid())) AND (sender_type = 'supplier'::text)));
DROP POLICY IF EXISTS "Suppliers can update own messages read status" ON public.supplier_messages;
CREATE POLICY "Suppliers can update own messages read status" ON public.supplier_messages AS PERMISSIVE FOR UPDATE USING ((supplier_id = private.get_supplier_id(auth.uid())));
DROP POLICY IF EXISTS "Suppliers can view own messages" ON public.supplier_messages;
CREATE POLICY "Suppliers can view own messages" ON public.supplier_messages AS PERMISSIVE FOR SELECT USING ((supplier_id = private.get_supplier_id(auth.uid())));
DROP POLICY IF EXISTS "Admins can manage all assignments" ON public.supplier_order_assignments;
CREATE POLICY "Admins can manage all assignments" ON public.supplier_order_assignments AS PERMISSIVE FOR ALL USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Suppliers can view own assignments" ON public.supplier_order_assignments;
CREATE POLICY "Suppliers can view own assignments" ON public.supplier_order_assignments AS PERMISSIVE FOR SELECT USING ((supplier_id = private.get_supplier_id(auth.uid())));
DROP POLICY IF EXISTS "Admins can manage all suppliers" ON public.suppliers;
CREATE POLICY "Admins can manage all suppliers" ON public.suppliers AS PERMISSIVE FOR ALL USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "links admin all" ON public.tracking_links;
CREATE POLICY "links admin all" ON public.tracking_links AS PERMISSIVE FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles" ON public.user_roles AS PERMISSIVE FOR ALL USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view sessions" ON public.user_sessions;
CREATE POLICY "Admins can view sessions" ON public.user_sessions AS PERMISSIVE FOR SELECT USING (private.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can manage webhook logs" ON public.webhook_logs;
CREATE POLICY "Admins can manage webhook logs" ON public.webhook_logs AS PERMISSIVE FOR ALL USING (private.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage all company logos" ON storage.objects;
CREATE POLICY "Admins can manage all company logos" ON storage.objects AS PERMISSIVE FOR ALL TO public USING ((bucket_id = 'company-logos'::text) AND private.has_role(auth.uid(), 'admin'::public.app_role));
DROP POLICY IF EXISTS "content-files admin delete" ON storage.objects;
CREATE POLICY "content-files admin delete" ON storage.objects AS PERMISSIVE FOR DELETE TO authenticated USING ((bucket_id = 'content-files'::text) AND private.has_role(auth.uid(), 'admin'::public.app_role));
DROP POLICY IF EXISTS "content-files admin insert" ON storage.objects;
CREATE POLICY "content-files admin insert" ON storage.objects AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'content-files'::text) AND private.has_role(auth.uid(), 'admin'::public.app_role));
DROP POLICY IF EXISTS "content-files admin update" ON storage.objects;
CREATE POLICY "content-files admin update" ON storage.objects AS PERMISSIVE FOR UPDATE TO authenticated USING ((bucket_id = 'content-files'::text) AND private.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK ((bucket_id = 'content-files'::text) AND private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.get_all_customer_leads()
 RETURNS TABLE(lead_type text, id uuid, name text, email text, phone text, business_name text, business_type text, business_address text, city text, state text, zip_code text, country text, products_interest text, product_usage text, how_we_benefit text, company_impact text, monthly_volume text, website text, referral_source text, intended_use text, notes text, status text, user_id uuid, created_at timestamp with time zone)
 LANGUAGE plpgsql SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT private.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  RETURN QUERY
  SELECT 'application'::text, a.id, a.contact_name, a.email, a.phone, a.business_name,
      a.business_type, a.business_address, a.city, a.state, a.zip_code, a.country,
      a.products_interest, a.product_usage, a.how_we_benefit, a.company_impact,
      a.monthly_volume, a.website, a.referral_source, a.intended_use, a.notes,
      (a.status)::text, NULL::uuid, a.created_at
  FROM applications a
  UNION ALL
  SELECT 'inquiry'::text, i.id, i.name, i.email, i.phone, i.business_name,
      NULL::text, NULL::text, NULL::text, NULL::text, NULL::text, NULL::text,
      i.product_name, NULL::text, NULL::text, NULL::text, NULL::text, NULL::text,
      NULL::text, NULL::text, i.message, i.status, i.user_id, i.created_at
  FROM inquiries i
  UNION ALL
  SELECT 'contact'::text, c.id, c.name, c.email, c.phone, NULL::text,
      NULL::text, NULL::text, NULL::text, NULL::text, NULL::text, NULL::text,
      NULL::text, NULL::text, NULL::text, NULL::text, NULL::text, NULL::text,
      NULL::text, NULL::text, c.message, c.status, NULL::uuid, c.created_at
  FROM contact_messages c
  UNION ALL
  SELECT 'registered_user'::text, p.id, concat(p.first_name, ' ', p.last_name),
      p.business_email, p.phone, p.business_name,
      NULL::text, NULL::text, NULL::text, NULL::text, NULL::text, p.country,
      NULL::text, NULL::text, NULL::text, NULL::text, NULL::text, p.website,
      NULL::text, NULL::text, NULL::text, (p.status)::text, p.user_id, p.created_at
  FROM profiles p;
END;
$function$;

CREATE OR REPLACE FUNCTION public.enforce_affiliate_self_insert_defaults()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT private.has_role(auth.uid(), 'admin'::public.app_role) THEN
    NEW.status := 'pending';
    NEW.is_active := false;
    NEW.commission_rate := NULL;
    NEW.custom_commission_rate := NULL;
    NEW.tier := NULL;
    NEW.total_earnings := 0;
    NEW.total_orders := 0;
    NEW.total_clicks := 0;
    NEW.total_conversions := 0;
    NEW.total_gross_cents := 0;
    NEW.total_commission_cents := 0;
    NEW.total_paid_cents := 0;
    NEW.approved_at := NULL;
    NEW.approved_by := NULL;
    NEW.reviewed_at := NULL;
    NEW.reviewed_by := NULL;
    NEW.tax_form_filed := false;
    NEW.tax_form_url := NULL;
    NEW.internal_notes := NULL;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.enforce_payout_method_protected_fields()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT private.has_role(auth.uid(), 'admin'::public.app_role) THEN
    IF TG_OP = 'INSERT' THEN
      NEW.is_verified := false;
      NEW.stripe_connect_payouts_enabled := false;
      NEW.verified_at := NULL;
    ELSIF TG_OP = 'UPDATE' THEN
      NEW.is_verified := OLD.is_verified;
      NEW.stripe_connect_payouts_enabled := OLD.stripe_connect_payouts_enabled;
      NEW.verified_at := OLD.verified_at;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.is_supplier(uuid);
DROP FUNCTION IF EXISTS public.is_approved(uuid);
DROP FUNCTION IF EXISTS public.get_supplier_id(uuid);

REVOKE EXECUTE ON FUNCTION public.finish_b2c_account(text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.finish_b2c_account(text, text, text) TO authenticated, service_role;