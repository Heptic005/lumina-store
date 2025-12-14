-- Enable RLS on orders if not already enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to update their own orders ONLY when setting status to 'Return Requested'
-- and ONLY if the current status is 'Delivered'
CREATE POLICY "Users can request return for their own delivered orders"
ON orders
FOR UPDATE
USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id
  AND status = 'Return Requested' 
  AND orders.status = 'Delivered'
);
