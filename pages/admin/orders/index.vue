<template>
  <div class="orders-container">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold mb-1">{{ $t('orders.title') }}</h2>
        <p class="text-muted mb-0">{{ $t('orders.subtitle') }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-3 p-4 border mb-4">
      <div class="row g-3">
        <div class="col-12 col-md-4">
          <label class="form-label small fw-semibold">{{ $t('orders.filters.search') }}</label>
          <input 
            type="text" 
            class="form-control" 
            :placeholder="$t('orders.filters.searchPlaceholder')"
            v-model="searchQuery"
            @input="handleSearch"
          />
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label small fw-semibold">{{ $t('orders.filters.status') }}</label>
          <select class="form-select" v-model="statusFilter" @change="handleFilterChange">
            <option value="all">{{ $t('orders.filters.allStatus') }}</option>
            <option value="pending">{{ $t('dashboard.orderStatus.pending') }}</option>
            <option value="processing">{{ $t('dashboard.orderStatus.processing') }}</option>
            <option value="shipped">{{ $t('dashboard.orderStatus.shipped') }}</option>
            <option value="delivered">{{ $t('dashboard.orderStatus.delivered') }}</option>
            <option value="cancelled">{{ $t('dashboard.orderStatus.cancelled') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-3 border">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="px-4">{{ $t('orders.table.orderId') }}</th>
              <th>{{ $t('orders.table.customer') }}</th>
              <th>{{ $t('orders.table.items') }}</th>
              <th>{{ $t('orders.table.total') }}</th>
              <th>{{ $t('orders.table.status') }}</th>
              <th>{{ $t('orders.table.date') }}</th>
              <th class="text-center">{{ $t('orders.table.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="orders.length === 0">
              <td colspan="7" class="text-center text-muted py-5">
                {{ $t('orders.noOrders') }}
              </td>
            </tr>
            <tr v-else v-for="order in orders" :key="order.id" class="cursor-pointer">
              <td class="px-4">
                <span class="fw-semibold">#{{ order.id }}</span>
              </td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="avatar bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
                    {{ order.customer.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="fw-semibold">{{ order.customer.name }}</div>
                    <small class="text-muted">{{ order.customer.email }}</small>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge bg-light text-dark">{{ order.items.length }} sản phẩm</span>
              </td>
              <td class="fw-semibold">{{ formatCurrency(order.total) }}</td>
              <td>
                <select 
                  class="form-select form-select-sm"
                  :class="getStatusClass(order.status)"
                  :value="order.status"
                  @change="(e) => handleStatusChange(order.id, (e.target as HTMLSelectElement).value as OrderStatus)"
                  @click.stop
                >
                  <option value="pending">{{ $t('dashboard.orderStatus.pending') }}</option>
                  <option value="processing">{{ $t('dashboard.orderStatus.processing') }}</option>
                  <option value="shipped">{{ $t('dashboard.orderStatus.shipped') }}</option>
                  <option value="delivered">{{ $t('dashboard.orderStatus.delivered') }}</option>
                  <option value="cancelled">{{ $t('dashboard.orderStatus.cancelled') }}</option>
                </select>
              </td>
              <td class="text-muted">{{ formatDate(order.createdAt) }}</td>
              <td class="text-center">
                <NuxtLink 
                  :to="`/admin/orders/${order.id}`"
                  class="btn btn-sm btn-outline-primary"
                >
                  <i class="bi bi-eye"></i>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="d-flex justify-content-between align-items-center p-4 border-top">
        <div class="text-muted small">
          Hiển thị {{ orders.length }} / {{ total }} đơn hàng
        </div>
        <nav>
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: page === 1 }">
              <button class="page-link" @click="changePage(page - 1)">
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>
            <li 
              v-for="p in totalPages" 
              :key="p" 
              class="page-item" 
              :class="{ active: p === page }"
            >
              <button class="page-link" @click="changePage(p)">{{ p }}</button>
            </li>
            <li class="page-item" :class="{ disabled: page === totalPages }">
              <button class="page-link" @click="changePage(page + 1)">
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n, useHead } from '#imports'
import { useOrders } from '~/composables/useOrders'
import type { OrderStatus } from '~/types/order'

definePageMeta({
  layout: 'admin',
})

const { t } = useI18n()
useHead({ title: computed(() => t('orders.title')) })

const { orders, total, page, totalPages, loading, fetchOrders, updateOrderStatus } = useOrders()

const searchQuery = ref('')
const statusFilter = ref<OrderStatus | 'all'>('all')

let searchTimeout: NodeJS.Timeout

onMounted(() => {
  fetchOrders()
})

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handleFilterChange()
  }, 500)
}

const handleFilterChange = () => {
  fetchOrders({
    search: searchQuery.value,
    status: statusFilter.value,
    page: 1
  })
}

const changePage = (newPage: number) => {
  if (newPage < 1 || newPage > totalPages.value) return
  
  fetchOrders({
    search: searchQuery.value,
    status: statusFilter.value,
    page: newPage
  })
}

const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
  try {
    await updateOrderStatus(orderId, newStatus)
  } catch (err) {
    console.error('Failed to update status:', err)
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status: OrderStatus) => {
  const classes: Record<OrderStatus, string> = {
    pending: 'border-warning text-warning',
    processing: 'border-info text-info',
    shipped: 'border-primary text-primary',
    delivered: 'border-success text-success',
    cancelled: 'border-danger text-danger'
  }
  return classes[status] || ''
}
</script>

<style scoped>
.orders-container {
  max-width: 1400px;
}

.cursor-pointer {
  cursor: pointer;
}

.avatar {
  font-size: 0.875rem;
  font-weight: 600;
}

.table th {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-select-sm {
  font-size: 0.875rem;
  font-weight: 600;
  border-width: 2px;
}
</style>
