# Project Instructions for AI Assistants

> These instructions help AI coding assistants (GitHub Copilot, Claude, etc.) understand
> the architecture, conventions, and patterns used in this project.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **UI Library** | React | 19 |
| **Language** | TypeScript | 5.9 (strict) |
| **Build Tool** | Vite | 7 |
| **Styling** | Tailwind CSS | 4 |
| **State Management** | Zustand | 5 |
| **Routing** | React Router | 7 |
| **HTTP Client** | Axios | 1.x |
| **Forms** | React Hook Form + Zod | 7.x / 4.x |
| **i18n** | i18next + react-i18next | 25.x / 16.x |
| **Testing** | Vitest + React Testing Library | 4.x / 16.x |
| **Notifications** | Sonner | 2.x |

---

## Architecture Overview

This project follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│                   Pages                      │  ← Route-level components
├─────────────────────────────────────────────┤
│              Components (UI/Layout/Feedback) │  ← Reusable UI pieces
├─────────────────────────────────────────────┤
│                   Hooks                      │  ← Custom React hooks
├──────────────┬──────────────────────────────┤
│    Stores    │        Services              │  ← State & API layer
│  (Zustand)   │  (Axios-based CRUD)          │
├──────────────┴──────────────────────────────┤
│              Models (TypeScript types)        │  ← Shared type definitions
├─────────────────────────────────────────────┤
│          Config (env, constants, axios)       │  ← App configuration
└─────────────────────────────────────────────┘
```

---

## Folder Structure & Responsibilities

```
src/
├── app/           → App bootstrap: root component, route definitions, provider composition
├── assets/        → Static assets: images, fonts, SVGs
├── components/
│   ├── ui/        → Primitive, reusable UI components (Button, Input, Modal, etc.)
│   ├── layout/    → Page structure components (Header, Footer, PageLayout, Sidebar)
│   └── feedback/  → User feedback components (ErrorBoundary, Loading, Toast wrappers)
├── config/        → Configuration: env validation (Zod), constants, Axios instance
├── contexts/      → React contexts (use sparingly — prefer Zustand for most state)
├── guards/        → Route guards (AuthGuard, GuestGuard, RoleGuard)
├── hooks/         → Custom React hooks (useDebounce, useLocalStorage, etc.)
├── i18n/          → Internationalization: i18next config + locale JSON files
├── models/        → TypeScript interfaces and types (API types, entity types)
├── pages/         → Page-level components, each in its own folder with index.ts
├── services/      → API service classes extending the base ApiService
├── stores/        → Zustand stores (one per feature/domain)
├── styles/        → Global CSS: Tailwind directives, custom resets, fonts
├── test/          → Test setup and utilities (custom render, test helpers)
└── utils/         → Pure utility functions (cn, format, storage wrapper)
```

---

## Coding Conventions

### File & Naming

- **Components**: PascalCase filenames matching the component name → `Header.tsx`, `ErrorBoundary.tsx`
- **Hooks**: camelCase with `use` prefix → `useDebounce.ts`
- **Stores**: camelCase with `use` prefix + `Store` suffix → `useAppStore.ts`
- **Services**: camelCase with `.service.ts` suffix → `example.service.ts`
- **Models/Types**: camelCase with `.types.ts` suffix → `api.types.ts`
- **Utils**: camelCase → `cn.ts`, `format.ts`
- **Pages**: Each page in its own folder → `pages/Home/HomePage.tsx` with `index.ts` barrel export
- **Tests**: Co-located in `__tests__/` folder or `.test.ts(x)` suffix

### Import Order

Maintain this import order (enforced by convention):

```typescript
// 1. React / framework imports
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// 2. Third-party libraries
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'

// 3. Internal aliases (absolute imports via @/)
import { useAppStore } from '@/stores'
import { apiService } from '@/services'
import type { User } from '@/models'

// 4. Relative imports (components in the same feature)
import { FeatureCard } from './FeatureCard'
```

### Path Aliases

**Always** use `@/` alias for imports — never use relative paths that go up more than one level.

```typescript
// ✅ GOOD
import { cn } from '@/utils'
import { useAppStore } from '@/stores'

