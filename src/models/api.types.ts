/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

/** Paginated response */
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  }
}

/** API error shape returned by backend */
export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

/** Pagination query params */
export interface PaginationParams {
  page?: number
  perPage?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
