-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can create applications" ON public.applications;

-- Create a new policy that allows anyone to insert applications (public form)
CREATE POLICY "Anyone can submit applications"
ON public.applications
FOR INSERT
WITH CHECK (true);