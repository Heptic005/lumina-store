-- 1. Fix RLS Policies (Ensure permissions are correct)
-- Drop potential conflicting policies
drop policy if exists "Admins can update products" on products;
drop policy if exists "Admins can delete products" on products;
drop policy if exists "Authenticated users can update products" on products;
drop policy if exists "Authenticated users can delete products" on products;
drop policy if exists "Authenticated users can insert products" on products;

-- Re-create permissive policies for authenticated users
create policy "Authenticated users can update products" 
on products for update 
using (auth.role() = 'authenticated');

create policy "Authenticated users can delete products" 
on products for delete 
using (auth.role() = 'authenticated');

create policy "Authenticated users can insert products" 
on products for insert 
with check (auth.role() = 'authenticated');

-- 2. Fix Foreign Key Constraint
-- This allows deleting a product even if it has been ordered.
-- The order_item will remain, but product_id will become NULL.
alter table order_items 
drop constraint if exists order_items_product_id_fkey;

alter table order_items 
add constraint order_items_product_id_fkey 
foreign key (product_id) 
references products(id) 
on delete set null;
