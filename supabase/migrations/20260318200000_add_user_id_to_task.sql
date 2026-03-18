
-- Add user_id column linked to auth.users, defaulting to the current user
alter table "public"."task"
  add column "user_id" uuid not null default auth.uid()
  references auth.users(id) on delete cascade;

-- Drop the anonymous access policy
drop policy "Allow all operation to anon" on "public"."task";

-- Add RLS policy so authenticated users can only manage their own tasks
create policy "Users can manage their own tasks"
  on "public"."task"
  as permissive
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
