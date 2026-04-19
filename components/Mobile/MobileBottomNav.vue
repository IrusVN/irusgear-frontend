<template>
  <nav class="mobile-bottom-nav">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.key"
      :to="tab.to"
      class="mobile-nav-tab"
      :class="{ active: isActive(tab) }"
    >
      <i :class="['bi', tab.icon]"></i>
      <span class="mobile-nav-label">{{ tab.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/authStore'
import { useI18n } from '#imports'

const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const tabs = computed(() => [
  { key: 'home', label: t('mobile.bottomNav.home'), icon: 'bi-house-fill', to: '/' },
  { key: 'category', label: t('mobile.bottomNav.category'), icon: 'bi-grid-fill', to: '/products' },
  { key: 'promo', label: t('mobile.bottomNav.promo'), icon: 'bi-lightning-charge-fill', to: '/products?sale=true' },
  { key: 'search', label: t('mobile.bottomNav.search'), icon: 'bi-search', to: '/products' },
  {
    key: 'account',
    label: t('mobile.bottomNav.account'),
    icon: 'bi-person-fill',
    to: isAuthenticated.value ? '/profile' : '/auth/login',
  },
])

const isActive = (tab) => {
  const path = route.path
  if (tab.key === 'home') return path === '/' || path === ''
  if (tab.key === 'account') return path.startsWith('/profile') || path.startsWith('/auth')
  if (tab.key === 'category' || tab.key === 'search') return path.startsWith('/products') && tab.key === 'category'
  return false
}
</script>

<style scoped>
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: 56px;
  display: flex;
  align-items: stretch;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -1px 6px rgba(0, 0, 0, 0.04);
}

.mobile-nav-tab {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  text-decoration: none;
  color: #6b7280;
  font-size: 0.62rem;
  font-weight: 500;
  transition: color 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.mobile-nav-tab i {
  font-size: 1.2rem;
  line-height: 1;
}

.mobile-nav-label {
  line-height: 1;
}

.mobile-nav-tab.active {
  color: #111827;
}

.mobile-nav-tab.active i {
  color: #111827;
}

.mobile-nav-tab:active {
  background: #f9fafb;
}
</style>
