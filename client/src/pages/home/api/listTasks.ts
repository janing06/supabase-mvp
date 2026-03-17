import { client } from '@shared/lib'

export const listTasks = async () => {
  const { data, error } = await client
    .from('task')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}
