DROP POLICY IF EXISTS "Admins can manage gift cards" ON public.gift_cards;

CREATE POLICY "Admins can view gift cards"
ON public.gift_cards
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create gift cards"
ON public.gift_cards
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update gift cards"
ON public.gift_cards
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete gift cards"
ON public.gift_cards
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));