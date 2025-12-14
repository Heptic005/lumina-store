-- Create a secure function to delete products
-- This runs with "Security Definer" privileges (bypassing RLS checks)
create or replace function delete_product_admin(target_product_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- 1. Unlink from orders (Fixes Foreign Key issue manually)
  update order_items 
  set product_id = null 
  where product_id = target_product_id;
  
  -- 2. Delete the product
  delete from products 
  where id = target_product_id;
end;
$$;
