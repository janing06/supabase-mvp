import { supabaseClient, useUser } from '@shared/lib'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useTasksRealtime = () => {
  const queryClient = useQueryClient()
  const { user } = useUser()

  useEffect(() => {
    console.log('before !user')
    if (!user) return

    console.log('after !user')

    let channel: ReturnType<typeof supabaseClient.channel> | null = null
    let cancelled = false

    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return

      supabaseClient.realtime.setAuth(session?.access_token ?? null)

      channel = supabaseClient
        .channel('tasks')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'task', filter: `user_id=eq.${user.id}` },
          () => {
            queryClient.invalidateQueries({ queryKey: ['task', 'list'] })
          },
        )
        .subscribe()
    })

    return () => {
      cancelled = true
      if (channel) supabaseClient.removeChannel(channel)
    }
  }, [queryClient, user])
}
