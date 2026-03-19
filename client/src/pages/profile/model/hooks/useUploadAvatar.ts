import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadAvatar } from '../../api/uploadAvatar'

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', 'me'] }),
  })

  const onUpload = (file: File) => mutate(file)

  return { onUpload, isPending }
}
