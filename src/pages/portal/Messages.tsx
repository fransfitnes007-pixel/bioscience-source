import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import PortalLayout from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  client_id: string;
  conversation_id: string;
}

const PortalMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setUserId(session.user.id);

      const { data } = await supabase
        .from('client_messages')
        .select('*')
        .eq('client_id', session.user.id)
        .order('created_at', { ascending: true });

      setMessages(data || []);
      setLoading(false);

      // Mark admin messages as read
      if (data && data.length > 0) {
        const unreadIds = data
          .filter(m => m.sender_type === 'admin' && !m.is_read)
          .map(m => m.id);
        
        if (unreadIds.length > 0) {
          await supabase
            .from('client_messages')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .in('id', unreadIds);
        }
      }
    };

    fetchMessages();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('client-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'client_messages',
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.client_id === userId) {
            setMessages(prev => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !userId) return;

    setSending(true);
    
    // Get or create conversation_id based on existing messages
    let conversationId = messages.length > 0 
      ? (messages[0] as any).conversation_id 
      : crypto.randomUUID();

    const { error } = await supabase
      .from('client_messages')
      .insert({
        client_id: userId,
        sender_user_id: userId,
        sender_type: 'client',
        message: newMessage.trim(),
        conversation_id: conversationId,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } else {
      setNewMessage("");
      toast({
        title: "Message sent",
        description: "We'll get back to you soon.",
      });
    }

    setSending(false);
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <PortalLayout>
      <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Chat with our team</p>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Support Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className={`h-16 ${i % 2 === 0 ? 'w-3/4' : 'w-3/4 ml-auto'}`} />
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No messages yet</p>
                <p className="text-sm text-muted-foreground">Send a message to start a conversation</p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                   <div
                    key={msg.id}
                    className={cn(
                      "max-w-[80%] p-4 rounded-2xl",
                      msg.sender_type === 'client'
                        ? "ml-auto bg-accent text-accent-foreground border border-border"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                    <p className={cn(
                      "text-xs mt-2 text-muted-foreground"
                    )}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>
          
          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="resize-none"
                rows={2}
              />
              <Button
                onClick={handleSend}
                disabled={!newMessage.trim() || sending}
                size="icon"
                className="h-auto"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default PortalMessages;
