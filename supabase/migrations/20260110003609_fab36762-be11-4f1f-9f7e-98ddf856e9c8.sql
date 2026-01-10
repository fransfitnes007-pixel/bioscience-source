-- Add new columns to applications table for the expanded questionnaire
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS business_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS products_interest TEXT,
ADD COLUMN IF NOT EXISTS product_usage TEXT,
ADD COLUMN IF NOT EXISTS how_we_benefit TEXT,
ADD COLUMN IF NOT EXISTS company_impact TEXT,
ADD COLUMN IF NOT EXISTS monthly_volume TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS referral_source TEXT;

-- Drop the tax_id column since we're removing EIN/TIN
ALTER TABLE public.applications DROP COLUMN IF EXISTS tax_id;