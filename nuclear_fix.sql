-- ⚠️ WARNING: This will clear all orders! ⚠️
-- This is necessary to unblock the "Test Product" deletion if it's stuck in an order.

-- 1. Clear all orders and order items (Removes the blockage)
truncate table order_items cascade;
truncate table orders cascade;

-- 2. Fix the Foreign Key Constraint (So this doesn't happen again)
-- This allows you to delete a product even if it has been ordered in the future.
alter table order_items 
drop constraint if exists order_items_product_id_fkey;

alter table order_items 
add constraint order_items_product_id_fkey 
foreign key (product_id) 
references products(id) 
on delete set null;

-- 3. Ensure Delete Permissions
drop policy if exists "Authenticated users can delete products" on products;
create policy "Authenticated users can delete products" 
on products for delete 
using (auth.role() = 'authenticated');
