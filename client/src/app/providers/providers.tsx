import { AppProvider } from './app/app-provider'
import { AppRoute } from './router/react-router-dom-provider'

export const Providers = () => {
  return (
    <AppProvider>
      <AppRoute />
    </AppProvider>
  )
}
