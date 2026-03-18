import { authLoadingAtom, userAtom } from '@shared/lib'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useSetAtom } from 'jotai'
import { type ReactNode, useEffect } from 'react'

type Props = {
  children: ReactNode
  client: SupabaseClient
}

export const SupabaseProvider = ({ children, client }: Props) => {
  const setUser = useSetAtom(userAtom)
  const setAuthLoading = useSetAtom(authLoadingAtom)

  useEffect(() => {
    client.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [client, setUser, setAuthLoading])

  return <>{children}</>
}
