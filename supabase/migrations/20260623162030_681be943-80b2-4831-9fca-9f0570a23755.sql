INSERT INTO public.user_roles (user_id, role)
SELECT p.user_id, 'b2b'::public.app_role
FROM public.profiles p
WHERE p.business_name IS NOT NULL
  AND p.business_name <> ''
ON CONFLICT (user_id, role) DO NOTHING;