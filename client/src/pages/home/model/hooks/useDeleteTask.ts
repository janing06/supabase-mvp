import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteTask } from '../../api/deleteTask'

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['task', 'list'] }),
  })
}
