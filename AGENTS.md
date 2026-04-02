# AGENTS.md — React 19 + TypeScript Application

## Project Identity

| Key | Value |
|-----|-------|
| Framework | React 19 (Functional Components, Hooks) |
| Language | TypeScript (strict mode) |
| Category | Frontend SPA |
| State Management | Zustand (slice pattern) |
| Styling | Tailwind CSS 4 |
| Testing | Vitest + React Testing Library |
| Routing | React Router 7 |
| i18n | react-i18next |

---

## Architecture — Feature-Sliced with Hooks Extraction

```
src/
├── app/                    ← App shell, providers, router config
│   ├── App.tsx
│   ├── providers.tsx       ← Compose all context providers
│   └── router.tsx          ← Route definitions (lazy-loaded)
├── components/             ← Shared/reusable components
│   ├── ui/                 ← Design system atoms: Button, Input, Modal
│   └── layout/             ← Header, Sidebar, Footer, PageShell
├── hooks/                  ← Shared custom hooks (useX)
├── pages/                  ← Route page components
│   └── <feature>/
│       ├── <Feature>Page.tsx
│       ├── components/     ← Feature-scoped components
│       └── hooks/          ← Feature-scoped hooks
├── stores/                 ← Zustand stores (one per domain)
├── services/               ← Business logic + API orchestration
├── api/                    ← HTTP client, endpoint definitions
├── types/                  ← TypeScript interfaces, DTOs, enums
├── utils/                  ← Pure utility functions
└── lib/                    ← Third-party library wrappers/config
```

### Strict Layer Rules

| Layer | Can Import From | NEVER Imports |
|-------|----------------|---------------|
| `pages/` | components/, hooks/, stores/, services/, types/ | Other features' internals |
| `components/` | hooks/, types/, utils/ | stores/, services/, pages/ |
| `hooks/` | stores/, services/, api/, types/ | components/, pages/ |
| `stores/` | api/, types/ | components/, pages/, hooks/ |
| `services/` | api/, types/, utils/ | stores/, components/ |
| `api/` | types/ | Everything else |

---

## Adding New Code — Where Things Go

### New Feature/Page
1. Create `src/pages/<feature>/<Feature>Page.tsx`
2. Add lazy route: `lazy(() => import('@/pages/<feature>/<Feature>Page'))`
3. Create Zustand store if needed: `src/stores/<feature>.store.ts`
4. Feature-scoped components in `src/pages/<feature>/components/`

### New Component
- **Reusable UI atom** → `src/components/ui/<Name>.tsx`
- **Layout shell** → `src/components/layout/<Name>.tsx`
- **Feature-scoped** → `src/pages/<feature>/components/<Name>.tsx`
- Every component is a named function export (not default export)

### New Hook
- File: `src/hooks/use<Name>.ts` (shared) or `src/pages/<feature>/hooks/use<Name>.ts`
- Always prefix with `use`
- Returns object with named properties: `{ data, isLoading, error, refetch }`

### New Store
- File: `src/stores/<name>.store.ts`
- Zustand with slice pattern:
```typescript
interface UserState {
  users: User[];
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
  clearUsers: () => void;
}

export const useUserStore = create<UserState>()((set, get) => ({
  users: [],
  isLoading: false,
  async fetchUsers() {
    set({ isLoading: true });
    const users = await userApi.getAll();
    set({ users, isLoading: false });
  },
  clearUsers() {
    set({ users: [] });
  },
}));
```

### New API Endpoint
- File: `src/api/<domain>.api.ts` → typed HTTP calls only, no business logic

---

## Design & Architecture Principles

### SOLID in React Context
- **S**: One component = one visual job. A `UserCard` doesn't fetch data.
- **O**: Extend via props, children, render props. Never modify shared components.
- **L**: Components with compatible props should be interchangeable.
- **I**: Keep hook return types focused. `useAuth()` doesn't return toast methods.
- **D**: Inject config/services via Context or hook composition, never import singletons in components.

### Composition Over Inheritance
```typescript
// ✅ Compose hooks
function useUserProfile(userId: string) {
  const { data: user, isLoading } = useUser(userId);
  const { permissions } = usePermissions(userId);
  return { user, isLoading, permissions };
}

// ❌ NEVER use class components
// ❌ NEVER use HOC patterns — use hooks instead
```

### Component Patterns
```typescript
// ✅ Named export, typed props, destructured
interface UserCardProps {
  user: User;
  onSelect: (id: string) => void;
}

export function UserCard({ user, onSelect }: UserCardProps) {
  return (
    <div onClick={() => onSelect(user.id)}>
      <h3>{user.name}</h3>
    </div>
  );
}

// ❌ NEVER use React.FC (it adds implicit children prop)
// ❌ NEVER use default exports for components
```

### YAGNI
- Don't add `Context` providers until 3+ components need the same data
- Don't create wrapper components unless reuse is proven
- Don't add prop options "just in case"

---

## Error Handling

### Error Boundaries — Mandatory
```typescript
// Every feature/page must have an error boundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <UserPage />
</ErrorBoundary>
```

