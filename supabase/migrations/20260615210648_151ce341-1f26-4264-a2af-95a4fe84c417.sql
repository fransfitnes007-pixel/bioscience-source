
CREATE TABLE public.sms_optins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  sms_consent boolean NOT NULL DEFAULT false,
  consent_text text,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.sms_optins TO anon;
GRANT SELECT, INSERT ON public.sms_optins TO authenticated;
GRANT ALL ON public.sms_optins TO service_role;
ALTER TABLE public.sms_optins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit opt-in" ON public.sms_optins FOR INSERT TO anon, authenticated WITH CHECK (sms_consent = true);
CREATE POLICY "Admins can view opt-ins" ON public.sms_optins FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
