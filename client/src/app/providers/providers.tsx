import { SupabaseProvider } from '@app/providers/app/supabase-provider.tsx/supabase-provider'
import { client } from '@shared/lib'
import { AppProvider } from './app/app-provider'
import { AppRoute } from './router/react-router-dom-provider'

export const Providers = () => {
  return (
    <SupabaseProvider client={client}>
      <AppProvider>
        <AppRoute />
      </AppProvider>
    </SupabaseProvider>
  )
}
