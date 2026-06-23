GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_approved(uuid)               TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_supplier(uuid)               TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_supplier_id(uuid)           TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.validate_discount_code(text)    TO anon, authenticated;