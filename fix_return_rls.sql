-- Drop the potentially incorrect policy
DROP POLICY IF EXISTS "Users can request return for their own delivered orders" ON orders;

-- Correct Policy:
-- USING: Checks the OLD row (must be the user's AND currently 'Delivered')
-- WITH CHECK: Checks the NEW row (must be 'Return Requested')
CREATE POLICY "Users can request return for their own delivered orders"
ON orders
FOR UPDATE
USING (
  auth.uid() = user_id
  AND status = 'Delivered'
)
WITH CHECK (
  status = 'Return Requested'
);
