-- Drop existing policies to avoid conflicts (if they exist)
drop policy if exists "Admins can update products" on products;
drop policy if exists "Admins can delete products" on products;
drop policy if exists "Admins can view all orders" on orders;
drop policy if exists "Admins can update orders" on orders;

-- Enable full access for ALL authenticated users (Temporary fix for metadata issue)
create policy "Authenticated users can update products" 
on products for update 
using (auth.role() = 'authenticated');

create policy "Authenticated users can delete products" 
on products for delete 
using (auth.role() = 'authenticated');

create policy "Authenticated users can insert products" 
on products for insert 
with check (auth.role() = 'authenticated');

-- Orders
create policy "Authenticated users can view all orders" 
on orders for select 
using (auth.role() = 'authenticated');

create policy "Authenticated users can update orders" 
on orders for update 
using (auth.role() = 'authenticated');
