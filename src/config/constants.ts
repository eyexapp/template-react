export const APP_CONSTANTS = {
  /** Default pagination page size */
  PAGE_SIZE: 20,
  /** Token storage key */
  TOKEN_KEY: 'auth_token',
  /** Refresh token storage key */
  REFRESH_TOKEN_KEY: 'refresh_token',
  /** Language storage key */
  LANGUAGE_KEY: 'app_language',
  /** Theme storage key */
  THEME_KEY: 'app_theme',
  /** API request timeout in milliseconds */
  API_TIMEOUT: 30_000,
  /** Debounce delay for search inputs in ms */
  DEBOUNCE_DELAY: 300,
} as const
