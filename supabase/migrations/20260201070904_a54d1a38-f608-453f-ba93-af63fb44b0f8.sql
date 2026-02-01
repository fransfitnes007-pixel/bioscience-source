-- Add columns to cart_items to store product details directly
-- This allows the cart to work with locally-defined products

ALTER TABLE public.cart_items
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS variation_name TEXT,
ADD COLUMN IF NOT EXISTS unit_price NUMERIC,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Make product_id and variation_id nullable since we're storing details directly
-- They are already nullable per the schema