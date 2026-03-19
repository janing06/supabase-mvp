import { supabaseClient } from '@shared/lib'

export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const { data, error } = await supabaseClient.functions.invoke('upload-avatar', {
    body: formData,
  })

  if (error) throw error
  return data.file_path
}
