-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PRODUCTS TABLE
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric not null,
  image text,
  category text,
  stock integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ORDERS TABLE
create table orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  total numeric not null,
  status text default 'Processing',
  shipping_address jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ORDER ITEMS TABLE
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id),
  product_name text,
  quantity integer not null,
  price numeric not null
);

-- RLS POLICIES (Security)
alter table products enable row level security;
create policy "Public products are viewable by everyone" on products for select using (true);
create policy "Anyone can insert products (for seeding)" on products for insert with check (true); 

alter table orders enable row level security;
create policy "Users can view their own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can insert their own orders" on orders for insert with check (auth.uid() = user_id);

alter table order_items enable row level security;
create policy "Users can view their own order items" on order_items for select using (
  exists ( select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
);
create policy "Users can insert their own order items" on order_items for insert with check (
  exists ( select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
);
