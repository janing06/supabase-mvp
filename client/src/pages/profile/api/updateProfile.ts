import { supabaseClient } from '@shared/lib'

export const updateProfile = async ({ id, full_name }: { id: string; full_name: string }) => {
  const { data, error } = await supabaseClient
    .from('profile')
    .update({ full_name })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
