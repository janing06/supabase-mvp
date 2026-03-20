import { listTasks } from '@pages/home/api/listTasks';
import { queryOptions } from '@tanstack/react-query';

export const taskQueries = {
	list: () =>
		queryOptions({
			queryKey: ['task', 'list'],
			queryFn: listTasks,
		}),
};