### Fail-Fast in Services
```typescript
// ✅ Validate early
async function updateUser(id: string, data: UpdateUserDto): Promise<User> {
  if (!id) throw new Error('User ID is required');
  return userApi.update(id, data);
}
```

### Centralized HTTP Errors
- Configure fetch/axios interceptor in `src/api/client.ts`
- 401 → clear auth store, redirect to login
- 422 → return structured validation errors for form display
- 5xx → generic error with retry option

### Component-Level Error States
```typescript
// ✅ Every async operation has three states
function UserList() {
  const { users, isLoading, error } = useUserStore();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!users.length) return <EmptyState />;
  return <ul>{users.map(u => <UserItem key={u.id} user={u} />)}</ul>;
}
```

---

## Code Quality

### Naming Conventions
| Artifact | Convention | Example |
|----------|-----------|---------|
| Component | PascalCase `.tsx` | `UserProfile.tsx` |
| Hook | camelCase `use` prefix `.ts` | `useUserProfile.ts` |
| Store | camelCase `use` prefix `.store.ts` | `useUserStore` in `user.store.ts` |
| Service | camelCase `.service.ts` | `user.service.ts` |
| API | camelCase `.api.ts` | `user.api.ts` |
| Type/Interface | PascalCase | `User`, `CreateUserDto` |
| Util | camelCase `.ts` | `formatDate.ts` |
| Event handlers | `handle` prefix | `handleSubmit`, `handleClick` |
| Boolean props | `is`/`has` prefix | `isOpen`, `hasError` |

### Component Structure Order
```typescript
export function MyComponent({ prop1, prop2 }: Props) {
  // 1. Hooks (stores, router, custom hooks)
  // 2. Derived state (useMemo, local computations)
  // 3. Callbacks (useCallback)
  // 4. Effects (useEffect)
  // 5. Early returns (loading, error, empty)
  // 6. Render
  return <div>...</div>;
}
```

### DRY with AHA
- Extract hooks when logic is shared (3+ occurrences)
- Don't abstract components prematurely
- Collocate related code — a feature's tests, hooks, and components live together

---

## Testing Strategy

### Test Pyramid
| Level | What | Where | Tool |
|-------|------|-------|------|
| Unit | Hooks, stores, utils, services | `*.test.ts` co-located | Vitest |
| Component | Render + interaction | `*.test.tsx` co-located | Vitest + React Testing Library |
| E2E | User flows | `e2e/` | Playwright |

### React Testing Library Philosophy
```typescript
// ✅ Test from user perspective
it('shows error when submitting empty form', async () => {
  render(<LoginForm />);
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
});

// ❌ NEVER test state changes directly
// ❌ NEVER test component internals (hooks return values, re-render counts)
```

### Store Testing
```typescript
// ✅ Test store in isolation
it('fetches users', async () => {
  const { result } = renderHook(() => useUserStore());
  await act(() => result.current.fetchUsers());
  expect(result.current.users).toHaveLength(3);
});
```

### What MUST Be Tested
- All Zustand store actions
- All custom hooks with logic
- All services / API functions (mock HTTP)
- Components with forms, conditional rendering, user interaction

---

## Security & Performance

### XSS Prevention
- React auto-escapes JSX expressions `{value}` — keep it that way
- NEVER use `dangerouslySetInnerHTML` with user-provided content
- Sanitize when `dangerouslySetInnerHTML` is unavoidable (use DOMPurify)

### Input Validation
- Validate all form inputs before submission
- Use controlled components for forms (state-driven)
- Server-side validation is the source of truth — client-side is UX only

### Performance Rules
- Lazy-load all route pages: `lazy(() => import(...))`
- Memoize expensive computations with `useMemo()`
- Memoize callbacks passed to children with `useCallback()`
- Use React 19's `use()` for promise/context reading
- Lists MUST have stable, unique `key` props (never array index)
- Avoid creating objects/arrays in JSX props inline (causes re-renders)

### React-Specific Performance
```typescript
// ✅ Stable references
const filters = useMemo(() => ({ status: 'active', role }), [role]);

// ❌ Inline object = new reference every render
<UserList filters={{ status: 'active', role }} />
```

### Resource Cleanup
```typescript
// ✅ Always cleanup effects
useEffect(() => {
  const controller = new AbortController();
  fetchData({ signal: controller.signal });
  return () => controller.abort();
}, [dependency]);
```

---

## Commands

| Action | Command |
|--------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Lint | `npm run lint` |
| Type check | `npx tsc --noEmit` |

---

## Prohibitions — NEVER Do These

1. **NEVER** use class components — functional components + hooks only
2. **NEVER** use `React.FC` — use explicit prop types
3. **NEVER** use default exports — named exports for everything
4. **NEVER** use `any` type — strict TypeScript at all times
5. **NEVER** put business logic in components — extract to hooks/services
6. **NEVER** use `dangerouslySetInnerHTML` with user content
7. **NEVER** mutate state directly — always use setter functions
8. **NEVER** use `useEffect` for derived state — use `useMemo` instead
9. **NEVER** use array index as `key` in dynamic lists
10. **NEVER** import from other feature directories — features are isolated
