-- Create client_messages table for direct messaging between clients and admin
CREATE TABLE public.client_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL DEFAULT gen_random_uuid(),
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'admin')),
  sender_user_id UUID NOT NULL,
  client_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_client_messages_client_id ON public.client_messages(client_id);
CREATE INDEX idx_client_messages_conversation_id ON public.client_messages(conversation_id);
CREATE INDEX idx_client_messages_created_at ON public.client_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
ON public.client_messages
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert messages
CREATE POLICY "Admins can insert messages"
ON public.client_messages
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update messages (mark as read)
CREATE POLICY "Admins can update messages"
ON public.client_messages
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Clients can view their own messages
CREATE POLICY "Clients can view own messages"
ON public.client_messages
FOR SELECT
USING (auth.uid() = client_id);

-- Clients can insert their own messages
CREATE POLICY "Clients can insert own messages"
ON public.client_messages
FOR INSERT
WITH CHECK (auth.uid() = client_id AND sender_type = 'client');

-- Clients can update their own messages (mark as read)
CREATE POLICY "Clients can update own messages"
ON public.client_messages
FOR UPDATE
USING (auth.uid() = client_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_messages;