\set ON_ERROR_STOP on
insert into auth.users values ('11111111-1111-1111-1111-111111111111','a@test.local'),('22222222-2222-2222-2222-222222222222','b@test.local');
insert into public.admins (user_id) values ('11111111-1111-1111-1111-111111111111');
insert into public.events (slug,title,category,summary,start_date,end_date,venue,organizer) values ('secret-draft','Draft','Sports','x','2027-01-01','2027-01-01','v','o');
insert into public.notices (slug,title,body) values ('draft-notice','Draft','x');
insert into public.photos (event_id,storage_path,alt_text,status) select id,'x/draft-event.webp','x','published' from public.events where slug='secret-draft';
insert into public.event_sponsors (event_id,sponsor_id) select e.id,s.id from public.events e, public.sponsors s where e.slug='secret-draft' limit 1;

create function public.expect_blocked(q text, label text) returns void language plpgsql as $$
declare n bigint; begin
  begin execute q; get diagnostics n = row_count;
  exception when insufficient_privilege or check_violation then raise notice 'PASS blocked: %', label; return; end;
  if n = 0 then raise notice 'PASS no rows changed: %', label; else raise exception 'FAIL allowed: %', label; end if;
end $$;
create function public.expect(ok boolean, label text) returns void language plpgsql as $$
begin if ok then raise notice 'PASS %', label; else raise exception 'FAIL %', label; end if; end $$;
grant execute on function public.expect_blocked(text,text), public.expect(boolean,text) to anon, authenticated;

-- Anonymous visitor, then a signed-in user who is NOT an admin.
do $$ begin raise notice '--- visitor'; end $$;
set role anon;
select expect((select count(*) from events)=1, 'sees only the published event');
select expect((select count(*) from notices)=0, 'no draft notices');
select expect((select count(*) from photos)=0, 'no photo of a draft event');
select expect((select count(*) from event_sponsors)=4, 'no sponsor link of a draft event');
select expect_blocked('select * from admins', 'read admin list');
select expect_blocked($q$insert into notices (slug,title,body,status) values ('h','h','h','published')$q$, 'insert');
select expect_blocked($q$update events set title='hacked'$q$, 'update');
select expect_blocked('delete from sponsors', 'delete');
select expect_blocked($q$update site_settings set email='x@y.zz'$q$, 'change settings');
select expect_blocked($q$insert into storage.objects (bucket_id,name) values ('media','h.png')$q$, 'upload file');
reset role;

do $$ begin raise notice '--- signed-in non-admin'; end $$;
set role authenticated;
set request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222"}';
select expect((select count(*) from events)=1, 'sees only the published event');
select expect((select count(*) from notices)=0, 'no draft notices');
select expect((select count(*) from admins)=0, 'cannot see admins');
select expect_blocked($q$insert into notices (slug,title,body,status) values ('h','h','h','published')$q$, 'insert');
select expect_blocked($q$update events set title='hacked'$q$, 'update');
select expect_blocked('delete from sponsors', 'delete');
select expect_blocked($q$update site_settings set email='x@y.zz'$q$, 'change settings');
select expect_blocked($q$insert into admins (user_id) values ('22222222-2222-2222-2222-222222222222')$q$, 'make self admin');
select expect_blocked($q$insert into storage.objects (bucket_id,name) values ('media','h.png')$q$, 'upload file');

do $$ begin raise notice '--- admin'; end $$;
set request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111"}';
select expect((select count(*) from events)=2, 'sees drafts');
insert into notices (slug,title,body,status) values ('admin-notice','T','B','published');
update notices set title='T2' where slug='admin-notice';
select expect((select title from notices where slug='admin-notice')='T2', 'can create and edit');
delete from notices where slug='admin-notice';
update site_settings set phone='099-000000' where id=1;
insert into storage.objects (bucket_id,name) values ('media','ok.webp');
select expect(true, 'can delete, change settings and upload');
select expect_blocked($q$insert into admins (user_id) values ('22222222-2222-2222-2222-222222222222')$q$, 'admins cannot add admins through the API');
select expect_blocked($q$update site_settings set facebook_url='javascript:alert(1)'$q$, 'unsafe link rejected');
select expect_blocked($q$update events set end_date='2000-01-01' where slug='secret-draft'$q$, 'end before start rejected');
update photos set status='published' where storage_path='x/draft-event.webp';
delete from events where slug='secret-draft';
select expect((select status from photos where storage_path='x/draft-event.webp')='draft', 'photos of a deleted event become hidden');
