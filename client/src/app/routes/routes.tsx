import { HomePageContainer } from '@pages/home'
import { NotFoundPage } from '@pages/not-found'
import { ProfilePageContainer } from '@pages/profile'
import { SignInPageContainer } from '@pages/sign-in'
import { SignUpPageContainer } from '@pages/sign-up'
import { paths } from '@shared/paths'
import type { RouteObject } from 'react-router-dom'
import { RequireAuth } from '../providers/router/require-auth'

export const routes: RouteObject[] = [
  {
    children: [
      {
        path: paths.home,
        element: (
          <RequireAuth>
            <HomePageContainer />
          </RequireAuth>
        ),
      },
      {
        path: paths.profile,
        element: (
          <RequireAuth>
            <ProfilePageContainer />
          </RequireAuth>
        ),
      },
      { path: paths.signIn, element: <SignInPageContainer /> },
      { path: paths.signUp, element: <SignUpPageContainer /> },
      { path: paths.notFound, element: <NotFoundPage /> },
    ],
  },
]
