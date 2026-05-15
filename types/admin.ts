import type { AdminCategory } from './category'
import type { AdminCustomer, AdminCustomerAddress } from './customer'

export type AdminProductStatus = 'publish' | 'scheduled' | 'inactive' | 'draft'
export type AdminStockState = 'in_stock' | 'low_stock' | 'out_of_stock'
export type AdminPaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded'
export type AdminFulfillmentStatus = 'ready_to_pickup' | 'out_for_delivery' | 'delivered' | 'dispatched' | 'processing'
export type AdminReviewStatus = 'pending' | 'published' | 'rejected'

export interface AdminProduct {
  id: number
  name: string
  slug: string
  vendor: string
  description: string
  sku: string
  categoryId: number
  categoryName: string
  categoryIcon: string
  image: string
  price: number
  compareAtPrice?: number
  quantity: number
  sales: number
  revenue: number
  status: AdminProductStatus
  stockState: AdminStockState
  stockEnabled: boolean
  featured: boolean
  rating: number
  createdAt: string
  updatedAt: string
}

export interface AdminOrderItem {
  id: number
  productId: number
  name: string
  variant: string
  image: string
  sku: string
  price: number
  quantity: number
  total: number
}

export interface AdminOrderActivity {
  id: number
  title: string
  description: string
  timestamp: string
  completed: boolean
}

export interface AdminOrder {
  id: number
  orderCode: string
  customer: Pick<AdminCustomer, 'id' | 'customerCode' | 'name' | 'email' | 'avatar' | 'initials' | 'phone'>
  date: string
  paymentStatus: AdminPaymentStatus
  fulfillmentStatus: AdminFulfillmentStatus
  paymentMethod: 'visa' | 'mastercard' | 'paypal' | 'cod' | 'bank_transfer'
  paymentLabel: string
  items: AdminOrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  shippingAddress: AdminCustomerAddress
  billingAddress: AdminCustomerAddress
  activity: AdminOrderActivity[]
  note?: string
}

export interface AdminReview {
  id: number
  productId: number
  productName: string
  customerId: number
  customerName: string
  rating: number
  title: string
  content: string
  status: AdminReviewStatus
  createdAt: string
}

export interface AdminReportPoint {
  label: string
  value: number
}

export interface AdminChartSeries {
  labels: string[]
  data: number[]
}

export interface AdminDashboardMock {
  metrics: {
    sales: number
    customers: number
    products: number
    revenue: number
  }
  salesChannels: Array<{
    label: string
    value: number
    orders: number
    change: number
    icon: string
    variant: 'neutral' | 'success' | 'info' | 'warning' | 'danger'
  }>
  revenueReport: {
    labels: string[]
    earning: number[]
    expense: number[]
  }
  profit: AdminChartSeries
  expenseBreakdown: AdminChartSeries
  leads: AdminChartSeries
  budget: AdminChartSeries
  earningReports: Array<{
    label: string
    description: string
    value: number
    change: number
    icon: string
    variant: 'neutral' | 'success' | 'info' | 'warning' | 'danger'
  }>
  transactions: Array<{
    id: number
    type: string
    description: string
    amount: number
    icon: string
    variant: 'neutral' | 'success' | 'info' | 'warning' | 'danger'
  }>
}

export interface AdminListResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type { AdminCategory, AdminCustomer }
