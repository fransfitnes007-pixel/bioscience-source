-- Drop existing restrictive UPDATE policy
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;

-- Recreate as PERMISSIVE policy
CREATE POLICY "Admins can update applications"
ON public.applications
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));