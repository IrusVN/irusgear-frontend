<template>
  <div class="mobile-flash-sale">
    <div class="mobile-flash-header">
      <div class="mobile-flash-title">
        <span class="mobile-flash-label">FLASH SALE</span>
        <span class="mobile-flash-fire">🔥</span>
      </div>
      <div class="mobile-flash-countdown">
        <span class="mobile-cd-block">{{ pad(hours) }}</span>
        <span class="mobile-cd-sep">:</span>
        <span class="mobile-cd-block">{{ pad(minutes) }}</span>
        <span class="mobile-cd-sep">:</span>
        <span class="mobile-cd-block">{{ pad(seconds) }}</span>
      </div>
    </div>

    <div class="mobile-flash-scroll" v-if="flashProducts.length">
      <div
        v-for="product in flashProducts"
        :key="product.id"
        class="mobile-flash-card"
      >
        <NuxtLink :to="productLink(product)" class="mobile-flash-card-link">
          <div class="mobile-flash-badge" v-if="product.discount">
            -{{ product.discount }}%
          </div>
          <div class="mobile-flash-img-box">
            <img :src="product.img" :alt="product.name" class="mobile-flash-img" loading="lazy" />
          </div>
          <div class="mobile-flash-info">
            <p class="mobile-flash-name">{{ product.name }}</p>
            <span class="mobile-flash-price">{{ fmt(product.price) }}</span>
            <span v-if="product.originalPrice" class="mobile-flash-original">{{ fmt(product.originalPrice) }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div v-else class="mobile-flash-empty">
      <span class="text-muted small">Đang cập nhật...</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useHomeStore } from '~/stores/homeStore'
import { useCountdown } from '~/composables/useCountdown'

const homeStore = useHomeStore()
const { phoneProducts } = storeToRefs(homeStore)

const { hours, minutes, seconds } = useCountdown()

const flashProducts = computed(() => {
  const products = phoneProducts.value || []
  return products.slice(0, 8)
})

const pad = (n) => String(n).padStart(2, '0')

const fmt = (v) => {
  const value = Number(v) || 0
  return `${new Intl.NumberFormat('vi-VN').format(value)}đ`
}

const productLink = (product) => {
  if (product?.slug) return `/products/${product.slug}`
  return '/'
}
</script>

<style scoped>
.mobile-flash-sale {
  margin: 12px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.mobile-flash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: linear-gradient(90deg, #1a1a1a, #2d2d2d);
}

.mobile-flash-title {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mobile-flash-label {
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
}

.mobile-flash-fire {
  font-size: 1.1rem;
}

.mobile-flash-countdown {
  display: flex;
  align-items: center;
  gap: 3px;
}

.mobile-cd-block {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 26px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.mobile-cd-sep {
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
}

/* ─── Horizontal scroll cards ─── */
.mobile-flash-scroll {
  display: flex;
  gap: 8px;
  padding: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.mobile-flash-scroll::-webkit-scrollbar {
  display: none;
}

.mobile-flash-card {
  flex: 0 0 130px;
  scroll-snap-align: start;
}

.mobile-flash-card-link {
  position: relative;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow 0.15s;
}

.mobile-flash-card-link:active {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.mobile-flash-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 2;
  padding: 2px 5px;
  border-radius: 4px;
  background: #111827;
  color: #fff;
  font-size: 0.58rem;
  font-weight: 700;
}

.mobile-flash-img-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 110px;
  padding: 8px;
  background: #fff;
}

.mobile-flash-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.mobile-flash-info {
  padding: 6px 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-flash-name {
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.3;
  color: #1f2937;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 1.9em;
  margin: 0;
}

.mobile-flash-price {
  font-size: 0.82rem;
  font-weight: 700;
  color: #111827;
}

.mobile-flash-original {
  font-size: 0.65rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.mobile-flash-empty {
  padding: 24px;
  text-align: center;
}
</style>
