import { supabaseClient } from '@shared/lib'

export const signUp = async ({ email, password }: { email: string; password: string }) => {
  const { data, error } = await supabaseClient.auth.signUp({ email, password })
  if (error) throw error
  return data
}
