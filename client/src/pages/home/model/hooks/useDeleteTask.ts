import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTask } from '../../api/deleteTask';

export const useDeleteTask = () => {
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: deleteTask,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ['task', 'list'] }),
	});

	return {
		onDelete: (id: number) => mutate(id),
		isPending,
	};
};
