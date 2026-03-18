import type { User } from '@supabase/supabase-js'
import { atom, useAtomValue } from 'jotai'

export const userAtom = atom<User | null>(null)
export const authLoadingAtom = atom(true)

export const useUser = () => ({
  user: useAtomValue(userAtom),
  isLoading: useAtomValue(authLoadingAtom),
})
