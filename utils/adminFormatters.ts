import type { AdminFulfillmentStatus, AdminPaymentStatus, AdminProductStatus, AdminStockState } from '~/types/admin'

export const formatAdminCurrency = (value: number, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(value)
}

export const formatAdminCompactNumber = (value: number) => {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export const formatAdminDate = (value: string | Date) => {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

export const formatAdminDateTime = (value: string | Date) => {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export const adminProductStatusMeta: Record<AdminProductStatus, { label: string; variant: 'success' | 'info' | 'warning' | 'danger' | 'neutral' }> = {
  publish: { label: 'Publish', variant: 'success' },
  scheduled: { label: 'Scheduled', variant: 'warning' },
  inactive: { label: 'Inactive', variant: 'danger' },
  draft: { label: 'Draft', variant: 'neutral' },
}

export const adminStockStateMeta: Record<AdminStockState, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  in_stock: { label: 'In Stock', variant: 'success' },
  low_stock: { label: 'Low Stock', variant: 'warning' },
  out_of_stock: { label: 'Out of Stock', variant: 'danger' },
}

export const adminPaymentStatusMeta: Record<AdminPaymentStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  paid: { label: 'Paid', variant: 'success' },
  failed: { label: 'Failed', variant: 'danger' },
  cancelled: { label: 'Cancelled', variant: 'neutral' },
  refunded: { label: 'Refunded', variant: 'neutral' },
}

export const adminFulfillmentStatusMeta: Record<AdminFulfillmentStatus, { label: string; variant: 'success' | 'info' | 'warning' | 'neutral' }> = {
  ready_to_pickup: { label: 'Ready to Pickup', variant: 'info' },
  out_for_delivery: { label: 'Out for Delivery', variant: 'neutral' },
  delivered: { label: 'Delivered', variant: 'success' },
  dispatched: { label: 'Dispatched', variant: 'warning' },
  processing: { label: 'Processing', variant: 'info' },
}
