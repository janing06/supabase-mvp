import { supabaseClient } from '@shared/lib';

export const listTasks = async () => {
	const { data, error } = await supabaseClient
		.from('task')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) throw error;
	return data ?? [];
};
