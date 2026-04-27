import type { DashboardStats, Order, Product, ChartPeriod } from '~/types/dashboard'

/**
 * Dashboard Service
 * 
 * TODO: Replace mock data with actual API calls
 * Base URL should be configured in nuxt.config.ts or .env
 * 
 * Example API integration:
 * const response = await $fetch('/api/dashboard/stats', {
 *   baseURL: useRuntimeConfig().public.apiBase,
 *   headers: {
 *     Authorization: `Bearer ${token}`
 *   }
 * })
 */

export const dashboardService = {
  /**
   * Get dashboard statistics
   * 
   * API Endpoint: GET /api/dashboard/stats
   * Response: DashboardStats
   */
  async getStats(): Promise<DashboardStats> {
    // TODO: Replace with actual API call
    // const data = await $fetch<DashboardStats>('/api/dashboard/stats')
    
    // Mock data
    return {
      totalRevenue: 2500000000,
      totalOrders: 1234,
      totalCustomers: 8456,
      totalProducts: 567,
      revenueChange: 12.5,
      ordersChange: 8.2,
      customersChange: 5.7,
      productsChange: -2.1
    }
  },

  /**
   * Get recent orders
   * 
   * API Endpoint: GET /api/dashboard/orders/recent?limit=5
   * Response: Order[]
   */
  async getRecentOrders(limit: number = 5): Promise<Order[]> {
    // TODO: Replace with actual API call
    // const data = await $fetch<Order[]>('/api/dashboard/orders/recent', {
    //   params: { limit }
    // })
    
    // Mock data
    return [
      { id: '10234', customer: 'Nguyễn Văn A', date: '05/04/2026', amount: 15000000, status: 'delivered' },
      { id: '10233', customer: 'Trần Thị B', date: '04/04/2026', amount: 8500000, status: 'shipped' },
      { id: '10232', customer: 'Lê Văn C', date: '04/04/2026', amount: 12000000, status: 'processing' },
      { id: '10231', customer: 'Phạm Thị D', date: '03/04/2026', amount: 6500000, status: 'pending' },
      { id: '10230', customer: 'Hoàng Văn E', date: '03/04/2026', amount: 9200000, status: 'cancelled' },
    ]
  },

  /**
   * Get top selling products
   * 
   * API Endpoint: GET /api/dashboard/products/top?limit=5
   * Response: Product[]
   */
  async getTopProducts(limit: number = 5): Promise<Product[]> {
    // TODO: Replace with actual API call
    // const data = await $fetch<Product[]>('/api/dashboard/products/top', {
    //   params: { limit }
    // })
    
    // Mock data
    return [
      { 
        id: 1, 
        name: 'iPhone 17 Pro Max', 
        sold: 245, 
        revenue: 735000000,
        percentage: 95,
        image: '/image/dashboard/homehero/swiperslide/690x300_open_iPhone 17e.png'
      },
      { 
        id: 2, 
        name: 'MacBook Neo', 
        sold: 189, 
        revenue: 567000000,
        percentage: 85,
        image: '/image/dashboard/homehero/swiperslide/690x300_ROI_MacBookNeo.png'
      },
      { 
        id: 3, 
        name: 'AirPods Max 2', 
        sold: 156, 
        revenue: 234000000,
        percentage: 70,
        image: '/image/dashboard/homehero/swiperslide/690x300_PRE_AiPodsMax2.png'
      },
      { 
        id: 4, 
        name: 'Sony WF-1000XM6', 
        sold: 134, 
        revenue: 201000000,
        percentage: 60,
        image: '/image/dashboard/homehero/swiperslide/Home_WF-1000XM6-final.png'
      },
      { 
        id: 5, 
        name: 'OPPO Find N6', 
        sold: 98, 
        revenue: 147000000,
        percentage: 45,
        image: '/image/dashboard/homehero/swiperslide/oppofingn6.png'
      },
    ]
  },

  /**
   * Get sales chart data
   * 
   * API Endpoint: GET /api/dashboard/sales?period=12m
   * Response: SalesData
   */
  async getSalesData(period: '7d' | '30d' | '12m' = '12m'): Promise<ChartPeriod> {
    // TODO: Replace with actual API call
    // const data = await $fetch<SalesData>('/api/dashboard/sales', {
    //   params: { period }
    // })
    
    // Mock data
    return {
      '7d': {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        data: [12, 19, 15, 25, 22, 30, 28]
      },
      '30d': {
        labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 30) + 10)
      },
      '12m': {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        data: [65, 59, 80, 81, 56, 75, 90, 85, 70, 95, 88, 100]
      }
    }
  }
}
