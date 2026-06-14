
CREATE TYPE public.agreement_type AS ENUM ('purchaser_terms', 'b2b_terms', 'creator_campaign');

CREATE TABLE public.agreement_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  agreement_type public.agreement_type NOT NULL,
  agreement_version TEXT NOT NULL DEFAULT 'v1',
  signer_name TEXT,
  signer_email TEXT,
  initials TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  counter_signed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  counter_signed_at TIMESTAMPTZ,
  counter_signer_initials TEXT,
  status TEXT NOT NULL DEFAULT 'signed',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_agreement_sigs_user ON public.agreement_signatures(user_id);
CREATE INDEX idx_agreement_sigs_type ON public.agreement_signatures(agreement_type);

GRANT SELECT, INSERT ON public.agreement_signatures TO authenticated;
GRANT ALL ON public.agreement_signatures TO service_role;

ALTER TABLE public.agreement_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own signatures"
  ON public.agreement_signatures FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users insert own signatures"
  ON public.agreement_signatures FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins update signatures (counter-sign)"
  ON public.agreement_signatures FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_agreement_sigs_updated
  BEFORE UPDATE ON public.agreement_signatures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
