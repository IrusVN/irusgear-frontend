<template>
  <div class="top-products bg-white rounded-3 p-4 border">
    <h5 class="fw-bold mb-4">{{ $t('dashboard.topProducts.title') }}</h5>

    <div class="products-list">
      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else-if="topProducts.length === 0" class="text-center text-muted py-4">
        Chưa có dữ liệu
      </div>
      <div v-else v-for="(product, index) in topProducts" :key="product.id" class="product-item d-flex align-items-center gap-3 p-3 rounded-3 mb-2" :class="{ 'bg-light': index % 2 === 0 }">
        <div class="rank-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 32px; height: 32px; font-size: 0.875rem;">
          {{ index + 1 }}
        </div>
        
        <div class="product-image bg-light rounded-3 overflow-hidden" style="width: 48px; height: 48px;">
          <img :src="product.image" :alt="product.name" class="w-100 h-100 object-fit-cover" />
        </div>

        <div class="flex-grow-1">
          <div class="fw-semibold text-truncate">{{ product.name }}</div>
          <small class="text-muted">{{ product.sold }} {{ $t('dashboard.topProducts.sold') }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboard } from '~/composables/useDashboard'

const { topProducts, fetchTopProducts, loading } = useDashboard()

onMounted(() => {
  fetchTopProducts()
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    notation: 'compact',
    maximumFractionDigits: 0
  }).format(amount)
}
</script>

<style scoped>
.product-item {
  transition: all 0.2s ease;
}

.product-item:hover {
  background-color: #f8f9fa !important;
  transform: translateX(4px);
}

.rank-badge {
  flex-shrink: 0;
}

.product-image img {
  object-fit: contain;
}
</style>
