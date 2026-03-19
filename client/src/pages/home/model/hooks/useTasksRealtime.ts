import { supabaseClient, useUser } from '@shared/lib'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useTasksRealtime = () => {
  const queryClient = useQueryClient()
  const { user } = useUser()

  useEffect(() => {
    if (!user) return

    const channel = supabaseClient
      .channel('tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'task', filter: `user_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['task', 'list'] })
        },
      )
      .subscribe((status, err) => {
        console.log('[realtime] status:', status, err ?? '')
      })

    return () => {
      supabaseClient.removeChannel(channel)
    }
  }, [queryClient, user])
}
