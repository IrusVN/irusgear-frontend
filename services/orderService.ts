import type { Order, OrderFilters, OrderListResponse, OrderStatus } from '~/types/order'

/**
 * Order Service
 * 
 * TODO: Replace mock data with actual API calls
 * 
 * Example API integration:
 * const response = await $fetch('/api/orders', {
 *   baseURL: useRuntimeConfig().public.apiBase,
 *   headers: { Authorization: `Bearer ${token}` }
 * })
 */

export const orderService = {
  /**
   * Get orders list with filters
   * 
   * API Endpoint: GET /api/orders?status=pending&search=...&page=1&limit=10
   * Response: OrderListResponse
   */
  async getOrders(filters: OrderFilters = {}): Promise<OrderListResponse> {
    // TODO: Replace with actual API call
    // const data = await $fetch<OrderListResponse>('/api/orders', {
    //   params: filters
    // })
    
    // Mock data
    const mockOrders: Order[] = [
      {
        id: '10234',
        customer: {
          id: 1,
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@gmail.com',
          phone: '0901234567'
        },
        items: [
          {
            id: 1,
            productId: 1,
            productName: 'iPhone 17 Pro Max',
            productImage: '/image/dashboard/homehero/swiperslide/690x300_open_iPhone 17e.png',
            quantity: 1,
            price: 30000000,
            total: 30000000
          }
        ],
        status: 'delivered',
        paymentMethod: 'COD',
        shippingAddress: {
          fullAddress: '123 Nguyễn Huệ',
          city: 'TP.HCM',
          district: 'Quận 1',
          ward: 'Phường Bến Nghé'
        },
        subtotal: 30000000,
        shippingFee: 0,
        discount: 15000000,
        total: 15000000,
        createdAt: '2026-04-05T10:30:00',
        updatedAt: '2026-04-05T15:30:00'
      },
      {
        id: '10233',
        customer: {
          id: 2,
          name: 'Trần Thị B',
          email: 'tranthib@gmail.com',
          phone: '0912345678'
        },
        items: [
          {
            id: 2,
            productId: 2,
            productName: 'MacBook Neo',
            productImage: '/image/dashboard/homehero/swiperslide/690x300_ROI_MacBookNeo.png',
            quantity: 1,
            price: 45000000,
            total: 45000000
          }
        ],
        status: 'shipped',
        paymentMethod: 'Bank Transfer',
        shippingAddress: {
          fullAddress: '456 Lê Lợi',
          city: 'TP.HCM',
          district: 'Quận 3',
          ward: 'Phường 1'
        },
        subtotal: 45000000,
        shippingFee: 50000,
        discount: 36550000,
        total: 8500000,
        createdAt: '2026-04-04T14:20:00',
        updatedAt: '2026-04-04T16:00:00'
      },
      {
        id: '10232',
        customer: {
          id: 3,
          name: 'Lê Văn C',
          email: 'levanc@gmail.com',
          phone: '0923456789'
        },
        items: [
          {
            id: 3,
            productId: 3,
            productName: 'AirPods Max 2',
            productImage: '/image/dashboard/homehero/swiperslide/690x300_PRE_AiPodsMax2.png',
            quantity: 2,
            price: 6000000,
            total: 12000000
          }
        ],
        status: 'processing',
        paymentMethod: 'Credit Card',
        shippingAddress: {
          fullAddress: '789 Trần Hưng Đạo',
          city: 'Hà Nội',
          district: 'Hoàn Kiếm',
          ward: 'Phường Hàng Bạc'
        },
        subtotal: 12000000,
        shippingFee: 30000,
        discount: 0,
        total: 12000000,
        createdAt: '2026-04-04T09:15:00',
        updatedAt: '2026-04-04T10:00:00'
      },
      {
        id: '10231',
        customer: {
          id: 4,
          name: 'Phạm Thị D',
          email: 'phamthid@gmail.com',
          phone: '0934567890'
        },
        items: [
          {
            id: 4,
            productId: 4,
            productName: 'Sony WF-1000XM6',
            productImage: '/image/dashboard/homehero/swiperslide/Home_WF-1000XM6-final.png',
            quantity: 1,
            price: 6500000,
            total: 6500000
          }
        ],
        status: 'pending',
        paymentMethod: 'COD',
        shippingAddress: {
          fullAddress: '321 Võ Văn Tần',
          city: 'TP.HCM',
          district: 'Quận 3',
          ward: 'Phường 5'
        },
        subtotal: 6500000,
        shippingFee: 25000,
        discount: 0,
        total: 6500000,
        createdAt: '2026-04-03T16:45:00',
        updatedAt: '2026-04-03T16:45:00'
      },
      {
        id: '10230',
        customer: {
          id: 5,
          name: 'Hoàng Văn E',
          email: 'hoangvane@gmail.com',
          phone: '0945678901'
        },
        items: [
          {
            id: 5,
            productId: 5,
            productName: 'OPPO Find N6',
            productImage: '/image/dashboard/homehero/swiperslide/oppofingn6.png',
            quantity: 1,
            price: 9200000,
            total: 9200000
          }
        ],
        status: 'cancelled',
        paymentMethod: 'COD',
        shippingAddress: {
          fullAddress: '654 Điện Biên Phủ',
          city: 'TP.HCM',
          district: 'Bình Thạnh',
          ward: 'Phường 1'
        },
        subtotal: 9200000,
        shippingFee: 30000,
        discount: 0,
        total: 9200000,
        note: 'Khách hủy đơn',
        createdAt: '2026-04-03T11:20:00',
        updatedAt: '2026-04-03T12:00:00'
      }
    ]

    // Filter by status
    let filteredOrders = mockOrders
    if (filters.status && filters.status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status)
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredOrders = filteredOrders.filter(order => 
        order.id.toLowerCase().includes(searchLower) ||
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.customer.email.toLowerCase().includes(searchLower)
      )
    }

    const page = filters.page || 1
    const limit = filters.limit || 10
    const total = filteredOrders.length
    const totalPages = Math.ceil(total / limit)

    return {
      orders: filteredOrders,
      total,
      page,
      limit,
      totalPages
    }
  },

  /**
   * Get order by ID
   * 
   * API Endpoint: GET /api/orders/:id
   * Response: Order
   */
  async getOrderById(id: string): Promise<Order | null> {
    // TODO: Replace with actual API call
    // const data = await $fetch<Order>(`/api/orders/${id}`)
    
    const response = await this.getOrders()
    return response.orders.find(order => order.id === id) || null
  },

  /**
   * Update order status
   * 
   * API Endpoint: PATCH /api/orders/:id/status
   * Body: { status: OrderStatus }
   * Response: Order
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    // TODO: Replace with actual API call
    // const data = await $fetch<Order>(`/api/orders/${id}/status`, {
    //   method: 'PATCH',
    //   body: { status }
    // })
    
    const order = await this.getOrderById(id)
    if (!order) throw new Error('Order not found')
    
    order.status = status
    order.updatedAt = new Date().toISOString()
    
    return order
  }
}
