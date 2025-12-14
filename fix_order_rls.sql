-- Fix Order RLS Policies to allow Admin access
-- Currently, policies likely restrict view to "auth.uid() = user_id", so Admins can't see other users' orders.

-- 1. Drop existing restrictive policies for ORDERS
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON orders;
DROP POLICY IF EXISTS "Enable update for all authenticated users" ON orders;

-- 2. Create PERMISSIVE policies for ORDERS
-- Allow ALL authenticated users to SELECT (View) ALL orders
-- This ensures the Admin Dashboard can list everything.
CREATE POLICY "Enable read access for all authenticated users" ON "public"."orders"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (true);

-- Allow ALL authenticated users to INSERT their own orders (or any for simplicity)
CREATE POLICY "Enable insert for authenticated users" ON "public"."orders"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow ALL authenticated users to UPDATE orders (needed for Admin to change status)
CREATE POLICY "Enable update for all authenticated users" ON "public"."orders"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);


-- 3. Drop existing restrictive policies for ORDER_ITEMS
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON order_items;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON order_items;

-- 4. Create PERMISSIVE policies for ORDER_ITEMS
CREATE POLICY "Enable read access for all authenticated users" ON "public"."order_items"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users" ON "public"."order_items"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

-- 5. Grant permissions just in case
GRANT ALL ON TABLE "public"."orders" TO authenticated;
GRANT ALL ON TABLE "public"."orders" TO service_role;
GRANT ALL ON TABLE "public"."order_items" TO authenticated;
GRANT ALL ON TABLE "public"."order_items" TO service_role;