// ❌ BAD
import { cn } from '../../../utils'
```

### TypeScript

- **Strict mode is ON** — never use `any`. Use `unknown` + type guards instead.
- Use `interface` for object shapes, `type` for unions/intersections/computed types.
- Export types with `export type` when it's a type-only export.
- All API response types live in `src/models/`.

### Components

- **Functional components only** — no class components (except ErrorBoundary).
- Use `export default` for page components (required for lazy loading).
- Use named exports for everything else.
- Accept `className` prop in UI components for Tailwind overrides using `cn()`.
- Keep components focused — extract complex logic into custom hooks.

```typescript
// ✅ UI component pattern
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button className={cn('rounded-md px-4 py-2', variantStyles[variant], className)} {...props} />
  )
}
```

---

## State Management Rules

### When to use Zustand (stores/)
- Global state shared across multiple unrelated components
- State that persists across route changes
- Async state with loading/error tracking
- App-level settings (theme, sidebar, user preferences)

### When to use local state (useState)
- Form input values (unless using React Hook Form)
- UI toggles (dropdown open, modal visible)
- Component-specific state not needed elsewhere

### When to use React Context (contexts/)
- Dependency injection
- Deeply nested provider data that changes rarely
- Prefer Zustand over Context for most cases

### Zustand patterns

```typescript
// ✅ Standard store pattern
export const useFeatureStore = create<State & Actions>()(
  devtools(
    (set) => ({
      // State
      items: [],
      loading: false,
      error: null,
      // Actions
      fetchItems: async () => {
        set({ loading: true, error: null }, false, 'fetchItems/pending')
        try {
          const response = await featureService.getAll()
          set({ items: response.data, loading: false }, false, 'fetchItems/fulfilled')
        } catch (err) {
          set({ error: err.message, loading: false }, false, 'fetchItems/rejected')
        }
      },
    }),
    { name: 'FeatureStore' },
  ),
)
```

---

## Service Layer Rules

- Every API entity gets its own service extending `ApiService<T>`.
- Services handle HTTP concerns only — no UI logic, no state mutations.
- Stores call services, not components directly.

```typescript
// ✅ Creating a new service
class UserService extends ApiService<User> {
  constructor() { super('/users') }

  // Custom endpoints beyond CRUD
  async changePassword(payload: ChangePasswordDto): Promise<ApiResponse<void>> {
    const { data } = await apiClient.post('/users/change-password', payload)
    return data
  }
}
export const userService = new UserService()
```

---

## Routing Conventions

- All routes defined centrally in `src/app/routes.tsx`.
- Pages are **lazy loaded** with `React.lazy()`.
- Use layout routes for shared UI (PageLayout wraps all pages).
- Route guards are wrapper components in `src/guards/`.

```typescript
// ✅ Adding a new protected route
{
  path: 'dashboard',
  element: (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  ),
}
```

---

## Form Handling

- Use **React Hook Form** with **Zod** schemas for validation.
- Define schemas with `z.object()` and infer types with `z.infer<typeof schema>`.
- Use `zodResolver` from `@hookform/resolvers/zod`.
- Validation messages reference i18n keys for localization.

---

## Internationalization (i18n)

- All user-facing text must use `t('key')` from `useTranslation()`.
- Translation keys are organized by feature: `common.*`, `nav.*`, `home.*`, etc.
- Locale files: `src/i18n/locales/{lang}.json`.
- Add new languages by: (1) creating the JSON file, (2) importing in `src/i18n/index.ts`.

---

## Styling Rules

- **Tailwind CSS v4** — use utility classes, avoid custom CSS.
- Use `cn()` utility from `@/utils` to merge conditional classes.
- Dark mode: use `dark:` variant classes.
- Responsive: mobile-first with `sm:`, `md:`, `lg:` breakpoints.
- No inline styles. No CSS-in-JS. No styled-components.

---

## Testing Conventions

- Test runner: **Vitest** (Vite-native, Jest-compatible API).
- DOM testing: **React Testing Library** (`@testing-library/react`).
- Use custom `render` from `@/test/test-utils` — it wraps components in all providers.
- Co-locate tests in `__tests__/` directories next to the code they test.
- File naming: `ComponentName.test.tsx` or `storeName.test.ts`.

```typescript
// ✅ Component test pattern
import { render, screen } from '@/test/test-utils'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected text')).toBeInTheDocument()
  })
})
```

---

## Error Handling

- **ErrorBoundary** wraps the entire app (in providers.tsx) — catches render errors.
- **Axios interceptors** handle HTTP errors globally — show toast notifications.
- Specific error handling in stores via try/catch in async actions.
- Never swallow errors silently — always log or display them.

---

## Adding a New Feature Checklist

1. **Model**: Define types in `src/models/feature.types.ts`, export from `index.ts`
2. **Service**: Create `src/services/feature.service.ts` extending `ApiService<T>`, export from `index.ts`
3. **Store**: Create `src/stores/useFeatureStore.ts` with async actions calling the service
4. **Page**: Create `src/pages/Feature/FeaturePage.tsx` with `index.ts` barrel
5. **Route**: Add lazy-loaded route in `src/app/routes.tsx`
6. **i18n**: Add translation keys in all locale files
7. **Test**: Add tests in `__tests__/` folder

---

## Environment Variables

- Defined in `.env.development` / `.env.production` files.
- All must be prefixed with `VITE_` (Vite convention).
- Validated at startup via Zod schema in `src/config/env.ts`.
- Access via `env.VITE_*` (imported from `@/config/env`), not `import.meta.env` directly.

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run all tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run preview` | Preview production build locally |
