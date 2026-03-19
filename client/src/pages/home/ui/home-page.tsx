import type { Tables } from '@shared/lib'
import { paths } from '@shared/paths'
import { Check, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export type Filter = 'all' | 'pending' | 'completed'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
]

type Task = Tables<'task'>

type Summary = {
  total: number
  completed: number
  pending: number
}

type Toolbar = {
  search: string
  onSearchChange: (value: string) => void
  filter: Filter
  onFilterChange: (value: Filter) => void
}

type Create = {
  show: boolean
  onShow: () => void
  onHide: () => void
  name: string
  onNameChange: (value: string) => void
  isPending: boolean
  onSubmit: () => void
}

type Edit = {
  id: number | null
  name: string
  onNameChange: (value: string) => void
  onStart: (id: number, name: string) => void
  onCancel: () => void
  onCommit: (id: number) => void
  isPending: boolean
}

type SignOut = {
  onSignOut: () => void
  isPending: boolean
}

type Props = {
  tasks: Task[]
  isLoading: boolean
  errorMessage: string | null
  summary: Summary
  toolbar: Toolbar
  create: Create
  edit: Edit
  onToggle: (id: number, is_completed: boolean) => void
  onDelete: (id: number) => void
  isDeleting: boolean
  signOut: SignOut
}

export const HomePage = ({
  tasks,
  isLoading,
  errorMessage,
  summary,
  toolbar,
  create,
  edit,
  onToggle,
  onDelete,
  isDeleting,
  signOut,
}: Props) => {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Page title */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">TaskFlow: To-Do List</h1>
          <div className="flex items-center gap-2">
            <Link
              to={paths.profile}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Profile
            </Link>
            <button
              type="button"
              onClick={signOut.onSignOut}
              disabled={signOut.isPending}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {signOut.isPending ? 'Signing out…' : 'Sign Out'}
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* Toolbar */}
          <div className="flex items-center gap-3 border-b px-6 py-4">
            <div className="relative w-56">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-lg border bg-white py-2 pr-3 pl-9 text-sm outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="Search"
                value={toolbar.search}
                onChange={(e) => toolbar.onSearchChange(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => toolbar.onFilterChange(f.value)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    toolbar.filter === f.value
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={create.onShow}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <Plus className="size-4" />
              Create New Task
            </button>
          </div>

          {/* Inline create row */}
          {create.show && (
            <div className="flex items-center gap-3 border-b bg-blue-50 px-6 py-3">
              <input
                // biome-ignore lint/a11y/noAutofocus: intentional focus on create
                autoFocus
                className="flex-1 rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Task name…"
                value={create.name}
                onChange={(e) => create.onNameChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') create.onSubmit()
                  if (e.key === 'Escape') create.onHide()
                }}
                disabled={create.isPending}
              />
              <button
                type="button"
                onClick={create.onSubmit}
                disabled={!create.name.trim() || create.isPending}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50"
              >
                Add
              </button>
              <button
                type="button"
                onClick={create.onHide}
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
            ) : tasks.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-400">
                {toolbar.search ? `No tasks matching "${toolbar.search}"` : 'No tasks here.'}
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 py-4 ${task.is_completed ? 'bg-blue-50/40' : ''}`}
                >
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => onToggle(task.id, task.is_completed)}
                    disabled={edit.isPending}
                    className={`flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors disabled:opacity-50 ${
                      task.is_completed
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {task.is_completed && <Check className="size-3 text-white" strokeWidth={3} />}
                  </button>

                  {/* Name / inline edit */}
                  {edit.id === task.id ? (
                    <input
                      // biome-ignore lint/a11y/noAutofocus: intentional focus on edit
                      autoFocus
                      className="flex-1 rounded-lg border border-blue-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      value={edit.name}
                      onChange={(e) => edit.onNameChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') edit.onCommit(task.id)
                        if (e.key === 'Escape') edit.onCancel()
                      }}
                      onBlur={() => edit.onCommit(task.id)}
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
                    {edit.id === task.id ? (
                      <button
                        type="button"
                        onClick={edit.onCancel}
                        className="rounded-lg bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200"
                      >
                        <X className="size-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => edit.onStart(task.id, task.name)}
                        className="rounded-lg bg-blue-50 p-2 text-blue-500 transition-colors hover:bg-blue-100"
                      >
                        <Pencil className="size-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(task.id)}
                      disabled={isDeleting}
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
          {!isLoading && summary.total > 0 && (
            <div className="flex gap-6 border-t px-6 py-4 text-sm text-gray-500">
              <span>
                Total Tasks: <span className="font-medium text-gray-700">{summary.total}</span>
              </span>
              <span>
                Completed: <span className="font-medium text-gray-700">{summary.completed}</span>
              </span>
              <span>
                Pending: <span className="font-medium text-gray-700">{summary.pending}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
