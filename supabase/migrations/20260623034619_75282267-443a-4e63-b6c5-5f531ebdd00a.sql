CREATE OR REPLACE FUNCTION public.finish_b2c_account(
  _first_name text DEFAULT NULL,
  _last_name text DEFAULT NULL,
  _phone text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_email text := auth.email();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.profiles (
    user_id,
    business_email,
    first_name,
    last_name,
    phone,
    status
  )
  VALUES (
    v_user_id,
    v_email,
    NULLIF(trim(_first_name), ''),
    NULLIF(trim(_last_name), ''),
    NULLIF(trim(_phone), ''),
    'approved'::public.user_status
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    business_email = COALESCE(EXCLUDED.business_email, public.profiles.business_email),
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.profiles.last_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    status = 'approved'::public.user_status,
    updated_at = now();

  IF lower(v_email) = 'info.resurrectedlabz@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.finish_b2c_account(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.finish_b2c_account(text, text, text) TO service_role;

CREATE INDEX IF NOT EXISTS idx_profiles_business_email ON public.profiles(business_email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles(user_id, role);