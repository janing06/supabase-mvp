-- Backfill profile rows for users that signed up before the profile table existed
insert into public.profile (id, email)
select id, email from auth.users
where id not in (select id from public.profile);
