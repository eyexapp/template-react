import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { APP_CONSTANTS } from '@/config/constants'

type Theme = 'light' | 'dark' | 'system'

interface AppState {
  /** Current theme */
  theme: Theme
  /** Whether the sidebar is collapsed (if applicable) */
  sidebarCollapsed: boolean
  /** Global loading indicator */
  globalLoading: boolean
}

interface AppActions {
  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
  setGlobalLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    persist(
      (set) => ({
        theme: 'system',
        sidebarCollapsed: false,
        globalLoading: false,

        setTheme: (theme) => set({ theme }, false, 'setTheme'),
        toggleSidebar: () =>
          set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed }), false, 'toggleSidebar'),
        setGlobalLoading: (globalLoading) =>
          set({ globalLoading }, false, 'setGlobalLoading'),
      }),
      {
        name: APP_CONSTANTS.THEME_KEY,
        partialize: (state) => ({ theme: state.theme, sidebarCollapsed: state.sidebarCollapsed }),
      },
    ),
    { name: 'AppStore' },
  ),
)
