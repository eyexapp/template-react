---
name: testing
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - test
  - vitest
  - testing library
  - coverage
  - mock
  - msw
---

# Testing — React 19 (Vitest + React Testing Library)

## Core Principle: Test Behavior, Not Implementation

Query elements the way users find them — by role, text, label — not by class/id/internals.

## Query Priority (most → least preferred)

1. `getByRole('button', { name: /submit/i })` — accessible role
2. `getByLabelText('Email')` — form elements
3. `getByText('Hello')` — visible text
4. `getByTestId` — last resort only

## Component Test Pattern

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

describe('UserCard', () => {
  it('should call onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);
    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith('user-1');
  });
});
```

## Custom Hook Testing

```tsx
import { renderHook, waitFor } from '@testing-library/react';

it('should fetch user', async () => {
  const { result } = renderHook(() => useUser('1'));
  await waitFor(() => expect(result.current.user?.name).toBe('Alice'));
});
```

## Zustand Store Testing

```tsx
beforeEach(() => useAuthStore.setState({ user: null, token: null }));

it('should set user on login', async () => {
  await useAuthStore.getState().login(creds);
  expect(useAuthStore.getState().user).toEqual(expectedUser);
});
```

## API Mocking — MSW

```tsx
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/users/:id', ({ params }) =>
    HttpResponse.json({ id: params.id, name: 'Alice' })
  ),
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Rules

- Co-locate: `Component.tsx` → `Component.test.tsx`.
- Use `userEvent` (not `fireEvent`) for realistic interaction.
- Use `findBy*` for async elements, `waitFor` for async state.
- >80% coverage on hooks, services, stores.
- Test: user flows, edge cases, error states. Skip: CSS, third-party libs.
