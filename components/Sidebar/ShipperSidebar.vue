<template>
  <aside class="admin-sidebar"
    :class="{ 'is-collapsed': isCollapsed && !isHovered, 'is-hovered': isCollapsed && isHovered, 'is-mobile-open': mobileOpen }"
    @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="sidebar-brand">
      <NuxtLink class="brand-link" to="/shipper/dashboard" @click="handleNavigate">
        <span class="brand-mark">
          <i class="bi bi-truck"></i>
        </span>
        <span v-if="showExpanded" class="brand-name">IrusGear</span>
      </NuxtLink>

      <button class="collapse-button d-none d-lg-inline-flex" type="button" :aria-label="collapseLabel"
        @click="toggleCollapse">
        <i class="bi" :class="isCollapsed ? 'bi-circle' : 'bi-record-circle'"></i>
      </button>

      <button class="collapse-button d-lg-none" type="button" :aria-label="$t('shipper.layout.closeMenu')"
        @click="$emit('close-mobile')">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-group">
        <div v-if="showExpanded" class="nav-group-label">{{ $t('shipper.sidebar.workspace') }}</div>

        <NuxtLink v-for="item in mainMenu" :key="item.key" class="nav-parent nav-parent-link"
          :class="{ 'is-active-parent': isActiveRoute(item.route) }" :to="item.route" @click="handleNavigate">
          <i class="bi" :class="item.icon"></i>
          <span v-if="showExpanded">{{ item.label }}</span>
          <span v-if="showExpanded && item.badge" class="nav-badge">{{ item.badge }}</span>
        </NuxtLink>
      </div>
    </nav>

    <div class="sidebar-footer">
      <button v-if="auth.isAuthenticated" class="nav-parent logout-inline" type="button" @click="handleLogout">
        <i class="bi bi-box-arrow-right"></i>
        <span v-if="showExpanded">{{ $t('shipper.layout.logout') }}</span>
      </button>
      <NuxtLink v-else to="/auth/login" class="nav-parent">
        <i class="bi bi-box-arrow-in-right"></i>
        <span v-if="showExpanded">{{ $t('shipper.layout.login') }}</span>
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '#imports'
import { useAuthStore } from '@/stores/authStore'

const { t } = useI18n()

const props = defineProps({
  mobileOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['close-mobile', 'collapsed-change'])

const route = useRoute()
const auth = useAuthStore()
const isCollapsed = ref(false)
const isHovered = ref(false)

const mainMenu = computed(() => [
  { key: 'dashboard', label: t('shipper.sidebar.dashboard'), icon: 'bi-speedometer2', route: '/shipper/dashboard' },
  { key: 'pending', label: t('shipper.sidebar.pendingOrders'), icon: 'bi-box-seam', route: '/shipper/orders/pending' },
  { key: 'delivered', label: t('shipper.sidebar.deliveredOrders'), icon: 'bi-check2-circle', route: '/shipper/orders/delivered' },
  { key: 'earnings', label: t('shipper.sidebar.earnings'), icon: 'bi-wallet2', route: '/shipper/earnings' },
])

const collapseLabel = computed(() => (isCollapsed.value ? t('shipper.layout.expandMenu') : t('shipper.layout.collapseMenu')))
const showExpanded = computed(() => !isCollapsed.value || isHovered.value)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  isHovered.value = false
  emit('collapsed-change', isCollapsed.value)
}

const onMouseEnter = () => { if (isCollapsed.value) isHovered.value = true }
const onMouseLeave = () => { isHovered.value = false }

const isActiveRoute = (itemRoute) => {
  if (!itemRoute) return false
  if (itemRoute === '/shipper/dashboard') return route.path === itemRoute
  return route.path === itemRoute || route.path.startsWith(`${itemRoute}/`)
}

const handleNavigate = () => {
  if (props.mobileOpen) emit('close-mobile')
}

const handleLogout = async () => {
  if (props.mobileOpen) emit('close-mobile')
  await auth.logout()
}
</script>

<style scoped>
.admin-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 1030;
  width: var(--admin-sidebar-width);
  height: 100vh;
  background: var(--admin-surface);
  border-right: 1px solid var(--admin-border);
  display: flex;
  flex-direction: column;
  transition: width 0.24s ease, transform 0.24s ease, box-shadow 0.24s ease;
}

.admin-sidebar.is-collapsed {
  width: var(--admin-sidebar-collapsed-width);
}

.admin-sidebar.is-hovered {
  width: var(--admin-sidebar-width);
  box-shadow: 6px 0 24px rgba(0, 0, 0, 0.12);
  z-index: 1040;
}

.sidebar-brand {
  min-height: 64px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-link {
  min-width: 0;
  flex: 1;
  color: var(--admin-text);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #050505, #2b2b2b);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  font-size: 1.05rem;
}

.brand-name {
  font-size: 1.32rem;
  font-weight: 800;
}

.collapse-button {
  width: 30px;
  height: 30px;
  border: 1px solid var(--admin-border);
  border-radius: 999px;
  background: #fff;
  color: var(--admin-text);
  align-items: center;
  justify-content: center;
  transition: background 0.18s ease, transform 0.18s ease;
}

.collapse-button:hover { background: var(--admin-surface-soft); }

.sidebar-nav {
  flex: 1;
  min-height: 0;
  padding: 0 12px 12px;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-group { margin-bottom: 16px; }

.nav-group-label {
  padding: 14px 10px 8px;
  color: var(--admin-subtle);
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
}

.nav-parent {
  width: 100%;
  min-height: 40px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--admin-text);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 10px;
  font-size: 0.94rem;
  line-height: 1.2;
  transition: background 0.18s ease, color 0.18s ease;
}

.nav-parent:hover { background: var(--admin-surface-soft); }

.nav-parent i:first-child {
  width: 20px;
  text-align: center;
  font-size: 1.08rem;
}

.nav-badge {
  margin-left: auto;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 11px;
  background: var(--admin-danger);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
}

.nav-parent-link.is-active-parent {
  background: var(--admin-primary-soft);
  color: var(--admin-primary);
  font-weight: 700;
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid var(--admin-border);
}

.logout-inline { color: var(--admin-danger); }

.admin-sidebar.is-collapsed .sidebar-brand {
  justify-content: center;
  padding-inline: 10px;
}

.admin-sidebar.is-collapsed .brand-link { flex: 0 0 auto; }

.admin-sidebar.is-collapsed .collapse-button {
  position: absolute;
  top: 18px;
  right: -15px;
  box-shadow: var(--admin-shadow);
}

.admin-sidebar.is-collapsed .sidebar-nav,
.admin-sidebar.is-collapsed .sidebar-footer {
  padding-inline: 10px;
}

.admin-sidebar.is-collapsed .nav-parent {
  justify-content: center;
  padding-inline: 0;
}

@media screen and (max-width: 991.98px) {
  .admin-sidebar {
    transform: translateX(-100%);
    box-shadow: none;
  }
  .admin-sidebar.is-mobile-open {
    transform: translateX(0);
    box-shadow: 0 0 30px rgba(15, 15, 20, 0.22);
  }
}
</style>
