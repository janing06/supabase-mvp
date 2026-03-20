import { supabaseClient } from '@shared/lib';

export const createTask = async (name: string) => {
	const { data, error } = await supabaseClient
		.from('task')
		.insert({ name })
		.select()
		.single();

	if (error) throw error;
	return data;
};
