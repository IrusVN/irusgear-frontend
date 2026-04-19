<template>
  <div class="mobile-category-bar">
    <div class="mobile-category-grid">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.key"
        :to="`/products?category=${cat.key}`"
        class="mobile-category-item"
      >
        <span class="mobile-category-icon-wrap">
          <i :class="['bi', cat.icon]"></i>
        </span>
        <span class="mobile-category-label">{{ cat.name }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '#imports'

const { t } = useI18n()

const categories = computed(() => [
  { key: 'dien-thoai', name: t('mobile.categories.phone'), icon: 'bi-phone' },
  { key: 'may-tinh-bang', name: t('mobile.categories.tablet'), icon: 'bi-tablet' },
  { key: 'laptop', name: t('mobile.categories.laptop'), icon: 'bi-laptop' },
  { key: 'dong-ho', name: t('mobile.categories.watch'), icon: 'bi-smartwatch' },
  { key: 'am-thanh', name: t('mobile.categories.audio'), icon: 'bi-headphones' },
  { key: 'phu-kien', name: t('mobile.categories.accessories'), icon: 'bi-earbuds' },
  { key: 'pc', name: t('mobile.categories.pc'), icon: 'bi-pc-display' },
  { key: 'tivi', name: t('mobile.categories.tv'), icon: 'bi-display' },
  { key: 'thu-cu', name: t('mobile.categories.tradeIn'), icon: 'bi-repeat' },
  { key: 'hang-cu', name: t('mobile.categories.used'), icon: 'bi-box-seam' },
  { key: 'khuyen-mai', name: t('mobile.categories.deals'), icon: 'bi-patch-check' },
  { key: 'do-gia-dung', name: t('mobile.categories.homeAppliance'), icon: 'bi-house' },
])
</script>

<style scoped>
.mobile-category-bar {
  background: #fff;
  border-radius: 12px;
  padding: 12px 8px;
  margin: 0 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.mobile-category-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 6px 0;
}

.mobile-category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 2px;
  text-decoration: none;
  color: #1f2937;
  border-radius: 10px;
  transition: background 0.15s;
}

.mobile-category-item:hover,
.mobile-category-item:active {
  background: #f3f4f6;
}

.mobile-category-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #374151;
  transition: transform 0.15s, box-shadow 0.15s;
}

.mobile-category-item:active .mobile-category-icon-wrap {
  transform: scale(0.92);
}

.mobile-category-label {
  font-size: 0.65rem;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  color: #374151;
  max-width: 56px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
