import type { Product, ProductFilters, ProductListResponse, ProductFormData, ProductCategory } from '~/types/product'

/**
 * Product Service
 * 
 * TODO: Replace mock data with actual API calls
 */

export const productService = {
  /**
   * Get products list with filters
   * 
   * API Endpoint: GET /api/products?status=active&search=...&page=1&limit=10
   */
  async getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
    // TODO: Replace with actual API call
    
    // Mock data
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'iPhone 17 Pro Max',
        slug: 'iphone-17-pro-max',
        description: 'iPhone 17 Pro Max với chip A19 Bionic mạnh mẽ',
        shortDescription: 'Flagship mới nhất từ Apple',
        price: 30000000,
        salePrice: 28000000,
        sku: 'IP17PM-256',
        stock: 50,
        categoryId: 1,
        categoryName: 'Điện thoại',
        images: ['/image/dashboard/homehero/swiperslide/690x300_open_iPhone 17e.png'],
        thumbnail: '/image/dashboard/homehero/swiperslide/690x300_open_iPhone 17e.png',
        status: 'active',
        featured: true,
        createdAt: '2026-04-01T10:00:00',
        updatedAt: '2026-04-05T15:30:00'
      },
      {
        id: 2,
        name: 'MacBook Neo',
        slug: 'macbook-neo',
        description: 'MacBook Neo với chip M5 Pro',
        shortDescription: 'Laptop cao cấp cho dân chuyên nghiệp',
        price: 45000000,
        salePrice: 42000000,
        sku: 'MBN-M5-512',
        stock: 30,
        categoryId: 2,
        categoryName: 'Laptop',
        images: ['/image/dashboard/homehero/swiperslide/690x300_ROI_MacBookNeo.png'],
        thumbnail: '/image/dashboard/homehero/swiperslide/690x300_ROI_MacBookNeo.png',
        status: 'active',
        featured: true,
        createdAt: '2026-03-15T10:00:00',
        updatedAt: '2026-04-03T12:00:00'
      },
      {
        id: 3,
        name: 'AirPods Max 2',
        slug: 'airpods-max-2',
        description: 'Tai nghe over-ear cao cấp với ANC tuyệt vời',
        price: 15000000,
        sku: 'APM2-BLK',
        stock: 100,
        categoryId: 3,
        categoryName: 'Phụ kiện',
        images: ['/image/dashboard/homehero/swiperslide/690x300_PRE_AiPodsMax2.png'],
        thumbnail: '/image/dashboard/homehero/swiperslide/690x300_PRE_AiPodsMax2.png',
        status: 'active',
        featured: false,
        createdAt: '2026-03-10T10:00:00',
        updatedAt: '2026-03-10T10:00:00'
      },
      {
        id: 4,
        name: 'Sony WF-1000XM6',
        slug: 'sony-wf-1000xm6',
        description: 'Tai nghe true wireless với chất lượng âm thanh tuyệt hảo',
        price: 6500000,
        sku: 'SONY-WF6',
        stock: 0,
        categoryId: 3,
        categoryName: 'Phụ kiện',
        images: ['/image/dashboard/homehero/swiperslide/Home_WF-1000XM6-final.png'],
        thumbnail: '/image/dashboard/homehero/swiperslide/Home_WF-1000XM6-final.png',
        status: 'out_of_stock',
        featured: false,
        createdAt: '2026-02-20T10:00:00',
        updatedAt: '2026-04-01T10:00:00'
      },
      {
        id: 5,
        name: 'OPPO Find N6',
        slug: 'oppo-find-n6',
        description: 'Điện thoại gập cao cấp từ OPPO',
        price: 25000000,
        sku: 'OPPO-FN6',
        stock: 20,
        categoryId: 1,
        categoryName: 'Điện thoại',
        images: ['/image/dashboard/homehero/swiperslide/oppofingn6.png'],
        thumbnail: '/image/dashboard/homehero/swiperslide/oppofingn6.png',
        status: 'inactive',
        featured: false,
        createdAt: '2026-02-01T10:00:00',
        updatedAt: '2026-02-15T10:00:00'
      }
    ]

    // Filter logic
    let filteredProducts = mockProducts
    
    if (filters.status && filters.status !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.status === filters.status)
    }
    
    if (filters.categoryId) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === filters.categoryId)
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower)
      )
    }
    
    if (filters.featured !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.featured === filters.featured)
    }

    const page = filters.page || 1
    const limit = filters.limit || 10
    const total = filteredProducts.length
    const totalPages = Math.ceil(total / limit)

    return {
      products: filteredProducts,
      total,
      page,
      limit,
      totalPages
    }
  },

  /**
   * Get product by ID
   * 
   * API Endpoint: GET /api/products/:id
   */
  async getProductById(id: number): Promise<Product | null> {
    const response = await this.getProducts()
    return response.products.find(p => p.id === id) || null
  },

  /**
   * Create new product
   * 
   * API Endpoint: POST /api/products
   */
  async createProduct(data: ProductFormData): Promise<Product> {
    // TODO: Replace with actual API call
    throw new Error('Not implemented')
  },

  /**
   * Update product
   * 
   * API Endpoint: PUT /api/products/:id
   */
  async updateProduct(id: number, data: Partial<ProductFormData>): Promise<Product> {
    // TODO: Replace with actual API call
    throw new Error('Not implemented')
  },

  /**
   * Delete product
   * 
   * API Endpoint: DELETE /api/products/:id
   */
  async deleteProduct(id: number): Promise<void> {
    // TODO: Replace with actual API call
    throw new Error('Not implemented')
  },

  /**
   * Get categories
   * 
   * API Endpoint: GET /api/categories
   */
  async getCategories(): Promise<ProductCategory[]> {
    // TODO: Replace with actual API call
    return [
      { id: 1, name: 'Điện thoại', slug: 'dien-thoai', productCount: 150 },
      { id: 2, name: 'Laptop', slug: 'laptop', productCount: 80 },
      { id: 3, name: 'Phụ kiện', slug: 'phu-kien', productCount: 300 },
      { id: 4, name: 'Tablet', slug: 'tablet', productCount: 50 },
      { id: 5, name: 'Smartwatch', slug: 'smartwatch', productCount: 60 }
    ]
  }
}
