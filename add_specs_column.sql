-- Add specs column to products table
alter table products 
add column if not exists specs jsonb default '{}'::jsonb;

-- Comment on column
comment on column products.specs is 'JSONB object storing product specifications (Key-Value pairs) and variants';
