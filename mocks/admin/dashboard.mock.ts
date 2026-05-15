import type { AdminDashboardMock } from '~/types/admin'
import { adminOrdersMock } from './orders.mock'
import { adminProductsMock } from './products.mock'
import { adminCustomersMock } from './customers.mock'

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

export const adminDashboardMock: AdminDashboardMock = {
  metrics: {
    sales: 230000,
    customers: adminCustomersMock.length,
    products: adminProductsMock.length,
    revenue: adminOrdersMock.reduce((sum, order) => sum + order.total, 0),
  },
  salesChannels: [
    { label: 'In-Store Sales', value: 53450000, orders: 5000, change: 5.7, icon: 'bi-shop', variant: 'neutral' },
    { label: 'Website Sales', value: 674347000, orders: 21000, change: 12.4, icon: 'bi-display', variant: 'info' },
    { label: 'Discount', value: 14235000, orders: 6000, change: 0, icon: 'bi-gift', variant: 'warning' },
    { label: 'Affiliate', value: 8345000, orders: 150, change: -3.5, icon: 'bi-wallet2', variant: 'danger' },
  ],
  revenueReport: {
    labels: monthLabels,
    earning: [250, 190, 165, 180, 232, 260, 232, 250, 135],
    expense: [-130, -150, -170, -140, -92, -48, -75, -85, -170],
  },
  profit: {
    labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    data: [42, 58, 49, 66, 59, 74, 92],
  },
  expenseBreakdown: {
    labels: ['Used', 'Remaining'],
    data: [78, 22],
  },
  leads: {
    labels: ['Organic', 'Ads', 'Referral'],
    data: [184, 94, 72],
  },
  budget: {
    labels: monthLabels,
    data: [42, 56, 47, 53, 38, 68, 57, 60, 43, 62],
  },
  earningReports: [
    { label: 'Net Profit', description: '12.4k Sales', value: 16190000, change: 18.6, icon: 'bi-clock', variant: 'neutral' },
    { label: 'Total Income', description: 'Sales, Affiliation', value: 35710000, change: 39.6, icon: 'bi-currency-dollar', variant: 'success' },
    { label: 'Total Expenses', description: 'Ads, Marketing', value: 4300000, change: 52.8, icon: 'bi-credit-card', variant: 'neutral' },
  ],
  transactions: [
    { id: 1, type: 'Wallet', description: 'Starbucks', amount: -75000, icon: 'bi-wallet2', variant: 'neutral' },
    { id: 2, type: 'Bank Transfer', description: 'Add Money', amount: 480000, icon: 'bi-bank', variant: 'success' },
    { id: 3, type: 'PayPal', description: 'Client Payment', amount: 268000, icon: 'bi-paypal', variant: 'danger' },
    { id: 4, type: 'Master Card', description: 'Ordered iPhone 15', amount: -699000, icon: 'bi-credit-card', variant: 'neutral' },
    { id: 5, type: 'Bank Transactions', description: 'Refund', amount: 98000, icon: 'bi-currency-dollar', variant: 'info' },
    { id: 6, type: 'PayPal', description: 'Client Payment', amount: 126000, icon: 'bi-paypal', variant: 'danger' },
    { id: 7, type: 'Bank Transfer', description: 'Pay Office Rent', amount: -1290000, icon: 'bi-bank', variant: 'success' },
  ],
}

export const adminDashboardTopProducts = adminProductsMock
  .slice()
  .sort((a, b) => b.sales - a.sales)
  .slice(0, 6)

export const adminDashboardRecentOrders = adminOrdersMock.slice(0, 6)
