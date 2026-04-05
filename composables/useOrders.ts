import { ref } from 'vue'
import { orderService } from '~/services/orderService'
import type { Order, OrderFilters, OrderStatus } from '~/types/order'

/**
 * Orders Composable
 * 
 * Manages orders state and provides methods to fetch/update orders
 */
export const useOrders = () => {
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const total = ref(0)
  const page = ref(1)
  const limit = ref(10)
  const totalPages = ref(0)
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch orders list
   */
  const fetchOrders = async (filters: OrderFilters = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await orderService.getOrders(filters)
      
      orders.value = response.orders
      total.value = response.total
      page.value = response.page
      limit.value = response.limit
      totalPages.value = response.totalPages
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch orders'
      console.error('Error fetching orders:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch order by ID
   */
  const fetchOrderById = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      
      currentOrder.value = await orderService.getOrderById(id)
      
      if (!currentOrder.value) {
        error.value = 'Order not found'
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch order'
      console.error('Error fetching order:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Update order status
   */
  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      loading.value = true
      error.value = null
      
      const updatedOrder = await orderService.updateOrderStatus(id, status)
      
      // Update in list
      const index = orders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orders.value[index] = updatedOrder
      }
      
      // Update current order if viewing
      if (currentOrder.value?.id === id) {
        currentOrder.value = updatedOrder
      }
      
      return updatedOrder
    } catch (err: any) {
      error.value = err.message || 'Failed to update order status'
      console.error('Error updating order status:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    orders,
    currentOrder,
    total,
    page,
    limit,
    totalPages,
    loading,
    error,
    
    // Methods
    fetchOrders,
    fetchOrderById,
    updateOrderStatus
  }
}
