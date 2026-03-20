import { supabaseClient } from '@shared/lib';

export const getProfile = async () => {
	const { data, error } = await supabaseClient
		.from('profile')
		.select('*')
		.single();
	if (error) throw error;
	if (data.avatar_url) {
		const {
			data: { publicUrl },
		} = supabaseClient.storage.from('avatars').getPublicUrl(data.avatar_url);
		return { ...data, avatar_url: `${publicUrl}?t=${Date.now()}` };
	}
	return data;
};
