import type { AdminReview } from '~/types/admin'
import { adminProductsMock } from './products.mock'

const reviewTitles = ['Excellent quality', 'Fast delivery', 'Good value', 'Needs better packaging', 'Works as expected']
const statuses = ['published', 'pending', 'rejected'] as const

export const adminReviewsMock: AdminReview[] = Array.from({ length: 40 }, (_, index) => {
  const customerId = (index % 10) + 1
  const customerName = `Mock Customer ${customerId}`
  const product = adminProductsMock[index % adminProductsMock.length]

  return {
    id: index + 1,
    productId: product.id,
    productName: product.name,
    customerId,
    customerName,
    rating: 3 + (index % 3),
    title: reviewTitles[index % reviewTitles.length],
    content: `${customerName} reviewed ${product.name} in the admin mock data set.`,
    status: statuses[index % statuses.length],
    createdAt: `2026-05-${String((index % 24) + 1).padStart(2, '0')}T09:30:00.000Z`,
  }
})
