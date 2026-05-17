<template>
  <nav v-if="isMobile" class="admin-bottom-nav">
    <NuxtLink v-for="tab in tabs" :key="tab.key" :to="tab.route" class="bnav-tab"
      :class="{ 'is-active': isTabActive(tab) }">
      <i class="bi" :class="tab.icon"></i>
      <span>{{ tab.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '#imports'
import { useMediaQuery } from '@/composables/useMediaQuery'

const { t } = useI18n()
const route = useRoute()
const isMobile = useMediaQuery('(max-width: 767px)')

const tabs = computed(() => [
  { key: 'dashboard', label: t('shipper.bottomNav.dashboard'), icon: 'bi-speedometer2', route: '/shipper/dashboard' },
  { key: 'pending', label: t('shipper.bottomNav.pending'), icon: 'bi-box-seam', route: '/shipper/orders/pending' },
  { key: 'delivered', label: t('shipper.bottomNav.delivered'), icon: 'bi-check2-circle', route: '/shipper/orders/delivered' },
  { key: 'earnings', label: t('shipper.bottomNav.earnings'), icon: 'bi-wallet2', route: '/shipper/earnings' },
])

const isTabActive = (tab) => {
  if (tab.route === '/shipper/dashboard') return route.path === tab.route
  return route.path.startsWith(tab.route)
}
</script>

<style scoped>
.admin-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1050;
  height: calc(60px + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--admin-border);
  display: flex;
  align-items: stretch;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
}

.bnav-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: 0;
  background: transparent;
  color: var(--admin-muted);
  text-decoration: none;
  font-size: 0.66rem;
  font-weight: 600;
  padding: 6px 0;
  position: relative;
  transition: color 0.2s ease;
}

.bnav-tab i { font-size: 1.18rem; line-height: 1; }
.bnav-tab.is-active { color: var(--admin-primary); }

.bnav-tab.is-active::after {
  content: '';
  position: absolute;
  top: 4px;
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: var(--admin-primary);
}
</style>
