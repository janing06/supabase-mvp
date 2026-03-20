import { paths } from '@shared/paths';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../api/signOut';

export const useSignOut = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: signOut,
		onSuccess: () => {
			queryClient.clear();
			navigate(paths.signIn);
		},
	});

	return { onSignOut: () => mutate(), isPending };
};
