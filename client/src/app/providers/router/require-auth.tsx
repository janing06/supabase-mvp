import { useUser } from '@shared/lib'
import { paths } from '@shared/paths'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

type Props = {
  children: ReactNode
}

export const RequireAuth = ({ children }: Props) => {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-sm text-gray-400">Loading…</div>
      </main>
    )
  }

  if (!user) return <Navigate to={paths.signIn} replace />

  return <>{children}</>
}
