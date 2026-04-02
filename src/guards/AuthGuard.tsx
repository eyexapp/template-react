import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { APP_CONSTANTS } from '@/config/constants'

interface AuthGuardProps {
  children: ReactNode
}

/**
 * Protects a route — redirects to /login if no token is found.
 * Customize the auth check to match your authentication strategy.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const token = localStorage.getItem(APP_CONSTANTS.TOKEN_KEY)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}
