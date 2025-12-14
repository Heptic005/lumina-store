-- Add status column to order_items table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Processing';

-- Optional: Update existing order_items to have 'Delivered' status
-- Uncomment the line below if you want all existing items to be marked as delivered
-- UPDATE order_items SET status = 'Delivered';
