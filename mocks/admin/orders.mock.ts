import type { AdminOrder, AdminOrderActivity, AdminOrderItem } from '~/types/admin'
import { adminCustomersMock } from './customers.mock'
import { adminProductsMock } from './products.mock'

const paymentStatuses = ['pending', 'paid', 'failed', 'cancelled', 'refunded'] as const
const fulfillmentStatuses = ['ready_to_pickup', 'out_for_delivery', 'delivered', 'dispatched', 'processing'] as const
const paymentMethods = ['visa', 'mastercard', 'paypal', 'cod', 'bank_transfer'] as const

const methodLabels = {
  visa: 'Visa ...8535',
  mastercard: 'Mastercard ...3949',
  paypal: 'PayPal ...@gmail.com',
  cod: 'Cash on Delivery',
  bank_transfer: 'Bank Transfer',
}

const buildItems = (orderIndex: number): AdminOrderItem[] => {
  const count = (orderIndex % 3) + 1
  return Array.from({ length: count }, (_, itemIndex) => {
    const product = adminProductsMock[(orderIndex + itemIndex * 5) % adminProductsMock.length]
    const quantity = (itemIndex % 2) + 1
    return {
      id: orderIndex * 10 + itemIndex + 1,
      productId: product.id,
      name: product.name,
      variant: itemIndex % 2 === 0 ? product.categoryName : product.vendor,
      image: product.image,
      sku: product.sku,
      price: product.price,
      quantity,
      total: product.price * quantity,
    }
  })
}

const buildActivity = (index: number): AdminOrderActivity[] => {
  const steps = [
    ['Order was placed', 'The order was created successfully.'],
    ['Payment confirmed', 'Payment information was verified.'],
    ['Pick-up', 'Pick-up scheduled with courier.'],
    ['Dispatched', 'Package left the fulfillment center.'],
    ['Out for delivery', 'Courier is delivering the package.'],
    ['Delivery', 'Package will be delivered by tomorrow.'],
  ]

  return steps.map(([title, description], stepIndex) => ({
    id: stepIndex + 1,
    title,
    description,
    timestamp: `2026-05-${String((index % 20) + stepIndex + 1).padStart(2, '0')}T${String(8 + stepIndex).padStart(2, '0')}:20:00.000Z`,
    completed: stepIndex <= (index % steps.length),
  }))
}

export const adminOrdersMock: AdminOrder[] = Array.from({ length: 100 }, (_, index) => {
  const id = 9042 + index
  const customer = adminCustomersMock[index % adminCustomersMock.length]
  const items = buildItems(index)
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const shipping = index % 4 === 0 ? 0 : 45000
  const tax = Math.round(subtotal * 0.08)
  const discount = index % 5 === 0 ? 250000 : 0
  const paymentMethod = paymentMethods[index % paymentMethods.length]

  return {
    id,
    orderCode: `#${id}`,
    customer: {
      id: customer.id,
      customerCode: customer.customerCode,
      name: customer.name,
      email: customer.email,
      avatar: customer.avatar,
      initials: customer.initials,
      phone: customer.phone,
    },
    date: `2026-05-${String((index % 28) + 1).padStart(2, '0')}T${String((index % 12) + 8).padStart(2, '0')}:15:00.000Z`,
    paymentStatus: paymentStatuses[index % paymentStatuses.length],
    fulfillmentStatus: fulfillmentStatuses[(index + 2) % fulfillmentStatuses.length],
    paymentMethod,
    paymentLabel: methodLabels[paymentMethod],
    items,
    subtotal,
    shipping,
    tax,
    discount,
    total: subtotal + shipping + tax - discount,
    shippingAddress: customer.shippingAddress,
    billingAddress: customer.billingAddress,
    activity: buildActivity(index),
    note: index % 7 === 0 ? 'Customer requested careful packaging.' : undefined,
  }
})
