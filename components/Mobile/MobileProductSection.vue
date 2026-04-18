<template>
  <div class="mobile-prod-section" v-if="products && products.length">
    <div class="mobile-prod-section-header">
      <h2 class="mobile-prod-section-title">{{ title }}</h2>
    </div>

    <div class="mobile-prod-section-grid">
      <MobileProdCard
        v-for="product in displayedProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <NuxtLink v-if="viewAllLink" :to="viewAllLink" class="mobile-prod-view-all">
      Xem tất cả
      <i class="bi bi-chevron-right"></i>
    </NuxtLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import MobileProdCard from './MobileProdCard.vue'

const props = defineProps({
  title: { type: String, required: true },
  products: { type: Array, default: () => [] },
  viewAllLink: { type: String, default: '' },
  maxItems: { type: Number, default: 6 },
})

const displayedProducts = computed(() => {
  return (props.products || []).slice(0, props.maxItems)
})
</script>

<style scoped>
.mobile-prod-section {
  margin: 12px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.mobile-prod-section-header {
  padding: 14px 14px 0;
}

.mobile-prod-section-title {
  font-size: 1rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

.mobile-prod-section-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 10px 12px;
}

.mobile-prod-view-all {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  color: #2563eb;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;
}

.mobile-prod-view-all:hover {
  background: #f9fafb;
}

.mobile-prod-view-all i {
  font-size: 0.75rem;
}
</style>
