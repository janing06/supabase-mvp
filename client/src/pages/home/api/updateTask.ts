import type { TablesUpdate } from '@shared/lib'
import { supabaseClient as client } from '@shared/lib'

export const updateTask = async (id: number, fields: Omit<TablesUpdate<'task'>, 'id'>) => {
  const { data, error } = await client.from('task').update(fields).eq('id', id).select().single()

  if (error) throw error
  return data
}
