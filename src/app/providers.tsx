import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/feedback'

// Side-effect: initializes i18next
import '@/i18n'

interface ProvidersProps {
  children: ReactNode
}

/**
 * Composes all application-level providers into a single wrapper.
 * Add new providers here (auth, query client, etc.) as the app grows.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {children}
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
