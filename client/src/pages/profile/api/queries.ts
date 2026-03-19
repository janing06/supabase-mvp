import { queryOptions } from '@tanstack/react-query'
import { getProfile } from './getProfile'

export const profileQueries = {
  me: () => queryOptions({ queryKey: ['profile', 'me'], queryFn: getProfile }),
}
