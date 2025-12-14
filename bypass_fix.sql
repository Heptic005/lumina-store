-- RPC Bypass: Use a Function to delete (Uses POST instead of DELETE)
-- This bypasses browser/network blocks on the DELETE method.

create or replace function delete_product_v2(target_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Just delete the product. 
  -- (Foreign Keys are already fixed to SET NULL, so this is safe)
  delete from products where id = target_id;
end;
$$;
