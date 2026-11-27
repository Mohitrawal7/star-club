-- LOCAL TESTING ONLY. Imitates the parts of Supabase that setup.sql relies on. Never run on Supabase.
create role anon nologin; create role authenticated nologin;
create schema auth; create schema storage;
create table auth.users (id uuid primary key, email text unique);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(coalesce(current_setting('request.jwt.claims', true)::json->>'sub', ''), '')::uuid $$;
create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects (id serial primary key, bucket_id text, name text);
alter table storage.objects enable row level security;
grant usage on schema auth, storage to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
grant select, insert, delete on storage.objects to anon, authenticated;
grant usage on sequence storage.objects_id_seq to anon, authenticated;
-- Mimic "grant new tables automatically" being OFF.
