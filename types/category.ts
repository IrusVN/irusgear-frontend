export type AdminCategoryStatus = 'active' | 'inactive'

export interface AdminCategory {
  id: number
  name: string
  slug: string
  description: string
  image: string
  icon: string
  productCount: number
  totalEarning: number
  status: AdminCategoryStatus
  createdAt: string
  updatedAt: string
}

export interface AdminCategoryFilters {
  search?: string
  status?: AdminCategoryStatus | 'all'
  page?: number
  limit?: number
}
