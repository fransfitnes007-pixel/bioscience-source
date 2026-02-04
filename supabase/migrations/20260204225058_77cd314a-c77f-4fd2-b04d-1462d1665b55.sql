-- Create company-logos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Add company_logo_url to applications table
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS company_logo_url TEXT;

-- Add company_logo_url to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS company_logo_url TEXT;

-- Add custom labeling columns to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS custom_labeling BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS custom_labeling_logo_url TEXT,
ADD COLUMN IF NOT EXISTS custom_labeling_cost NUMERIC DEFAULT 0;

-- RLS Policies for company-logos bucket

-- Anyone can view logos (public bucket)
CREATE POLICY "Anyone can view company logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-logos');

-- Authenticated users can upload to applications folder (during application)
CREATE POLICY "Anyone can upload application logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'company-logos' AND (storage.foldername(name))[1] = 'applications');

-- Users can upload to their own profile folder
CREATE POLICY "Users can upload to own profile logo folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'company-logos' 
  AND (storage.foldername(name))[1] = 'profiles'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Users can update their own profile logos
CREATE POLICY "Users can update own profile logo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'company-logos' 
  AND (storage.foldername(name))[1] = 'profiles'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Users can delete their own profile logos
CREATE POLICY "Users can delete own profile logo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'company-logos' 
  AND (storage.foldername(name))[1] = 'profiles'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Admins can manage all logos
CREATE POLICY "Admins can manage all company logos"
ON storage.objects FOR ALL
USING (
  bucket_id = 'company-logos'
  AND has_role(auth.uid(), 'admin'::app_role)
);