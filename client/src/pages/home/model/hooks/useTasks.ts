import { useQuery } from '@tanstack/react-query'

import { taskQueries } from '../../api/queries'

export const useTasks = () => {
  return useQuery(taskQueries.list())
}
