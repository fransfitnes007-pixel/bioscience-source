-- Drop existing restrictive policies on cart_items
DROP POLICY IF EXISTS "Users can view own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can insert to own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can update own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can delete from own cart" ON cart_items;

-- Recreate as PERMISSIVE policies (default)
CREATE POLICY "Users can view own cart" 
ON cart_items FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own cart" 
ON cart_items FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart" 
ON cart_items FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart" 
ON cart_items FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);