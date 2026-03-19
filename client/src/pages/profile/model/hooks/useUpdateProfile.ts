import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateProfile } from '../../api/updateProfile'

const schema = z.object({
  full_name: z.string().min(1, 'Name is required'),
})

type Inputs = z.infer<typeof schema>

export const useUpdateProfile = ({
  id,
  currentFullName,
}: {
  id: string | null
  currentFullName: string | null
}) => {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: '' },
  })

  useEffect(() => {
    if (currentFullName !== null) reset({ full_name: currentFullName })
  }, [currentFullName, reset])

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', 'me'] }),
  })

  const onSubmit = handleSubmit(({ full_name }) => {
    if (!id) return
    mutate({ id, full_name })
  })

  return { register, errors, isPending, isSuccess, onSubmit }
}
