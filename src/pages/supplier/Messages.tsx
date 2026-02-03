import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SupplierLayout } from "@/components/supplier/SupplierLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface OrderConversation {
  order_id: string;
  order_number: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

const SupplierMessages = () => {
  const [conversations, setConversations] = useState<OrderConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
    
    // Subscribe to new messages
    const channel = supabase
      .channel("supplier-all-messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "supplier_messages",
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get supplier
      const { data: supplier } = await supabase
        .from("suppliers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!supplier) return;

      // Get all messages for this supplier
      const { data: messages } = await supabase
        .from("supplier_messages")
        .select("order_id, message, created_at, sender_type, is_read")
        .eq("supplier_id", supplier.id)
        .order("created_at", { ascending: false });

      if (!messages || messages.length === 0) {
        setConversations([]);
        setIsLoading(false);
        return;
      }

      // Group by order and get last message
      const orderMap = new Map<string, {
        messages: typeof messages;
        unread: number;
      }>();

      messages.forEach((msg) => {
        const existing = orderMap.get(msg.order_id) || { messages: [], unread: 0 };
        existing.messages.push(msg);
        if (msg.sender_type === "admin" && !msg.is_read) {
          existing.unread++;
        }
        orderMap.set(msg.order_id, existing);
      });

      // Get order numbers
      const orderIds = Array.from(orderMap.keys());
      const { data: orders } = await supabase
        .from("supplier_order_view")
        .select("id, order_number")
        .in("id", orderIds);

      const conversationList: OrderConversation[] = [];

      orderMap.forEach((data, orderId) => {
        const order = orders?.find((o) => o.id === orderId);
        if (order && data.messages.length > 0) {
          conversationList.push({
            order_id: orderId,
            order_number: order.order_number,
            last_message: data.messages[0].message,
            last_message_at: data.messages[0].created_at,
            unread_count: data.unread,
          });
        }
      });

      // Sort by last message time
      conversationList.sort(
        (a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      );

      setConversations(conversationList);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  return (
    <SupplierLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-muted-foreground">Chat with admin about your orders</p>
          </div>
          {totalUnread > 0 && (
            <Badge variant="destructive">{totalUnread} unread</Badge>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Order Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm">Messages will appear here when you chat with admin about orders</p>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <Link
                      key={conv.order_id}
                      to={`/supplier/orders/${conv.order_id}`}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">Order #{conv.order_number}</p>
                          {conv.unread_count > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conv.unread_count}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.last_message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(conv.last_message_at), "MMM d, h:mm a")}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </SupplierLayout>
  );
};

export default SupplierMessages;
