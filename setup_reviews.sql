-- Create reviews table
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id text not null,
  user_id uuid references auth.users not null,
  user_name text not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reset/Clear all reviews (Ensure we start from 0)
truncate table public.reviews;

-- Enable RLS
alter table public.reviews enable row level security;

-- Policies for reviews
-- Drop existing policies first to avoiding conflicts if re-running
drop policy if exists "Reviews are viewable by everyone" on public.reviews;
create policy "Reviews are viewable by everyone" 
  on public.reviews for select 
  using ( true );

drop policy if exists "Users can insert their own reviews" on public.reviews;
create policy "Users can insert their own reviews" 
  on public.reviews for insert 
  with check ( auth.uid() = user_id );

-- Create storage bucket for review images
insert into storage.buckets (id, name, public)
values ('reviews', 'reviews', true)
on conflict (id) do nothing;

-- Storage policies
drop policy if exists "Review images are publicly accessible" on storage.objects;
create policy "Review images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'reviews' );

drop policy if exists "Authenticated users can upload review images" on storage.objects;
create policy "Authenticated users can upload review images"
  on storage.objects for insert
  with check ( bucket_id = 'reviews' and auth.role() = 'authenticated' );
