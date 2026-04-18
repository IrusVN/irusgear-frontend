<template>
  <div class="mobile-prod-card">
    <NuxtLink :to="productLink" class="mobile-prod-link">
      <div class="mobile-prod-badge-wrap">
        <span v-if="product.discount" class="mobile-prod-badge">-{{ product.discount }}%</span>
      </div>

      <div class="mobile-prod-img-box">
        <img :src="product.img" :alt="product.name" class="mobile-prod-img" loading="lazy" />
      </div>

      <div class="mobile-prod-body">
        <p class="mobile-prod-name">{{ product.name }}</p>

        <div class="mobile-prod-prices">
          <span class="mobile-prod-price-new">{{ fmt(product.price) }}</span>
          <span v-if="product.originalPrice" class="mobile-prod-price-old">{{ fmt(product.originalPrice) }}</span>
        </div>

        <div class="mobile-prod-rating">
          <i class="bi bi-star-fill"></i>
          <span>{{ normalizedRating }}</span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: { type: Object, required: true },
})

const fmt = (v) => {
  const value = Number(v) || 0
  return `${new Intl.NumberFormat('vi-VN').format(value)}đ`
}

const normalizedRating = computed(() => {
  const value = Number(props.product?.rating)
  if (Number.isFinite(value) && value > 0) return value.toFixed(1)
  return '5.0'
})

const productLink = computed(() => {
  if (props.product?.slug) return `/products/${props.product.slug}`
  if (typeof props.product?.url === 'string' && props.product.url.trim()) return props.product.url
  return '/'
})
</script>

<style scoped>
.mobile-prod-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.15s;
}

.mobile-prod-card:active {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.mobile-prod-link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.mobile-prod-badge-wrap {
  position: relative;
  height: 0;
}

.mobile-prod-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 2;
  padding: 2px 6px;
  border-radius: 4px;
  background: #111827;
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1.3;
}

.mobile-prod-img-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 8px 8px;
  height: 140px;
  background: #fff;
}

.mobile-prod-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.mobile-prod-body {
  padding: 0 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-prod-name {
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.3;
  color: #1f2937;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.1em;
  margin: 0;
}

.mobile-prod-prices {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
}

.mobile-prod-price-new {
  font-size: 0.88rem;
  font-weight: 700;
  color: #111827;
}

.mobile-prod-price-old {
  font-size: 0.7rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.mobile-prod-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.72rem;
  color: #6b7280;
}

.mobile-prod-rating .bi-star-fill {
  color: #f4b400;
  font-size: 0.7rem;
}
</style>
