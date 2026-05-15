import type { AdminListResponse } from '~/types/admin'

export const paginateAdminItems = <T>(items: T[], page = 1, limit = 10): AdminListResponse<T> => {
  const safeLimit = Math.max(1, limit)
  const totalPages = Math.max(1, Math.ceil(items.length / safeLimit))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * safeLimit

  return {
    items: items.slice(start, start + safeLimit),
    total: items.length,
    page: safePage,
    limit: safeLimit,
    totalPages,
  }
}

export const includesAdminSearch = (values: Array<string | number | undefined | null>, query = '') => {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return true

  return values.some((value) => String(value ?? '').toLowerCase().includes(normalizedQuery))
}
