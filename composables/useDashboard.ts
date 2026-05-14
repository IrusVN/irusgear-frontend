import { ref } from 'vue'
import { dashboardService } from '~/services/dashboardService'
import type { DashboardStats, Order, Product, ChartPeriod } from '~/types/dashboard'

/**
 * Dashboard Composable
 * 
 * Manages dashboard state and provides methods to fetch data
 * Team backend can integrate API by updating dashboardService.ts
 */
export const useDashboard = () => {
  const stats = ref<DashboardStats | null>(null)
  const recentOrders = ref<Order[]>([])
  const topProducts = ref<Product[]>([])
  const salesData = ref<ChartPeriod | null>(null)
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch dashboard statistics
   */
  const fetchStats = async () => {
    try {
      loading.value = true
      error.value = null
      stats.value = await dashboardService.getStats()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch stats'
      console.error('Error fetching stats:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch recent orders
   */
  const fetchRecentOrders = async (limit: number = 5) => {
    try {
      loading.value = true
      error.value = null
      recentOrders.value = await dashboardService.getRecentOrders(limit)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch orders'
      console.error('Error fetching orders:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch top products
   */
  const fetchTopProducts = async (limit: number = 5) => {
    try {
      loading.value = true
      error.value = null
      topProducts.value = await dashboardService.getTopProducts(limit)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch products'
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch sales chart data
   */
  const fetchSalesData = async () => {
    try {
      loading.value = true
      error.value = null
      salesData.value = await dashboardService.getSalesData()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch sales data'
      console.error('Error fetching sales data:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch all dashboard data
   */
  const fetchAllData = async () => {
    await Promise.all([
      fetchStats(),
      fetchRecentOrders(),
      fetchTopProducts(),
      fetchSalesData()
    ])
  }

  return {
    // State
    stats,
    recentOrders,
    topProducts,
    salesData,
    loading,
    error,
    
    // Methods
    fetchStats,
    fetchRecentOrders,
    fetchTopProducts,
    fetchSalesData,
    fetchAllData
  }
}
