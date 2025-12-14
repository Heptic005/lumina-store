-- Create a public bucket 'products'
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Allow public access to view images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'products' );

-- Allow authenticated users to upload images
create policy "Authenticated Uploads"
  on storage.objects for insert
  with check ( bucket_id = 'products' and auth.role() = 'authenticated' );
