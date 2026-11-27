-- Star Club database setup. Run once in Supabase > SQL Editor on a NEW project.
-- It runs as one transaction: if anything fails, nothing is changed.
begin;

create schema if not exists private;

create function private.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;

-- Who may manage the website. Rows are added only here in the SQL Editor.
create table public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function private.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()))
$$;

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 100),
  title text not null check (length(btrim(title)) between 1 and 160),
  category text not null check (category in ('Sports','Creative')),
  summary text not null check (length(btrim(summary)) between 1 and 400),
  description text check (length(description) <= 5000),
  start_date date not null,
  end_date date not null,
  local_date text check (length(local_date) <= 60),
  venue text not null check (length(btrim(venue)) between 1 and 160),
  organizer text not null check (length(btrim(organizer)) between 1 and 160),
  format text check (length(format) <= 1000),
  facts text check (length(facts) <= 1000),
  results text check (length(results) <= 1000),
  sponsor_note text check (length(sponsor_note) <= 400),
  registration_url text check (registration_url ~ '^https://'),
  registration_deadline date,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);
create index events_status_date on public.events (status, start_date desc);

create table public.notices (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 100),
  title text not null check (length(btrim(title)) between 1 and 160),
  body text not null check (length(btrim(body)) between 1 and 10000),
  published_at date not null default ((now() at time zone 'Asia/Kathmandu')::date),
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index notices_status_date on public.notices (status, published_at desc);

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete set null,
  storage_path text not null unique,
  alt_text text not null check (length(btrim(alt_text)) between 1 and 200),
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Deleting an event hides its photos, so they never become public by accident.
create function private.hide_event_photos() returns trigger language plpgsql set search_path = '' as $$
begin update public.photos set status = 'draft' where event_id = old.id; return old; end $$;
create trigger hide_photos before delete on public.events for each row execute function private.hide_event_photos();
create index photos_event_order on public.photos (event_id, sort_order);

create table public.committee_members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 1 and 120),
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (length(btrim(name)) between 1 and 120),
  logo_path text,
  website_url text check (website_url ~ '^https://'),
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_sponsors (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, sponsor_id)
);
create index event_sponsors_sponsor on public.event_sponsors (sponsor_id);

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  registration_wording text not null check (length(btrim(registration_wording)) between 1 and 300),
  email text check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (phone ~ '^[0-9+() -]{6,25}$'),
  facebook_url text check (facebook_url ~ '^https://'),
  instagram_url text check (instagram_url ~ '^https://'),
  tiktok_url text check (tiktok_url ~ '^https://'),
  youtube_url text check (youtube_url ~ '^https://'),
  membership_form_url text check (membership_form_url ~ '^https://'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$ declare t text; begin
  foreach t in array array['admins','events','notices','photos','committee_members','sponsors','event_sponsors','site_settings'] loop
    execute format('create trigger touch before update on public.%I for each row execute function private.touch_updated_at()', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;

-- API access is granted table by table (automatic grants are switched off).
grant usage on schema public to anon, authenticated;
grant usage on schema private to authenticated;
revoke execute on all functions in schema private from public;
grant execute on function private.is_admin() to authenticated;

grant select on public.events, public.notices, public.photos, public.committee_members,
  public.sponsors, public.event_sponsors, public.site_settings to anon;
grant select, insert, update, delete on public.events, public.notices, public.photos,
  public.committee_members, public.sponsors, public.event_sponsors to authenticated;
grant select, insert, update on public.site_settings to authenticated;
grant select on public.admins to authenticated;

create policy "see own admin row" on public.admins for select to authenticated using (user_id = (select auth.uid()));

-- Visitors (and any signed-in non-admin) see published content only.
create policy "public read" on public.events for select to anon, authenticated using (status = 'published');
create policy "public read" on public.notices for select to anon, authenticated using (status = 'published');
create policy "public read" on public.committee_members for select to anon, authenticated using (status = 'published');
create policy "public read" on public.sponsors for select to anon, authenticated using (status = 'published');
create policy "public read" on public.photos for select to anon, authenticated using (
  status = 'published' and (event_id is null or exists (select 1 from public.events e where e.id = event_id and e.status = 'published')));
create policy "public read" on public.event_sponsors for select to anon, authenticated using (
  exists (select 1 from public.events e where e.id = event_id and e.status = 'published')
  and exists (select 1 from public.sponsors s where s.id = sponsor_id and s.status = 'published'));
create policy "public read" on public.site_settings for select to anon, authenticated using (true);

do $$ declare t text; begin
  foreach t in array array['events','notices','photos','committee_members','sponsors','event_sponsors','site_settings'] loop
    execute format('create policy "admins manage" on public.%I for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', t);
  end loop;
end $$;

-- Photo and logo files. A public bucket: anyone with a file's link can open it.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg','image/png','image/webp']);

create policy "admins list media" on storage.objects for select to authenticated using (bucket_id = 'media' and (select private.is_admin()));
create policy "admins add media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and (select private.is_admin()));
create policy "admins delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and (select private.is_admin()));

-- Confirmed starting content.
insert into public.site_settings (id, registration_wording)
values (1, 'Not yet registered. Government registration is being prepared.');

insert into public.events (slug, title, category, summary, start_date, end_date, local_date, venue, organizer, format, facts, sponsor_note, status)
values ('bhuwan-memorial-futsal-cup', 'Bhuwan Memorial Futsal Cup', 'Sports',
  'A 17-team futsal tournament organized by Star Club at Royal Futsal.', '2026-10-23', '2026-10-25', 'Kartik 6–8, 2083',
  'Royal Futsal', 'Star Club', 'A group stage, followed by a knockout round for the top 8 teams.',
  E'Teams: 17\nGroups: 4', 'Other businesses also sponsored this event.', 'published');

insert into public.sponsors (name, status) values
  ('Perfect Ladies Shop','published'), ('Chiyadani','published'), ('Goldstar Shoes MNR','published'), ('Farwest Dental Home','published');

insert into public.event_sponsors (event_id, sponsor_id, sort_order)
select e.id, s.id, case s.name when 'Perfect Ladies Shop' then 1 when 'Chiyadani' then 2 when 'Goldstar Shoes MNR' then 3 else 4 end
from public.events e cross join public.sponsors s where e.slug = 'bhuwan-memorial-futsal-cup';

commit;
