---
name: code-quality
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - clean code
  - naming
  - lint
  - component rules
  - hooks rules
  - anti-pattern
  - refactor
---

# Code Quality — React 19 + TypeScript

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Component | PascalCase file + export | `UserProfile.tsx` |
| Hook | `use` + PascalCase | `useAuth()`, `useFetchUsers()` |
| Page | `<Feature>Page.tsx` | `DashboardPage.tsx` |
| Store | `<domain>.store.ts` | `auth.store.ts` |
| Service | `<domain>.service.ts` | `user.service.ts` |
| Type/Interface | PascalCase | `User`, `LoginDTO`, `ApiResponse<T>` |
| Event handler | `handle` + event | `handleClick`, `handleSubmit` |
| Boolean | `is/has/can/should` prefix | `isLoading`, `hasError` |
| Constant | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_URL` |

## Component Rules

1. ONE exported component per file.
2. Props interface defined above component.
3. Destructure props in function signature.
4. Order inside component: hooks → derived state → handlers → early returns → JSX.
5. Components ≤ 150 lines of JSX — extract sub-components if larger.

## React Anti-Patterns

- **No inline objects/functions in JSX** — creates new reference every render, breaks memoization.
- **No useEffect for derived state** — just compute it: `const fullName = first + last;`
- **No prop drilling through 4+ levels** — use Zustand store or Context.
- **No index as key** in dynamic lists — use stable IDs.
- **Never mutate state directly** — always create new objects/arrays.
- **Don't suppress `react-hooks/exhaustive-deps`** without explicit justification.

## Linting — ESLint + Prettier

- `eslint-plugin-react-hooks` enforces Rules of Hooks.
- `eslint-plugin-react-refresh` ensures HMR compatibility.
- Prettier handles all formatting — zero manual formatting.
- Run `npm run lint` before every commit.

## Error Handling

- **Error Boundaries** for component crash recovery.
- API errors: catch in hook/service, expose via `{ data, error, isLoading }`.
- Never `catch` and silently ignore.

## TypeScript

- Enable `strict: true` always. No `any` — use `unknown` then narrow.
- Prefer interface for objects, type for unions/intersections.
- Generic components: `function List<T>({ items }: { items: T[] })`.
