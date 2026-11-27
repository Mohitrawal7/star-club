-- Run after creating the person under Authentication > Users.
-- Replace both values, then run. It should report 1 row.
insert into public.admins (user_id, display_name)
select id, 'ADMIN NAME' from auth.users where email = 'admin@their-email.example'
returning display_name;
