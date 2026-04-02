---
name: version-control
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - git
  - commit
  - branch
  - ci
  - deploy
  - vite
---

# Version Control — React 19 + Vite

## Commits (Conventional)

`<type>(<scope>): <description>`

Types: feat, fix, refactor, test, docs, chore, perf

Examples:
- `feat(auth): add login form with validation`
- `fix(dashboard): prevent chart crash on empty data`
- `refactor(hooks): extract useDebounce from useSearch`

## CI Pipeline

1. `npm ci` — install
2. `npx tsc --noEmit` — type check
3. `npm run lint` — ESLint + Prettier
4. `npm test -- --coverage` — Vitest
5. `npm run build` — Vite production build
6. Bundle size check

## Vite Build

- Output: `dist/` — never commit.
- Code splitting: automatic via `React.lazy()`.
- Env vars: `VITE_*` prefix required.
- Analyze: `npx vite-bundle-visualizer`.

## .gitignore

```
node_modules/
dist/
.env.local
.env.production
coverage/
*.tsbuildinfo
```

## Branch Strategy

- `main` — production, always deployable.
- `feature/<desc>` — new features.
- `fix/<desc>` — bug fixes.
- PRs < 400 lines. Squash merge.
