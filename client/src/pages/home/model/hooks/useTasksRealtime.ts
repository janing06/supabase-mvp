import { supabaseClient } from '@shared/lib';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useTasksRealtime = () => {
	const queryClient = useQueryClient();

	useEffect(() => {
		const channel = supabaseClient
			.channel('tasks')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'task' },
				() => {
					queryClient.invalidateQueries({ queryKey: ['task', 'list'] });
				},
			)
			.subscribe();

		return () => {
			supabaseClient.removeChannel(channel);
		};
	}, [queryClient]);
};
