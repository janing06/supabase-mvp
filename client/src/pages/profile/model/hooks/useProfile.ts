import { useQuery } from '@tanstack/react-query'
import { profileQueries } from '../../api/queries'

export const useProfile = () => useQuery(profileQueries.me())
