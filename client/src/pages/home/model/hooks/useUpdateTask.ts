import type { TablesUpdate } from '@shared/lib';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { updateTask } from '../../api/updateTask';

export const useUpdateTask = () => {
	const queryClient = useQueryClient();
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editingName, setEditingName] = useState('');

	const { mutate, isPending } = useMutation({
		mutationFn: ({
			id,
			fields,
		}: {
			id: number;
			fields: Omit<TablesUpdate<'task'>, 'id'>;
		}) => updateTask(id, fields),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ['task', 'list'] }),
	});

	const onCancel = () => {
		setEditingId(null);
		setEditingName('');
	};

	const onCommit = (id: number) => {
		const trimmed = editingName.trim();
		if (!trimmed) {
			onCancel();
			return;
		}
		mutate({ id, fields: { name: trimmed } }, { onSuccess: onCancel });
	};

	const onToggle = (id: number, is_completed: boolean) => {
		mutate({ id, fields: { is_completed: !is_completed } });
	};

	return {
		edit: {
			id: editingId,
			name: editingName,
			onNameChange: setEditingName,
			onStart: (id: number, name: string) => {
				setEditingId(id);
				setEditingName(name);
			},
			onCancel,
			onCommit,
			isPending,
		},
		onToggle,
	};
};
