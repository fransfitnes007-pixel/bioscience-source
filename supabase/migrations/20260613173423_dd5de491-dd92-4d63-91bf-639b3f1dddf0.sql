
INSERT INTO public.deal_tiers (tier_number, name, min_spend, reward_type, reward_value, reward_description, celebration_text, is_active) VALUES
(1, 'Tier 1', 1500,  'percent_off', 5,  '5% off your order',  'Tier 1 unlocked!', true),
(2, 'Tier 2', 3000,  'percent_off', 8,  '8% off your order',  'Tier 2 unlocked!', true),
(3, 'Tier 3', 5000,  'percent_off', 10, '10% off your order', 'Tier 3 unlocked!', true),
(4, 'Tier 4', 7500,  'percent_off', 12, '12% off your order', 'Tier 4 unlocked!', true),
(5, 'Tier 5', 10000, 'percent_off', 15, '15% off your order', 'Tier 5 unlocked!', true),
(6, 'Tier 6', 15000, 'percent_off_plus_shipping', 18, '18% off + free priority shipping', 'Elite Tier unlocked!', true);
