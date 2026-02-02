-- First, delete existing deal tiers
DELETE FROM deal_tiers;

-- Insert new deal tiers with updated thresholds and rewards
INSERT INTO deal_tiers (tier_number, name, min_spend, reward_type, reward_value, reward_description, celebration_text, is_active) VALUES
(1, 'Starter', 2000, 'percentage_discount', 10, '10% OFF your order', 'You''re on your way! 10% savings unlocked 🎖️', true),
(2, 'Bronze', 5000, 'percentage_discount', 15, '15% OFF your order', 'Nice hustle! 15% off is yours 🥉', true),
(3, 'Silver', 10000, 'percentage_discount_shipping', 20, '20% OFF + FREE Shipping', 'Big moves! 20% off + free shipping 🥈', true),
(4, 'Gold', 20000, 'percentage_discount_shipping', 30, '30% OFF + FREE Shipping', 'You''re crushing it! 30% off + free shipping 🥇', true),
(5, 'Platinum', 50000, 'bogo_shipping', NULL, 'BOGO FREE + FREE Shipping', 'Elite status! BOGO on everything + free shipping 🏆', true),
(6, 'Diamond', 100000, 'bogo_shipping_next_order', 30, 'BOGO + FREE Shipping + 30% OFF next $10k+ order', 'LEGENDARY! Full BOGO + shipping + 30% off your next big order 💎', true);