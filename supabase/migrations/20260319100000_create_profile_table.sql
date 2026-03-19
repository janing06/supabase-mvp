-- Create profile table linked to auth.users
create table public.profile (
  id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone not null default now(),
  primary key (id)
);

alter table public.profile enable row level security;

-- Users can only read and update their own profile
create policy "Users can view their own profile"
  on public.profile
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profile
  for update
  to authenticated
  using (auth.uid() = id);

-- Trigger function to auto-create a profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profile (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Fire after a new user is inserted into auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
