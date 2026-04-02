import { apiClient } from '@/config/axios'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/models'

/**
 * Generic CRUD service. Extend this for each entity.
 *
 * @example
 * ```ts
 * class UserService extends ApiService<User> {
 *   constructor() { super('/users') }
 * }
 * export const userService = new UserService()
 * ```
 */
export class ApiService<T> {
  protected readonly basePath: string

  constructor(basePath: string) {
    this.basePath = basePath
  }

  async getAll(params?: PaginationParams): Promise<PaginatedResponse<T>> {
    const { data } = await apiClient.get<PaginatedResponse<T>>(this.basePath, { params })
    return data
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    const { data } = await apiClient.get<ApiResponse<T>>(`${this.basePath}/${id}`)
    return data
  }

  async create(payload: Partial<T>): Promise<ApiResponse<T>> {
    const { data } = await apiClient.post<ApiResponse<T>>(this.basePath, payload)
    return data
  }

  async update(id: string, payload: Partial<T>): Promise<ApiResponse<T>> {
    const { data } = await apiClient.put<ApiResponse<T>>(`${this.basePath}/${id}`, payload)
    return data
  }

  async patch(id: string, payload: Partial<T>): Promise<ApiResponse<T>> {
    const { data } = await apiClient.patch<ApiResponse<T>>(`${this.basePath}/${id}`, payload)
    return data
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const { data } = await apiClient.delete<ApiResponse<void>>(`${this.basePath}/${id}`)
    return data
  }
}
