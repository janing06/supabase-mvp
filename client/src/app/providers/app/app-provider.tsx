import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

type AppProviderProps = {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>{children}</Router>
    </Suspense>
  )
}
