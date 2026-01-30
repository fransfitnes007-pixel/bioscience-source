-- Drop existing restrictive SELECT policies
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;

-- Recreate as PERMISSIVE policies (OR logic - row passes if ANY policy matches)
CREATE POLICY "Admins can view all applications"
ON public.applications
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own applications"
ON public.applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);