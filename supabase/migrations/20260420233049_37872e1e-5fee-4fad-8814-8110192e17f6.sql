-- Grant admin role to admin demo user
INSERT INTO public.user_roles (user_id, role)
VALUES ('4b3565a6-43c5-49a3-acdc-d814379c772b', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Create approved affiliate record at 20% with discount code
INSERT INTO public.affiliates (
  name, email, status, is_active, commission_rate, discount_code,
  instagram, tiktok, youtube, content_niche, audience_size, why_join
) VALUES (
  'Demo Affiliate', 'affiliate@demo.com', 'approved', true, 20, 'DEMO20',
  '@demoaffiliate', '@demoaffiliate', '@demoaffiliate', 'Fitness / Peptides', '10k-50k',
  'Demo affiliate account for testing the program at 20% commission.'
)
ON CONFLICT DO NOTHING;

-- Create matching active discount code so checkout applies the 20% off
INSERT INTO public.discounts (
  code, description, discount_type, discount_value, method, applies_to,
  is_active, is_affiliate, max_uses_per_customer
) VALUES (
  'DEMO20', 'Demo affiliate 20% off (Demo Affiliate)', 'percentage', 20, 'code', 'order',
  true, true, NULL
)
ON CONFLICT DO NOTHING;