import { useState } from 'react'

import { useCreateTask, useDeleteTask, useSignOut, useTasks, useUpdateTask } from '../model/hooks'
import { type Filter, HomePage } from './home-page'

export const HomePageContainer = () => {
  const { data, isLoading, error } = useTasks()
  const create = useCreateTask()
  const { edit, onToggle } = useUpdateTask()
  const { onDelete, isPending: isDeleting } = useDeleteTask()
  const signOut = useSignOut()

  const tasks = data ?? []
  const errorMessage = error ? (error instanceof Error ? error.message : String(error)) : null

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === 'completed') return t.is_completed
      if (filter === 'pending') return !t.is_completed
      return true
    })
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <HomePage
      tasks={filteredTasks}
      isLoading={isLoading}
      errorMessage={errorMessage}
      summary={{
        total: tasks.length,
        completed: tasks.filter((t) => t.is_completed).length,
        pending: tasks.filter((t) => !t.is_completed).length,
      }}
      toolbar={{ search, onSearchChange: setSearch, filter, onFilterChange: setFilter }}
      create={create}
      edit={edit}
      onToggle={onToggle}
      onDelete={onDelete}
      isDeleting={isDeleting}
      signOut={signOut}
    />
  )
}
