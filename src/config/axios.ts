import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { APP_CONSTANTS } from '@/config/constants'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  timeout: APP_CONSTANTS.API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor ─────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(APP_CONSTANTS.TOKEN_KEY)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor ────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const message =
        (error.response?.data as { message?: string })?.message ?? error.message

      switch (status) {
        case 401:
          localStorage.removeItem(APP_CONSTANTS.TOKEN_KEY)
          localStorage.removeItem(APP_CONSTANTS.REFRESH_TOKEN_KEY)
          toast.error('Session expired. Please log in again.')
          break
        case 403:
          toast.error('You do not have permission to perform this action.')
          break
        case 404:
          toast.error('Requested resource was not found.')
          break
        case 422:
          toast.error(message || 'Validation failed.')
          break
        case 500:
          toast.error('Internal server error. Please try again later.')
          break
        default:
          toast.error(message || 'An unexpected error occurred.')
      }
    }
    return Promise.reject(error)
  },
)
