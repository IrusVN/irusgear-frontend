// Order Types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  id: number
  productId: number
  productName: string
  productImage: string
  quantity: number
  price: number
  total: number
}

export interface Order {
  id: string
  customer: {
    id: number
    name: string
    email: string
    phone: string
    avatar?: string
  }
  items: OrderItem[]
  status: OrderStatus
  paymentMethod: string
  shippingAddress: {
    fullAddress: string
    city: string
    district: string
    ward: string
  }
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  note?: string
  createdAt: string
  updatedAt: string
}

export interface OrderFilters {
  status?: OrderStatus | 'all'
  search?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface OrderListResponse {
  orders: Order[]
  total: number
  page: number
  limit: number
  totalPages: number
}
