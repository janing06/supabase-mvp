-- Allow listing tasks from the client (anon key) while RLS is enabled.
-- Note: This is intentionally permissive for MVP/demo purposes.

create policy "task_select_anon"
on public.task
for select
to anon
using (true);

create policy "task_select_authenticated"
on public.task
for select
to authenticated
using (true);

