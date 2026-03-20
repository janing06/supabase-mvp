import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { createTask } from '../../api/createTask';

export const useCreateTask = () => {
	const queryClient = useQueryClient();
	const [show, setShow] = useState(false);
	const [name, setName] = useState('');

	const { mutate, isPending } = useMutation({
		mutationFn: createTask,
		onSuccess: () => {
			setName('');
			setShow(false);
			queryClient.invalidateQueries({ queryKey: ['task', 'list'] });
		},
	});

	const onSubmit = () => {
		const trimmed = name.trim();
		if (trimmed) mutate(trimmed);
	};

	const onHide = () => {
		setShow(false);
		setName('');
	};

	return {
		show,
		name,
		onNameChange: setName,
		onShow: () => setShow(true),
		onHide,
		onSubmit,
		isPending,
	};
};
