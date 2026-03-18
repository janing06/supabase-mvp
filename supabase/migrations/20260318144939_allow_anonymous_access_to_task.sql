
  create policy "Allow all operation to anon"
  on "public"."task"
  as permissive
  for all
  to anon
using (true)
with check (true);



