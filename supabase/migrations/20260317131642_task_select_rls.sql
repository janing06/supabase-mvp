drop policy "task_select_anon" on "public"."task";

drop policy "task_select_authenticated" on "public"."task";


  create policy "Enable read access for all users"
  on "public"."task"
  as permissive
  for select
  to anon
using (true);



