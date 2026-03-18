import { HomePageContainer } from '@pages/home'
import { NotFoundPage } from '@pages/not-found'
import { paths } from '@shared/paths'
import type { RouteObject } from 'react-router-dom'

export const routes: RouteObject[] = [
  {
    children: [
      { path: paths.home, element: <HomePageContainer /> },
      { path: paths.notFound, element: <NotFoundPage /> },
    ],
  },
]
