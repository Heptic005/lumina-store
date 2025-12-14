-- DEBUG: Disable RLS on products table
-- This will allow ANYONE to delete products.
-- Use this ONLY to verify if RLS is the problem.

alter table products disable row level security;
