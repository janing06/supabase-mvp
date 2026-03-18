import { Check } from 'lucide-react'

import { useTasks } from '../model/hooks'

export const HomePage = () => {
  const { data, isLoading, error } = useTasks()
  const tasks = data ?? []
  const errorMessage = error ? (error instanceof Error ? error.message : String(error)) : null

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? 'Loading…' : `${tasks.length} task${tasks.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {errorMessage ? (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <ul className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
              <li key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </ul>
        ) : tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">No tasks yet.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-sm transition-colors hover:bg-accent/40"
              >
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    task.is_completed ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                  }`}
                >
                  {task.is_completed && <Check className="size-3 text-primary-foreground" />}
                </span>
                <span
                  className={`flex-1 text-sm ${
                    task.is_completed ? 'text-muted-foreground line-through' : 'text-foreground'
                  }`}
                >
                  {task.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
