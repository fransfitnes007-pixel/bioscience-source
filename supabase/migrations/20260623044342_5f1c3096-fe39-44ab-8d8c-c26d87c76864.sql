CREATE INDEX IF NOT EXISTS idx_cart_items_user_id_fast ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_created_fast ON public.orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id_fast ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_shipments_order_id_fast ON public.order_shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_client_created_fast ON public.client_messages(client_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_client_messages_unread_fast ON public.client_messages(client_id, sender_type, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_agreement_signatures_user_fast ON public.agreement_signatures(user_id, created_at DESC);