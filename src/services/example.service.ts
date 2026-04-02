import { ApiService } from './api.service'
import type { ExampleItem } from '@/models'

/**
 * Example service — demonstrates extending the base ApiService.
 * Replace this with your real entity services.
 */
class ExampleService extends ApiService<ExampleItem> {
  constructor() {
    super('/examples')
  }

  /** Custom endpoint beyond CRUD */
  async toggleComplete(id: string): Promise<ExampleItem> {
    const response = await this.patch(id, { completed: true } as Partial<ExampleItem>)
    return response.data
  }
}

export const exampleService = new ExampleService()
