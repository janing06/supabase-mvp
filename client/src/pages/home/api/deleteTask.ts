import { supabaseClient as client } from '@shared/lib'

export const deleteTask = async (id: number) => {
  const { error } = await client.from('task').delete().eq('id', id)

  if (error) throw error
}
