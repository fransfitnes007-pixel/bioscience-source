import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSupplierNotifications = (supplierId: string | null) => {
  const { toast } = useToast();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [newAssignments, setNewAssignments] = useState(0);

  useEffect(() => {
    if (!supplierId) return;

    // Fetch initial counts
    fetchCounts();

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel(`supplier-messages-${supplierId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "supplier_messages",
          filter: `supplier_id=eq.${supplierId}`,
        },
        (payload) => {
          if (payload.new.sender_type === "admin") {
            setUnreadMessages((prev) => prev + 1);
            toast({
              title: "New Message",
              description: "You have a new message from admin",
            });
          }
        }
      )
      .subscribe();

    // Subscribe to new assignments
    const assignmentsChannel = supabase
      .channel(`supplier-assignments-${supplierId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "supplier_order_assignments",
          filter: `supplier_id=eq.${supplierId}`,
        },
        () => {
          setNewAssignments((prev) => prev + 1);
          toast({
            title: "New Order Assigned",
            description: "A new order has been assigned to you",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(assignmentsChannel);
    };
  }, [supplierId, toast]);

  const fetchCounts = async () => {
    if (!supplierId) return;

    // Get unread messages count
    const { count: messagesCount } = await supabase
      .from("supplier_messages")
      .select("*", { count: "exact", head: true })
      .eq("supplier_id", supplierId)
      .eq("sender_type", "admin")
      .eq("is_read", false);

    setUnreadMessages(messagesCount || 0);
  };

  const clearMessageNotifications = () => {
    setUnreadMessages(0);
  };

  const clearAssignmentNotifications = () => {
    setNewAssignments(0);
  };

  return {
    unreadMessages,
    newAssignments,
    clearMessageNotifications,
    clearAssignmentNotifications,
  };
};
