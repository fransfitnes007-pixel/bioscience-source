import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUnreadMessages = (userId: string | null) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setUnreadCount(0);
      return;
    }

    // Fetch initial unread count
    const fetchUnreadCount = async () => {
      const { count } = await supabase
        .from("client_messages")
        .select("*", { count: "exact", head: true })
        .eq("client_id", userId)
        .eq("sender_type", "admin")
        .eq("is_read", false);

      setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    // Subscribe to new messages
    const channel = supabase
      .channel("unread-messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "client_messages",
          filter: `client_id=eq.${userId}`,
        },
        () => {
          // Refetch count on any change
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return unreadCount;
};
