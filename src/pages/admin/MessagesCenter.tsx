import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Search, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

interface Conversation {
  client_id: string;
  client_name: string;
  business_name: string | null;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

interface Message {
  id: string;
  sender_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessagesCenter = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [adminUserId, setAdminUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchConversations = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setAdminUserId(session.user.id);

      // Fetch all messages grouped by client
      const { data: messagesData } = await supabase
        .from('client_messages')
        .select('client_id, message, created_at, is_read, sender_type')
        .order('created_at', { ascending: false });

      if (!messagesData || messagesData.length === 0) {
        setLoading(false);
        return;
      }

      // Get unique client IDs
      const clientIds = [...new Set(messagesData.map(m => m.client_id))];

      // Fetch client profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, business_name')
        .in('user_id', clientIds);

      // Build conversations
      const conversationMap = new Map<string, Conversation>();

      for (const msg of messagesData) {
        if (!conversationMap.has(msg.client_id)) {
          const profile = profiles?.find(p => p.user_id === msg.client_id);
          const unreadCount = messagesData.filter(
            m => m.client_id === msg.client_id && m.sender_type === 'client' && !m.is_read
          ).length;

          conversationMap.set(msg.client_id, {
            client_id: msg.client_id,
            client_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown' : 'Unknown',
            business_name: profile?.business_name || null,
            last_message: msg.message,
            last_message_at: msg.created_at,
            unread_count: unreadCount,
          });
        }
      }

      const convos = Array.from(conversationMap.values());
      setConversations(convos);
      setFilteredConversations(convos);
      setLoading(false);

      // Check for client param in URL
      const clientParam = searchParams.get('client');
      if (clientParam) {
        setSelectedClientId(clientParam);
        fetchMessages(clientParam);
      }
    };

    fetchConversations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('admin-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'client_messages',
        },
        (payload) => {
          const newMsg = payload.new as Message & { client_id: string };
          if (newMsg.client_id === selectedClientId) {
            setMessages(prev => [...prev, newMsg]);
          }
          // Refresh conversations
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searchParams]);

  useEffect(() => {
    if (searchValue) {
      const search = searchValue.toLowerCase();
      setFilteredConversations(
        conversations.filter(
          c => c.client_name.toLowerCase().includes(search) ||
               c.business_name?.toLowerCase().includes(search)
        )
      );
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchValue, conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (clientId: string) => {
    setLoadingMessages(true);
    
    const { data } = await supabase
      .from('client_messages')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: true });

    setMessages(data || []);
    setLoadingMessages(false);

    // Mark client messages as read
    if (data && data.length > 0) {
      const unreadIds = data
        .filter(m => m.sender_type === 'client' && !m.is_read)
        .map(m => m.id);

      if (unreadIds.length > 0) {
        await supabase
          .from('client_messages')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .in('id', unreadIds);

        // Update unread count in conversations
        setConversations(prev =>
          prev.map(c =>
            c.client_id === clientId ? { ...c, unread_count: 0 } : c
          )
        );
      }
    }
  };

  const handleSelectConversation = (clientId: string) => {
    setSelectedClientId(clientId);
    fetchMessages(clientId);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedClientId || !adminUserId) return;

    setSending(true);

    // Get conversation_id from existing messages or create new one
    let conversationId = messages.length > 0
      ? (messages[0] as any).conversation_id
      : crypto.randomUUID();

    const { error } = await supabase
      .from('client_messages')
      .insert({
        client_id: selectedClientId,
        sender_user_id: adminUserId,
        sender_type: 'admin',
        message: newMessage.trim(),
        conversation_id: conversationId,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } else {
      setNewMessage("");
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

  const formatRelativeTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 h-[calc(100vh-8rem)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages Center</h1>
          <p className="text-muted-foreground">Manage all client conversations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100%-5rem)]">
          {/* Conversations List */}
          <Card className="md:col-span-1 flex flex-col">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                {loading ? (
                  <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No conversations yet
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredConversations.map((conv) => (
                      <button
                        key={conv.client_id}
                        onClick={() => handleSelectConversation(conv.client_id)}
                        className={cn(
                          "w-full p-4 text-left hover:bg-muted/50 transition-colors",
                          selectedClientId === conv.client_id && "bg-muted"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">
                                {conv.business_name || conv.client_name}
                              </p>
                              {conv.unread_count > 0 && (
                                <Badge className="bg-primary text-primary-foreground">
                                  {conv.unread_count}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.last_message}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatRelativeTime(conv.last_message_at)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages Panel */}
          <Card className="md:col-span-2 flex flex-col">
            {!selectedClientId ? (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Select a conversation to view messages</p>
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {conversations.find(c => c.client_id === selectedClientId)?.business_name ||
                     conversations.find(c => c.client_id === selectedClientId)?.client_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className={`h-16 ${i % 2 === 0 ? 'w-3/4' : 'w-3/4 ml-auto'}`} />
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No messages yet</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "max-w-[80%] p-4 rounded-lg",
                            msg.sender_type === 'admin'
                              ? "ml-auto bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                          <p className={cn(
                            "text-xs mt-2",
                            msg.sender_type === 'admin'
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
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
                      placeholder="Type your reply..."
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
              </>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessagesCenter;
