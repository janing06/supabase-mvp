import { useQuery } from '@tanstack/react-query'

import { taskQueries } from './queries'

export const useTasks = () => {
  return useQuery(taskQueries.list())
}
