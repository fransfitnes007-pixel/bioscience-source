-- Extend affiliates table to support application/approval workflow
ALTER TABLE public.affiliates
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS content_niche text,
  ADD COLUMN IF NOT EXISTS audience_size text,
  ADD COLUMN IF NOT EXISTS viral_video_links text,
  ADD COLUMN IF NOT EXISTS portfolio_url text,
  ADD COLUMN IF NOT EXISTS why_join text,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid;

-- Existing affiliates default to 'approved' so the admin page keeps working.
-- New applications from the public form will use 'pending'.

-- Allow public to submit affiliate applications (insert only, status forced to pending in app)
DROP POLICY IF EXISTS "Anyone can submit affiliate applications" ON public.affiliates;
CREATE POLICY "Anyone can submit affiliate applications"
  ON public.affiliates
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending' AND is_active = false);

-- Index for filtering pending applications fast in admin
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON public.affiliates(status);