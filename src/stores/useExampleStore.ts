import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { exampleService } from '@/services'
import type { ExampleItem } from '@/models'

interface ExampleState {
  items: ExampleItem[]
  loading: boolean
  error: string | null
}

interface ExampleActions {
  fetchItems: () => Promise<void>
  reset: () => void
}

const initialState: ExampleState = {
  items: [],
  loading: false,
  error: null,
}

/**
 * Example feature store — demonstrates async actions calling the service layer.
 * Copy this pattern for each feature/domain entity.
 */
export const useExampleStore = create<ExampleState & ExampleActions>()(
  devtools(
    (set) => ({
      ...initialState,

      fetchItems: async () => {
        set({ loading: true, error: null }, false, 'fetchItems/pending')
        try {
          const response = await exampleService.getAll()
          set({ items: response.data, loading: false }, false, 'fetchItems/fulfilled')
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to fetch items'
          set({ error: message, loading: false }, false, 'fetchItems/rejected')
        }
      },

      reset: () => set(initialState, false, 'reset'),
    }),
    { name: 'ExampleStore' },
  ),
)
