<template>
  <nav v-if="isMobile" class="admin-bottom-nav">
    <NuxtLink
      v-for="tab in mainTabs"
      :key="tab.key"
      :to="tab.route"
      class="bnav-tab"
      :class="{ 'is-active': isTabActive(tab) }"
    >
      <i class="bi" :class="tab.icon"></i>
      <span>{{ tab.label }}</span>
    </NuxtLink>

    <NuxtLink
      to="/admin/settings"
      class="bnav-tab"
      :class="{ 'is-active': isSettingsActive }"
    >
      <i class="bi bi-gear"></i>
      <span>Settings</span>
    </NuxtLink>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMediaQuery } from '@/composables/useMediaQuery'

const route = useRoute()
const isMobile = useMediaQuery('(max-width: 767px)')

const mainTabs = [
  { key: 'dashboard', label: 'Dashboard', icon: 'bi-house', route: '/admin/dashboard' },
  { key: 'products', label: 'Products', icon: 'bi-box-seam', route: '/admin/products' },
  { key: 'orders', label: 'Orders', icon: 'bi-receipt', route: '/admin/orders' },
  { key: 'analytics', label: 'Analytics', icon: 'bi-bar-chart-line', route: '/admin/analytics' },
]

const isSettingsActive = computed(() => route.path.startsWith('/admin/settings'))

const isTabActive = (tab) => {
  if (tab.route === '/admin/dashboard') return route.path === tab.route
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
  font-size: 0.68rem;
  font-weight: 600;
  padding: 6px 0;
  position: relative;
  transition: color 0.2s ease, transform 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.bnav-tab i {
  font-size: 1.2rem;
  line-height: 1;
  transition: transform 0.2s ease;
}

.bnav-tab:active {
  transform: scale(0.9);
}

.bnav-tab:active i {
  transform: scale(0.85);
}

.bnav-tab.is-active {
  color: var(--admin-primary);
}

/* Active indicator dot */
.bnav-tab.is-active::after {
  content: '';
  position: absolute;
  top: 4px;
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: var(--admin-primary);
  animation: bnav-dot-in 0.25s ease both;
}

@keyframes bnav-dot-in {
  from { opacity: 0; transform: scale(0); }
  to { opacity: 1; transform: scale(1); }
}
</style>
