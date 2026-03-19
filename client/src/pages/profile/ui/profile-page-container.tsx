import { useProfile, useUpdateProfile, useUploadAvatar } from '../model/hooks'
import { ProfilePage } from './profile-page'

export const ProfilePageContainer = () => {
  const { data } = useProfile()
  const updateProfile = useUpdateProfile({
    id: data?.id ?? null,
    currentFullName: data?.full_name ?? null,
  })
  const uploadAvatar = useUploadAvatar()

  return (
    <ProfilePage
      avatarUrl={data?.avatar_url ?? null}
      fullName={data?.full_name ?? null}
      email={data?.email ?? null}
      updateProfile={updateProfile}
      uploadAvatar={uploadAvatar}
    />
  )
}
