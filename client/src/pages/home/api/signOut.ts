import { supabaseClient } from '@shared/lib';

export const signOut = async () => {
	const { error } = await supabaseClient.auth.signOut();
	if (error) throw error;
};
