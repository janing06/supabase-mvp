# Supabase MVP — Project Guide

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Jotai (global auth state), TanStack React Query (server state)
- **Forms**: react-hook-form + zod
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions, Realtime)
- **Linter/Formatter**: Biome
- **CI/CD**: GitHub Actions (Supabase) + Vercel (React)

---

## Architecture

The client follows **Feature-Sliced Design (FSD)**:

```
src/
  app/          # Providers, router, root setup
  pages/        # Feature pages (home, profile, sign-in, sign-up)
    <page>/
      api/      # Supabase queries and mutations
      model/
        hooks/  # Business logic hooks
      ui/       # Presentation components
      index.ts  # Public export
  shared/       # Shared utilities, types, paths, Supabase client
```

---

## Key Patterns

### Container / Presentation

Every page has two components:

- **Container** (`*-page-container.tsx`) — composes hooks, passes props to presentation
- **Presentation** (`*-page.tsx`) — pure UI, no logic, no direct hook calls

```tsx
// Container
export const HomePageContainer = () => {
  const tasks = useTasks()
  const create = useCreateTask()
  return <HomePage tasks={tasks} create={create} />
}

// Presentation
export const HomePage = ({ tasks, create }: Props) => { ... }
```

### Hook Ownership

Hooks own all their state and expose **ready-to-use functions**, never raw `mutate`:

```ts
// ✅ correct
return { onSubmit, isPending, errors }

// ❌ wrong
return { mutate, isPending }
```

### Prop Types from Hooks

Use `ReturnType<typeof useHook>` to derive presentation prop types:

```ts
type Create = ReturnType<typeof useCreateTask>
type Props = { create: Create }
```

### Props Grouped by Concern

Group related props into objects rather than spreading them flat:

```tsx
<HomePage
  create={create}   // { show, onShow, onHide, name, onNameChange, isPending, onSubmit }
  edit={edit}       // { id, name, onNameChange, onStart, onCancel, onCommit, isPending }
  signOut={signOut} // { onSignOut, isPending }
/>
```

---

## Supabase Patterns

### Client

Always import from `@shared/lib`:

```ts
import { supabaseClient } from '@shared/lib'
```

### Types

Use generated types from `@shared/lib`:

```ts
import type { Tables, TablesUpdate } from '@shared/lib'
type Task = Tables<'task'>
```

Regenerate after schema changes:
```bash
supabase gen types typescript --local --workdir server > client/src/shared/lib/supabase/generated/types.ts
```

### Query Keys

| Data | Query Key |
|------|-----------|
| Task list | `['task', 'list']` |
| Current profile | `['profile', 'me']` |

### Query / Mutation Pattern

```ts
// api/queries.ts
export const taskQueries = {
  list: () => queryOptions({ queryKey: ['task', 'list'], queryFn: listTasks }),
}

// hooks/useTasks.ts
export const useTasks = () => useQuery(taskQueries.list())
```

### Auth State

Auth state is managed with Jotai atoms — never React context:

```ts
import { useUser } from '@shared/lib'
const { user, isLoading } = useUser()
```

### Route Protection

Wrap protected routes with `<RequireAuth>` in `routes.tsx`.

### Paths

All routes defined in `client/src/shared/paths.ts`. Always import from there:

```ts
import { paths } from '@shared/paths'
```

---

## Edge Functions

### Creating

Always use the CLI — never create manually:

```bash
supabase functions new <function-name>
```

### Auth in Edge Functions

Use `SUPABASE_SERVICE_ROLE_KEY` (not anon key) and pass the token explicitly:

```ts
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)
const token = authHeader.replace('Bearer ', '')
const { data: { user } } = await supabase.auth.getUser(token)
```

### Disabling Gateway JWT Verification

For functions that handle their own auth, disable the gateway check in `server/config.toml`:

```toml
[functions.<function-name>]
verify_jwt = false
```

And in `deploy.yml`:
```bash
supabase functions deploy <function-name> --no-verify-jwt
```

This is safe — the function validates the token itself via `getUser(token)`.

### Local Development

```bash
supabase functions serve --no-verify-jwt
```

### Storage Public URLs

Never use `getPublicUrl()` inside an edge function — it returns the internal Docker URL (`kong:8000`). Store the file path in the DB and resolve the URL client-side:

```ts
// Edge function — store path
await supabase.from('profile').update({ avatar_url: filePath })

// Client — resolve to public URL
const { data: { publicUrl } } = supabaseClient.storage.from('avatars').getPublicUrl(data.avatar_url)
```

Add a cache-busting param when the same path can be re-uploaded:
```ts
return { ...data, avatar_url: `${publicUrl}?t=${Date.now()}` }
```

---

## Realtime

Subscribe to table changes in a `useEffect`, clean up on unmount:

```ts
useEffect(() => {
  const channel = supabaseClient
    .channel('tasks')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'task' }, () => {
      queryClient.invalidateQueries({ queryKey: ['task', 'list'] })
    })
    .subscribe()
  return () => { supabaseClient.removeChannel(channel) }
}, [queryClient])
```

Enable Realtime for a table via migration:
```sql
alter publication supabase_realtime add table task;
```

---

## Migrations

### Applying Locally

```bash
# Apply pending migrations only (keeps data)
supabase migration up

# Full reset — drops and recreates everything (loses data)
supabase db reset
```

Use `migration up` during development. Only use `db reset` when a clean slate is needed.

---

## CI/CD

- **Vercel** — auto-deploys React on push to `main`
- **GitHub Actions** — runs Supabase migrations and deploys edge functions on push to `main`

Required GitHub secrets: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_ID`, `SUPABASE_DB_PASSWORD`

### SPA Routing on Vercel

`client/vercel.json` rewrites all routes to `index.html` to prevent 404s on page refresh.

---

## Formatting & Linting

Biome is the formatter and linter for the entire project including `server/functions`.

```bash
# From client/
npm run lint:fix
npm run format
```

The Deno VS Code extension is scoped to `server/functions` for type checking only — Biome handles formatting everywhere.

---

## Commit Style

Conventional commits, atomic (one logical change per commit):

```
feat: add profile page with avatar upload
fix: rewrite all routes to index.html for SPA routing
chore: deploy edge functions in CI
```

Do not stage `.plan/`, `.research/`, or `.gotstuck/` directories.
