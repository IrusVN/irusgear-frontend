// Product Types
export type ProductStatus = 'active' | 'inactive' | 'out_of_stock'

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  salePrice?: number
  sku: string
  stock: number
  categoryId: number
  categoryName: string
  images: string[]
  thumbnail: string
  status: ProductStatus
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductCategory {
  id: number
  name: string
  slug: string
  description?: string
  parentId?: number
  productCount: number
}

export interface ProductFilters {
  status?: ProductStatus | 'all'
  categoryId?: number
  search?: string
  featured?: boolean
  page?: number
  limit?: number
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ProductFormData {
  name: string
  description: string
  shortDescription?: string
  price: number
  salePrice?: number
  sku: string
  stock: number
  categoryId: number
  images: string[]
  thumbnail: string
  status: ProductStatus
  featured: boolean
}
