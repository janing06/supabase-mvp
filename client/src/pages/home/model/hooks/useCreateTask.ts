import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createTask } from '../../api/createTask'

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => createTask(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['task', 'list'] }),
  })
}
