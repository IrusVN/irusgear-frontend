<template>
  <div class="recent-orders bg-white rounded-3 p-4 border">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="fw-bold mb-0">{{ $t('dashboard.recentOrders.title') }}</h5>
      <a href="#" class="text-decoration-none">
        {{ $t('dashboard.recentOrders.viewAll') }}
        <i class="bi bi-arrow-right ms-1"></i>
      </a>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>{{ $t('dashboard.recentOrders.orderId') }}</th>
            <th>{{ $t('dashboard.recentOrders.customer') }}</th>
            <th>{{ $t('dashboard.recentOrders.date') }}</th>
            <th>{{ $t('dashboard.recentOrders.amount') }}</th>
            <th>{{ $t('dashboard.recentOrders.status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="recentOrders.length === 0">
            <td colspan="5" class="text-center text-muted py-4">
              {{ $t('dashboard.recentOrders.noOrders') }}
            </td>
          </tr>
          <tr v-else v-for="order in recentOrders" :key="order.id">
            <td class="fw-semibold">#{{ order.id }}</td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="avatar bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                  {{ order.customer.charAt(0) }}
                </div>
                {{ order.customer }}
              </div>
            </td>
            <td class="text-muted">{{ order.date }}</td>
            <td class="fw-semibold">{{ formatCurrency(order.amount) }}</td>
            <td>
              <span class="badge rounded-pill" :class="getStatusClass(order.status)">
                {{ $t(`dashboard.orderStatus.${order.status}`) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboard } from '~/composables/useDashboard'

const { recentOrders, fetchRecentOrders, loading } = useDashboard()

onMounted(() => {
  fetchRecentOrders()
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-warning-subtle text-warning',
    processing: 'bg-info-subtle text-info',
    shipped: 'bg-primary-subtle text-primary',
    delivered: 'bg-success-subtle text-success',
    cancelled: 'bg-danger-subtle text-danger'
  }
  return classes[status] || 'bg-secondary-subtle text-secondary'
}
</script>

<style scoped>
.table th {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.avatar {
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
