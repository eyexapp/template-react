---
name: architecture
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - architecture
  - component structure
  - hooks
  - zustand
  - folder structure
  - state management
  - routing
---

# Architecture — React 19 + TypeScript + Zustand

## Component Architecture

- **Functional Components only** — no class components.
- Each component in its own file: `ComponentName.tsx`.
- Co-locate feature-specific components, hooks, and tests together.
- Shared/reusable components go in `src/components/ui/`.

## Hooks Extraction Pattern

Extract logic from components into custom hooks:
- Component renders UI only, hook manages state + side effects.
- Name: `use` + PascalCase: `useAuth()`, `useFetchUsers()`, `useDebounce()`.
- One concern per hook — don't create god hooks.
- Hooks can compose other hooks.

## State Management — Zustand Slice Pattern

- One store per domain: `auth.store.ts`, `cart.store.ts`, `ui.store.ts`.
- Use `devtools` + `persist` middleware.
- **Always use selectors**: `useAuthStore(s => s.user)`.
- Never call `useAuthStore()` without selector — re-renders on any change.
- Actions live inside the store definition.

## Routing — React Router 7

- Every route page is `lazy(() => import(...))` loaded.
- Wrap lazy routes in `<Suspense fallback={<Loading />}>`.
- Nested routes with `<Outlet />` for shared layouts.
- Type route params: `useParams<{ id: string }>()`.

## Provider Composition

Compose all providers in `app/providers.tsx`:
QueryClientProvider > I18nextProvider > ThemeProvider > BrowserRouter.

## Directory Structure

```
src/
├── app/          ← Shell, providers, router config
├── components/   ← Shared UI (ui/ atoms, layout/ scaffolding)
├── hooks/        ← Shared custom hooks (useX)
├── pages/        ← Route pages with co-located components/hooks
├── stores/       ← Zustand stores (one per domain)
├── services/     ← Business logic + API orchestration
├── api/          ← HTTP client, endpoint definitions
├── types/        ← TypeScript interfaces, DTOs, enums
├── utils/        ← Pure utility functions
└── lib/          ← Third-party library wrappers
```

## Rules

- Max 300 lines per file. Max 3 nesting levels.
- Components: pure rendering. Logic: hooks. State: stores.
- Prefer composition over inheritance.
