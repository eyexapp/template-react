---
name: security-performance
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - security
  - performance
  - memo
  - lazy loading
  - xss
  - optimization
---

# Security & Performance — React 19

## Performance

### Memoization — Profile First, Optimize Second

- `React.memo()` — wrap components that re-render often with same props.
- `useMemo()` — expensive computations only (sorting/filtering large arrays).
- `useCallback()` — only when passing callbacks to memoized children.
- Use React DevTools Profiler to identify actual bottlenecks first.

### Code Splitting

- `React.lazy(() => import(...))` for route-level splitting.
- Always wrap in `<Suspense fallback={...}>`.
- Dynamic imports for heavy libraries (chart libs, PDF generators).

### Zustand Performance

- Always use selectors: `useStore(s => s.field)`.
- Multi-field: use `shallow` from `zustand/shallow`.
- Never subscribe to entire store.

### Large Lists

- 1000+ items: use `@tanstack/react-virtual` for virtualization.
- Paginate API responses — never load all data at once.

### Images

- `loading="lazy"` for below-fold images.
- Responsive `srcSet` for different screen sizes.
- Prefer WebP/AVIF formats.

## Security

### XSS Prevention

- React auto-escapes JSX — `<p>{userInput}</p>` is SAFE.
- NEVER use `dangerouslySetInnerHTML` unless sanitized with DOMPurify.
- Avoid `eval()`, `new Function()`, and inline scripts.

### Environment Variables

- `VITE_*` vars are embedded in client bundle — NEVER put secrets.
- Only public keys (Google Maps, Stripe publishable key).
- Backend secrets stay server-side.

### Dependencies

- `npm audit` regularly.
- Review new deps: bundle size, maintenance status, license.
- Commit `package-lock.json`.
