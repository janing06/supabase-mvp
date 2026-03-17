import { client } from '@shared/lib'

type TaskRow = {
  id: number
  created_at: string
  name: string
  is_completed: boolean
}

export const listTasks = async (): Promise<TaskRow[]> => {
  const { data, error } = await client
    .from('task')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as TaskRow[]
}
