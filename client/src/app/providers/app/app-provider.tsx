import { client, queryClient } from '@shared/lib'
import { SupabaseProvider } from '@shared/lib/supabase/SupabaseProvider'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

type AppProviderProps = {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        <SupabaseProvider client={client}>
          <Router>{children}</Router>
        </SupabaseProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Suspense>
  )
}
