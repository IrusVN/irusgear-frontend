export type AdminCustomerStatus = 'active' | 'inactive' | 'blocked'
export type AdminLoyaltyTier = 'standard' | 'gold' | 'platinum'

export interface AdminCustomerAddress {
  line1: string
  line2?: string
  city: string
  state?: string
  country: string
  postalCode?: string
}

export interface AdminCustomer {
  id: number
  customerCode: string
  name: string
  email: string
  phone: string
  avatar: string
  initials: string
  country: string
  countryCode: string
  orders: number
  totalSpent: number
  accountBalance: number
  loyaltyTier: AdminLoyaltyTier
  loyaltyPoints: number
  wishlistCount: number
  couponCount: number
  status: AdminCustomerStatus
  billingAddress: AdminCustomerAddress
  shippingAddress: AdminCustomerAddress
  createdAt: string
  updatedAt: string
}

export interface AdminCustomerFilters {
  search?: string
  country?: string
  status?: AdminCustomerStatus | 'all'
  page?: number
  limit?: number
}
