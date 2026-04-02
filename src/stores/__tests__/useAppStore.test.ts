import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '@/stores/useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store between tests
    useAppStore.setState({
      theme: 'system',
      sidebarCollapsed: false,
      globalLoading: false,
    })
  })

  it('should have correct initial state', () => {
    const state = useAppStore.getState()
    expect(state.theme).toBe('system')
    expect(state.sidebarCollapsed).toBe(false)
    expect(state.globalLoading).toBe(false)
  })

  it('should set theme', () => {
    useAppStore.getState().setTheme('dark')
    expect(useAppStore.getState().theme).toBe('dark')
  })

  it('should toggle sidebar', () => {
    useAppStore.getState().toggleSidebar()
    expect(useAppStore.getState().sidebarCollapsed).toBe(true)

    useAppStore.getState().toggleSidebar()
    expect(useAppStore.getState().sidebarCollapsed).toBe(false)
  })

  it('should set global loading', () => {
    useAppStore.getState().setGlobalLoading(true)
    expect(useAppStore.getState().globalLoading).toBe(true)
  })
})
