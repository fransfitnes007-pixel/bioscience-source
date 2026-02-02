-- Fix 1: Add input validation constraints to applications table
ALTER TABLE public.applications
ADD CONSTRAINT applications_email_format 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT applications_business_name_length 
  CHECK (length(business_name) BETWEEN 1 AND 200),
ADD CONSTRAINT applications_contact_name_length 
  CHECK (length(contact_name) BETWEEN 1 AND 100),
ADD CONSTRAINT applications_phone_format 
  CHECK (phone IS NULL OR phone ~* '^\+?[0-9\s\-\(\)]{7,20}$');

-- Fix 2: Add input validation constraints to inquiries table
ALTER TABLE public.inquiries
ADD CONSTRAINT inquiries_email_format 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT inquiries_name_length 
  CHECK (length(name) BETWEEN 1 AND 100),
ADD CONSTRAINT inquiries_business_name_length 
  CHECK (length(business_name) BETWEEN 1 AND 200);

-- Fix 3: Add input validation constraints to contact_messages table
ALTER TABLE public.contact_messages
ADD CONSTRAINT contact_messages_email_format 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT contact_messages_name_length 
  CHECK (length(name) BETWEEN 1 AND 100),
ADD CONSTRAINT contact_messages_message_length 
  CHECK (length(message) BETWEEN 1 AND 5000);

-- Fix 4: Add explicit default-deny policy for applications table
-- This ensures unauthenticated users cannot SELECT even if RLS is somehow bypassed
-- First ensure there's no conflicting policy name
DO $$ 
BEGIN
  -- The existing policies are fine, this is defense-in-depth
  -- PostgreSQL RLS already defaults to deny, but explicit is better
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'applications' 
    AND policyname = 'Block anonymous SELECT on applications'
  ) THEN
    EXECUTE 'CREATE POLICY "Block anonymous SELECT on applications" ON public.applications FOR SELECT TO anon USING (false)';
  END IF;
END $$;

-- Fix 5: Strengthen profiles table RLS - add explicit anonymous denial
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Block anonymous access to profiles'
  ) THEN
    EXECUTE 'CREATE POLICY "Block anonymous access to profiles" ON public.profiles FOR ALL TO anon USING (false)';
  END IF;
END $$;