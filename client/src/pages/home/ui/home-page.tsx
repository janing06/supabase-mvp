import { useTasks } from '../model/hooks'

export const HomePage = () => {
  const { data, isLoading, error } = useTasks()
  const tasks = data ?? []
  const errorMessage = error ? (error instanceof Error ? error.message : String(error)) : null

  return (
    <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ margin: 0, fontSize: 20 }}>Tasks</h1>

      <p style={{ marginTop: 8, color: '#666' }}>
        {isLoading ? 'Loading…' : `Showing ${tasks.length} task(s)`}
      </p>

      {errorMessage ? (
        <pre
          style={{
            marginTop: 12,
            padding: 12,
            background: '#fff3f3',
            border: '1px solid #ffd1d1',
            borderRadius: 8,
            overflowX: 'auto',
          }}
        >
          {errorMessage}
        </pre>
      ) : null}

      <ul style={{ marginTop: 12, paddingLeft: 18 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: 6 }}>
            <span style={{ marginRight: 8 }}>{task.is_completed ? '✅' : '⬜️'}</span>
            <span>{task.name}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
