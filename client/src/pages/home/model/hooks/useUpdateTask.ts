import type { TablesUpdate } from '@shared/lib'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask } from '../../api/updateTask'

type UpdateTaskArgs = { id: number; fields: Omit<TablesUpdate<'task'>, 'id'> }

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, fields }: UpdateTaskArgs) => updateTask(id, fields),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['task', 'list'] }),
  })
}
