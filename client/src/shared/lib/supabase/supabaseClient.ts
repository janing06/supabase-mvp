import { config } from '@shared/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = config.supabaseUrl
const supabaseAnonKey = config.supabaseAnonKey

export const client = createClient(supabaseUrl, supabaseAnonKey)

export type TaskRow = {
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
