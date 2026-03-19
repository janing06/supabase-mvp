import type { useUpdateProfile } from '../model/hooks/useUpdateProfile'
import type { useUploadAvatar } from '../model/hooks/useUploadAvatar'

type UpdateProfile = ReturnType<typeof useUpdateProfile>
type UploadAvatar = ReturnType<typeof useUploadAvatar>

type Props = {
  avatarUrl: string | null
  fullName: string | null
  email: string | null
  updateProfile: UpdateProfile
  uploadAvatar: UploadAvatar
}

export const ProfilePage = ({ avatarUrl, fullName, email, updateProfile, uploadAvatar }: Props) => {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Profile</h1>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* Avatar section */}
          <div className="flex flex-col items-center gap-4 border-b px-6 py-8">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="size-24 rounded-full object-cover ring-2 ring-gray-100"
                />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-500">
                  {fullName ? fullName[0].toUpperCase() : '?'}
                </div>
              )}
              {uploadAvatar.isPending && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
                  <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>

            <label className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
              {uploadAvatar.isPending ? 'Uploading…' : 'Change Photo'}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={uploadAvatar.isPending}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) uploadAvatar.onUpload(file)
                  e.target.value = ''
                }}
              />
            </label>
          </div>

          {/* Profile info */}
          <div className="px-6 py-6">
            {email && (
              <div className="mb-4">
                <p className="mb-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm text-gray-700">{email}</p>
              </div>
            )}

            <form onSubmit={updateProfile.onSubmit} noValidate>
              <div className="mb-4">
                <label
                  htmlFor="full_name"
                  className="mb-1 block text-xs font-medium text-gray-400 uppercase tracking-wide"
                >
                  Full Name
                </label>
                <input
                  id="full_name"
                  type="text"
                  {...updateProfile.register('full_name')}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 ${
                    updateProfile.errors.full_name
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-gray-200 focus:border-blue-400'
                  }`}
                />
                {updateProfile.errors.full_name && (
                  <p className="mt-1 text-xs text-red-500">
                    {updateProfile.errors.full_name.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="w-full rounded-xl bg-blue-500 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {updateProfile.isPending
                  ? 'Saving…'
                  : updateProfile.isSuccess
                    ? 'Saved!'
                    : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
