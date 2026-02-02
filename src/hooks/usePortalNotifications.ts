import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface Message {
  id: string;
  client_id: string;
  sender_type: string;
  message: string;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
}

export const usePortalNotifications = (userId: string | null) => {
  const { toast } = useToast();
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (!userId) return;

    // Small delay to prevent notifications on initial load
    const timer = setTimeout(() => {
      initialLoadRef.current = false;
    }, 2000);

    // Subscribe to new messages for this user
    const messagesChannel = supabase
      .channel('portal-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'client_messages',
          filter: `client_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<Message>) => {
          const newMessage = payload.new as Message;
          // Only notify for admin messages (not the user's own messages)
          if (!initialLoadRef.current && newMessage.sender_type === 'admin') {
            toast({
              title: "New Message",
              description: "You have a new message from support.",
            });
          }
        }
      )
      .subscribe();

    // Subscribe to order status updates for this user
    const ordersChannel = supabase
      .channel('portal-orders')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<Order>) => {
          const updatedOrder = payload.new as Order;
          const oldOrder = payload.old as Partial<Order>;
          
          // Only notify if status actually changed
          if (!initialLoadRef.current && oldOrder.status !== updatedOrder.status) {
            const statusMessages: Record<string, string> = {
              processing: "Your order is now being processed.",
              shipped: "Your order has been shipped!",
              delivered: "Your order has been delivered.",
              cancelled: "Your order has been cancelled.",
            };

            const message = statusMessages[updatedOrder.status] || 
              `Order status updated to ${updatedOrder.status}.`;

            toast({
              title: `Order ${updatedOrder.order_number} Updated`,
              description: message,
            });
          }
        }
      )
      .subscribe();

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [userId, toast]);
};
