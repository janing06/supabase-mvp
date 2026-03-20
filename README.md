# Supabase MVP

A full-stack task management app built with React and Supabase, demonstrating how to build a production-ready application with authentication, real-time sync, file storage, and serverless edge functions — all on a single platform.

## Environments

| Environment | URL |
|-------------|-----|
| Dev | https://supabase-mvp-dev.vercel.app/ |
| Prod | https://supabase-mvp-prod.vercel.app/ |

### Test user

| Field | Value |
|-------|-------|
| Email | `demo@example.com` |
| Password | `Password1!` |

---

## Features

- **Authentication** — Email/password sign up, sign in, and sign out
- **Task Management** — Create, edit, delete, and toggle tasks with per-user isolation
- **Real-time Sync** — Tasks update instantly across all open tabs via Supabase Realtime
- **Profile Page** — Update display name and upload an avatar photo
- **Avatar Upload** — Processed via a Supabase Edge Function with secure auth validation
- **Route Protection** — Unauthenticated users are redirected to sign in

---

## Tech Stack

### Frontend

| Tool | Purpose |
|------|---------|
| [React 19](https://react.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Vite](https://vitejs.dev) | Build tool and dev server |
| [React Router v7](https://reactrouter.com) | Client-side routing |
| [TanStack React Query](https://tanstack.com/query) | Server state, caching, and cache invalidation |
| [Jotai](https://jotai.org) | Global auth state (atoms) |
| [react-hook-form](https://react-hook-form.com) + [Zod](https://zod.dev) | Form handling and validation |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com) | UI component primitives |
| [Lucide React](https://lucide.dev) | Icons |
| [Biome](https://biomejs.dev) | Linting and formatting |

### Backend — Supabase

| Feature | Usage |
|---------|-------|
| **Auth** | Email/password authentication with session management |
| **PostgreSQL Database** | Tasks and user profiles with typed queries via generated TypeScript types |
| **Row Level Security (RLS)** | Users can only read and write their own tasks and profile |
| **Storage** | Avatar images stored in a public `avatars` bucket with RLS policies |
| **Edge Functions** | `upload-avatar` — a Deno serverless function that handles file uploads and profile updates |
| **Realtime** | Postgres change subscriptions keep the task list in sync across tabs |
| **Database Triggers** | Auto-creates a profile row when a new user signs up |
| **Migrations** | Full version-controlled schema history via `supabase/migrations/` |

---

## Project Structure

```
supabase-mvp/
├── client/                         # React frontend
│   └── src/
│       ├── app/                    # Root setup: providers, router, routes
│       │   ├── providers/          # Supabase, React Query, Jotai, Router providers
│       │   └── routes/             # Route definitions and RequireAuth guard
│       ├── pages/                  # Feature pages (FSD architecture)
│       │   ├── home/               # Task list page
│       │   │   ├── api/            # listTasks, createTask, updateTask, deleteTask
│       │   │   ├── model/hooks/    # useTasks, useCreateTask, useUpdateTask,
│       │   │   │                     useDeleteTask, useTasksRealtime, useSignOut
│       │   │   └── ui/             # HomePage (presentation) + HomePageContainer
│       │   ├── profile/            # Profile page
│       │   │   ├── api/            # getProfile, updateProfile, uploadAvatar
│       │   │   ├── model/hooks/    # useProfile, useUpdateProfile, useUploadAvatar
│       │   │   └── ui/             # ProfilePage + ProfilePageContainer
│       │   ├── sign-in/            # Sign in page
│       │   └── sign-up/            # Sign up page
│       └── shared/                 # Cross-feature utilities
│           ├── lib/                # Supabase client, auth atoms, generated types
│           └── paths.ts            # Centralised route constants
│
├── supabase/
│   ├── functions/
│   │   └── upload-avatar/          # Edge function: avatar upload + profile update
│   └── migrations/                 # Schema history
│       ├── ..._create_task_table.sql
│       ├── ..._add_user_id_to_task.sql
│       ├── ..._create_profile_table.sql
│       ├── ..._backfill_existing_users_profile.sql
│       ├── ..._create_avatars_bucket.sql
│       └── ..._enable_realtime_task.sql
│
└── .github/
    └── workflows/
        ├── check-pr-client.yml     # PR checks: build, TypeScript, lint, FSD validation
        ├── check-pr-supabase.yml   # PR checks: apply migrations against a live Postgres instance
        ├── deploy.yml              # Deploy (dev): run migrations + deploy edge functions on push to `main`
        ├── deploy-prod.yml         # Deploy (prod): run migrations + deploy edge functions on push to `release`
        └── assign-author.yml       # Auto-assigns PR author
```

---

## Architecture

The frontend follows **Feature-Sliced Design (FSD)** with a **container/presentation** pattern:

- **Container** (`*-page-container.tsx`) — composes hooks, owns data and logic
- **Presentation** (`*-page.tsx`) — pure UI, receives everything via props

Hooks own their own state and expose ready-to-use functions (never raw `mutate`). Props are grouped by concern (e.g. `create`, `edit`, `signOut`).

---

## CI/CD

### PR Checks

Every pull request runs automated checks before merging:

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `check-pr-client.yml` | PR touching `client/**` | TypeScript type check, Biome lint, FSD architecture validation, production build |
| `check-pr-supabase.yml` | PR touching `supabase/**` | Spins up a Postgres instance and applies all migrations to catch SQL errors early |

### Deployment

Merging to `main` triggers automatic deployment:

| Target | Environment | Platform | Trigger |
|--------|-------------|----------|---------|
| React app | Dev | [Vercel](https://vercel.com) | Push to `main` (Vercel Git integration) |
| React app | Prod | [Vercel](https://vercel.com) | Push to `release` (Vercel Git integration) |
| Supabase migrations + edge functions | Dev | GitHub Actions (`deploy.yml`) | Push to `main` when `supabase/**` changes |
| Supabase migrations + edge functions | Prod | GitHub Actions (`deploy-prod.yml`) | Push to `release` when `supabase/**` changes |

Required GitHub Actions secrets: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_ID`, `SUPABASE_DB_PASSWORD`, `SUPABASE_PROJECT_ID_PROD`, `SUPABASE_DB_PASSWORD_PROD`.

---

## Local Development

### Prerequisites

- Node.js 20+
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Docker (for local Supabase)

### Setup

```bash
# Start local Supabase stack
supabase start

# Apply migrations
supabase migration up

# Install frontend dependencies
cd client && npm install

# Start the dev server
npm run dev
```

### Regenerate TypeScript types after schema changes

```bash
cd client && npm run gen:types
```
