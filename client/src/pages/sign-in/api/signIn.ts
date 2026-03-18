import { supabaseClient } from '@shared/lib'

export const signIn = async ({ email, password }: { email: string; password: string }) => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}
