# AGENTS.md

This file provides guidelines for agentic coding assistants operating in this repository.

## Project Overview

Full-stack task management app with React frontend and Supabase backend. Features: auth, CRUD tasks with real-time sync, profile with avatar upload via Edge Function.

**Stack**: React 19, TypeScript, Vite, TanStack Query, Jotai, Tailwind CSS, shadcn/ui, Supabase, Biome

---

## Build Commands (from `client/`)

```bash
# Development
npm run dev                    # Start dev server

# Type checking
npm run ts:check              # TypeScript check (tsc -b)

# Linting & Formatting (Biome)
npm run lint                  # Check lint (errors only)
npm run lint:fix              # Fix lint issues automatically
npm run format                # Format code
npm run ci                    # CI mode (check without write)

# Architecture validation
npm run fsd                   # Feature-Sliced Design validation
npm run knip                  # Unused exports/dependencies check

# All checks (run before committing)
npm run check-all             # ts:check + lint + format + fsd + knip

# Generate types after schema changes
npm run gen:types             # supabase gen types typescript --local > types.ts

# Build
npm run build                 # Production build (tsc -b && vite build)
```

**No test runner is configured** in this project.

---

## Path Aliases

All aliases are relative to `client/src/`:

| Alias | Path |
|-------|------|
| `@/*` | `./src/*` |
| `@app/*` | `./src/app/*` |
| `@pages/*` | `./src/pages/*` |
| `@shared/*` | `./src/shared/*` |

**Always use `@shared/lib` for Supabase client imports**, never direct paths.

---

## Code Style

### Formatting (Biome)

- **Indent**: Tabs (not spaces)
- **Quotes**: Single quotes
- **Semicolons**: No ( ASI )
- **Trailing commas**: Biome default (multi-line only)
- **Line width**: Biome default (80 chars)

Run `npm run lint:fix && npm run format` before committing.

### TypeScript

- **Strict mode enabled** — no implicit any, no implicit returns
- **No `any`** — use proper types or `unknown` with type narrowing
- **`verbatimModuleSyntax`** — always use `import type` for type-only imports

```ts
// ✅ correct
import type { Tables } from '@shared/lib'
const task: Tables<'task'> = ...

// ❌ wrong
import { Tables } from '@shared/lib'
```

---

## Architecture (FSD)

```
src/
├── app/                    # Providers, router, routes
├── pages/                  # Feature pages
│   └── <page>/
│       ├── api/           # Supabase queries/mutations
│       ├── model/
│       │   └── hooks/     # Business logic hooks
│       ├── ui/            # Presentation components
│       └── index.ts       # Public exports
└── shared/                # Utilities, types, Supabase client
```

### Container / Presentation Pattern

Every page has two files:

- `*-page-container.tsx` — composes hooks, owns state/logic
- `*-page.tsx` — pure UI, receives props

```tsx
// Container
export const HomePageContainer = () => {
  const tasks = useTasks()
  return <HomePage tasks={tasks} />
}

// Presentation
export const HomePage = ({ tasks }: Props) => { ... }
```

### Hook Patterns

Hooks expose **ready-to-use functions**, never raw `mutate`:

```ts
// ✅ correct
return { onSubmit, isPending, errors }

// ❌ wrong
return { mutate, isPending }
```

### Prop Types

Derive prop types from hook return types:

```ts
type Create = ReturnType<typeof useCreateTask>
type Props = { create: Create }
```

### Props Grouped by Concern

```tsx
<HomePage
  create={create}    // { show, onShow, onHide, name, onNameChange, isPending, onSubmit }
  edit={edit}       // { id, name, onNameChange, onStart, onCancel, onCommit, isPending }
/>
```

---

## Supabase Patterns

### Client

```ts
import { supabaseClient } from '@shared/lib'
```

### Types

```ts
import type { Tables, TablesUpdate } from '@shared/lib'
type Task = Tables<'task'>
```

### Query Keys

| Data | Query Key |
|------|-----------|
| Task list | `['task', 'list']` |
| Current profile | `['profile', 'me']` |

### Auth

Auth state via Jotai atoms, **never React context**:

```ts
import { useUser } from '@shared/lib'
const { user, isLoading } = useUser()
```

---

## Edge Functions

- Always create via CLI: `supabase functions new <name>`
- Use `SUPABASE_SERVICE_ROLE_KEY` + explicit token validation
- Disable JWT verification in `config.toml` if handling auth manually:

```toml
[functions.<name>]
verify_jwt = false
```

---

## Error Handling

- **Fail fast** with descriptive messages
- **Handle errors at appropriate level** — don't silently swallow
- **No `console.log`** — use Biome warning or structured logging

---

## Commit Style

Conventional commits, atomic changes:

```
feat: add profile page with avatar upload
fix: resolve task toggle race condition
chore: deploy edge functions in CI
```

---

## Pre-commit Checklist

1. `npm run check-all` passes
2. No `console.log` statements
3. Types are correct (no `any`)
4. Architecture follows FSD patterns
5. Biome passes: `npm run ci`

---

## Directories to Never Commit

- `.plan/` — brainstorming/design docs
- `.research/` — research artifacts
- `.gotstuck/` — stuck task documentation
