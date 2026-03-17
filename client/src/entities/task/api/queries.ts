import { listTasks } from '@shared/lib/supabase/supabaseClient'
import { queryOptions } from '@tanstack/react-query'

export const taskQueries = {
  list: () =>
    queryOptions({
      queryKey: ['task', 'list'],
      queryFn: listTasks,
    }),
}
