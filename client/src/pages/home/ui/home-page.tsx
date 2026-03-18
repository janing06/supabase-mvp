import { Check, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { useState } from 'react'

import { useCreateTask, useDeleteTask, useTasks, useUpdateTask } from '../model/hooks'

type Filter = 'all' | 'pending' | 'completed'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
]

export const HomePage = () => {
  const { data, isLoading, error } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const tasks = data ?? []
  const errorMessage = error ? (error instanceof Error ? error.message : String(error)) : null

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')

  const completedCount = tasks.filter((t) => t.is_completed).length
  const pendingCount = tasks.filter((t) => !t.is_completed).length

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === 'completed') return t.is_completed
      if (filter === 'pending') return !t.is_completed
      return true
    })
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))

  const handleCreate = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    createTask.mutate(trimmed, {
      onSuccess: () => {
        setNewName('')
        setShowCreate(false)
      },
    })
  }

  const handleToggle = (id: number, is_completed: boolean) => {
    updateTask.mutate({ id, fields: { is_completed: !is_completed } })
  }

  const startEdit = (id: number, name: string) => {
    setEditingId(id)
    setEditingName(name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const commitEdit = (id: number) => {
    const trimmed = editingName.trim()
    if (!trimmed) return cancelEdit()
    updateTask.mutate({ id, fields: { name: trimmed } }, { onSuccess: cancelEdit })
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Page title */}
        <h1 className="mb-6 text-3xl font-bold text-gray-800">TaskFlow: To-Do List</h1>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex items-center gap-3 border-b px-6 py-4">
            {/* Search */}
            <div className="relative w-56">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-lg border bg-white py-2 pr-3 pl-9 text-sm outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    filter === f.value
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Create button */}
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <Plus className="size-4" />
              Create New Task
            </button>
          </div>

          {/* Inline create row */}
          {showCreate && (
            <div className="flex items-center gap-3 border-b bg-blue-50 px-6 py-3">
              <input
                // biome-ignore lint/a11y/noAutofocus: intentional focus on create
                autoFocus
                className="flex-1 rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Task name…"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate()
                  if (e.key === 'Escape') {
                    setShowCreate(false)
                    setNewName('')
                  }
                }}
                disabled={createTask.isPending}
              />
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newName.trim() || createTask.isPending}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreate(false)
                  setNewName('')
                }}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:text-gray-600"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Error */}
          {errorMessage && (
            <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          {/* Task list */}
          <div className="divide-y px-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
                <div key={i} className="my-2 h-16 animate-pulse rounded-lg bg-gray-100" />
              ))
            ) : filteredTasks.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-400">
                {search ? `No tasks matching "${search}"` : 'No tasks here.'}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 py-4 ${task.is_completed ? 'bg-blue-50/40' : ''}`}
                >
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggle(task.id, task.is_completed)}
                    disabled={updateTask.isPending}
                    className={`flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors disabled:opacity-50 ${
                      task.is_completed
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {task.is_completed && <Check className="size-3 text-white" strokeWidth={3} />}
                  </button>

                  {/* Name / inline edit */}
                  {editingId === task.id ? (
                    <input
                      // biome-ignore lint/a11y/noAutofocus: intentional focus on edit
                      autoFocus
                      className="flex-1 rounded-lg border border-blue-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitEdit(task.id)
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      onBlur={() => commitEdit(task.id)}
                    />
                  ) : (
                    <span
                      className={`flex-1 text-sm font-medium ${
                        task.is_completed ? 'text-gray-400 line-through' : 'text-gray-800'
                      }`}
                    >
                      {task.name}
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    {editingId === task.id ? (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-lg bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200"
                      >
                        <X className="size-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(task.id, task.name)}
                        className="rounded-lg bg-blue-50 p-2 text-blue-500 transition-colors hover:bg-blue-100"
                      >
                        <Pencil className="size-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteTask.mutate(task.id)}
                      disabled={deleteTask.isPending}
                      className="rounded-lg bg-red-50 p-2 text-red-400 transition-colors hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {!isLoading && tasks.length > 0 && (
            <div className="flex gap-6 border-t px-6 py-4 text-sm text-gray-500">
              <span>
                Total Tasks: <span className="font-medium text-gray-700">{tasks.length}</span>
              </span>
              <span>
                Completed: <span className="font-medium text-gray-700">{completedCount}</span>
              </span>
              <span>
                Pending: <span className="font-medium text-gray-700">{pendingCount}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
