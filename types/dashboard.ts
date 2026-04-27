// Dashboard Types
export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueChange: number
  ordersChange: number
  customersChange: number
  productsChange: number
}

export interface Order {
  id: string
  customer: string
  date: string
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

export interface Product {
  id: number
  name: string
  sold: number
  revenue: number
  percentage: number
  image: string
}

export interface SalesData {
  labels: string[]
  data: number[]
}

export interface ChartPeriod {
  '7d': SalesData
  '30d': SalesData
  '12m': SalesData
}
