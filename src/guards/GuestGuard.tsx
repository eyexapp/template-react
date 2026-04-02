import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { APP_CONSTANTS } from '@/config/constants'

interface GuestGuardProps {
  children: ReactNode
}

/**
 * Prevents authenticated users from accessing guest-only routes (login, register).
 * Redirects to / if already logged in.
 */
export function GuestGuard({ children }: GuestGuardProps) {
  const token = localStorage.getItem(APP_CONSTANTS.TOKEN_KEY)
  if (token) return <Navigate to="/" replace />
  return <>{children}</>
}
