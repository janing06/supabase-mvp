# Supabase MVP — Client

React frontend for the Supabase MVP project.

## Tech Stack

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
| [Claude Code](https://claude.ai/claude-code) | AI-assisted development |

## Architecture

Follows **Feature-Sliced Design (FSD)** with a **container/presentation** pattern:

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

- **Container** (`*-page-container.tsx`) — composes hooks, owns data and logic
- **Presentation** (`*-page.tsx`) — pure UI, receives everything via props

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run lint:fix` | Lint and auto-fix with Biome |
| `npm run format` | Format with Biome |
| `npm run gen:types` | Regenerate Supabase TypeScript types |
