import type { SupabaseClient } from '@supabase/supabase-js'
import type { ReactNode } from 'react'
import { createContext } from 'react'

const SupabaseContext = createContext<SupabaseClient | null>(null)

type Props = {
  children: ReactNode
  client: SupabaseClient
}

export const SupabaseProvider = ({ children, client }: Props) => {
  return <SupabaseContext.Provider value={client}>{children}</SupabaseContext.Provider>
}
