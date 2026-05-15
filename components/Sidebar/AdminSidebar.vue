<template>
  <aside class="admin-sidebar"
    :class="{ 'is-collapsed': isCollapsed && !isHovered, 'is-hovered': isCollapsed && isHovered, 'is-mobile-open': mobileOpen }"
    @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="sidebar-brand">
      <NuxtLink class="brand-link" to="/admin/dashboard" @click="handleNavigate">
        <span class="brand-mark">
          <i class="bi bi-bag-check-fill"></i>
        </span>
        <span v-if="showExpanded" class="brand-name">IrusGear</span>
      </NuxtLink>

      <button class="collapse-button d-none d-lg-inline-flex" type="button" :aria-label="collapseLabel"
        @click="toggleCollapse">
        <i class="bi" :class="isCollapsed ? 'bi-circle' : 'bi-record-circle'"></i>
      </button>

      <button class="collapse-button d-lg-none" type="button" aria-label="Close menu" @click="$emit('close-mobile')">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-group">
        <div v-if="showExpanded" class="nav-group-label">Apps & Pages</div>

        <button class="nav-parent" type="button" :class="{ 'is-open': isEcommerceOpen }"
          @click="toggleGroup('ecommerce')">
          <i class="bi bi-cart3"></i>
          <span v-if="showExpanded">Ecommerce</span>
          <i v-if="showExpanded" class="bi bi-chevron-down nav-chevron"></i>
        </button>

        <Transition name="submenu">
          <div v-if="isEcommerceOpen || (isCollapsed && !isHovered)" class="submenu">
            <template v-for="item in ecommerceMenu" :key="item.key">
              <NuxtLink v-if="!item.children" class="nav-link-item" :class="{ 'is-active': isActiveRoute(item.route) }"
                :to="item.route" @click="handleNavigate">
                <span class="nav-dot"></span>
                <span v-if="showExpanded">{{ item.label }}</span>
              </NuxtLink>

              <div v-else class="nav-branch" :class="{ 'is-branch-active': isBranchActive(item) }">
                <button class="nav-link-item nav-branch-trigger" type="button" @click="toggleGroup(item.key)">
                  <span class="nav-dot"></span>
                  <span v-if="showExpanded">{{ item.label }}</span>
                  <i v-if="showExpanded" class="bi bi-chevron-down nav-chevron"></i>
                </button>

                <Transition name="submenu">
                  <div v-if="openGroups[item.key] || isBranchActive(item)" class="submenu nested">
                    <NuxtLink v-for="child in item.children" :key="child.key" class="nav-link-item"
                      :class="{ 'is-active': isActiveRoute(child.route) }" :to="child.route" @click="handleNavigate">
                      <span class="nav-dot"></span>
                      <span v-if="showExpanded">{{ child.label }}</span>
                    </NuxtLink>
                  </div>
                </Transition>
              </div>
            </template>
          </div>
        </Transition>
      </div>

      <div class="nav-group">
        <div v-if="showExpanded" class="nav-group-label">Operations</div>
        <NuxtLink v-for="item in operationMenu" :key="item.key" class="nav-parent nav-parent-link"
          :class="{ 'is-active-parent': isActiveRoute(item.route) }" :to="item.route" @click="handleNavigate">
          <i class="bi" :class="item.icon"></i>
          <span v-if="showExpanded">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>

    <div class="sidebar-footer">
      <NuxtLink class="nav-parent nav-parent-link" :class="{ 'is-active-parent': isActiveRoute('/admin/settings') }"
        to="/admin/settings" @click="handleNavigate">
        <i class="bi bi-gear"></i>
        <span v-if="showExpanded">Settings</span>
      </NuxtLink>
      <button class="nav-parent logout-inline" type="button" @click="handleLogout">
        <i class="bi bi-box-arrow-right"></i>
        <span v-if="showExpanded">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  mobileOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close-mobile', 'collapsed-change'])

const route = useRoute()
const auth = useAuthStore()
const isCollapsed = ref(false)
const isHovered = ref(false)
const openGroups = reactive({
  ecommerce: true,
  products: true,
  orders: false,
  customers: false,
})

const ecommerceMenu = [
  { key: 'dashboard', label: 'Dashboard', route: '/admin/dashboard' },
  {
    key: 'products',
    label: 'Product',
    children: [
      { key: 'product-list', label: 'List', route: '/admin/products' },
      { key: 'product-category', label: 'Category', route: '/admin/categories' },
    ],
  },
  {
    key: 'orders',
    label: 'Order',
    children: [
      { key: 'order-list', label: 'List', route: '/admin/orders' },
    ],
  },
  {
    key: 'customers',
    label: 'Customer',
    children: [
      { key: 'customer-list', label: 'List', route: '/admin/customers' },
    ],
  },
  { key: 'reviews', label: 'Manage Review', route: '/admin/reviews' },
  { key: 'referrals', label: 'Referrals', route: '/admin/referrals' },
]

const operationMenu = [
  { key: 'analytics', label: 'Analytics', icon: 'bi-pie-chart', route: '/admin/analytics' },
]

const collapseLabel = computed(() => (isCollapsed.value ? 'Expand sidebar' : 'Collapse sidebar'))
const showExpanded = computed(() => !isCollapsed.value || isHovered.value)
const isEcommerceOpen = computed(() => openGroups.ecommerce)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  isHovered.value = false
  emit('collapsed-change', isCollapsed.value)
}

const onMouseEnter = () => {
  if (isCollapsed.value) isHovered.value = true
}

const onMouseLeave = () => {
  isHovered.value = false
}

const toggleGroup = (key) => {
  if (isCollapsed.value && key !== 'ecommerce') {
    isCollapsed.value = false
    emit('collapsed-change', false)
  }
  openGroups[key] = !openGroups[key]
}

const isActiveRoute = (itemRoute) => {
  if (!itemRoute) return false
  if (itemRoute === '/admin/dashboard') return route.path === itemRoute
  return route.path === itemRoute || route.path.startsWith(`${itemRoute}/`)
}

const isBranchActive = (item) => {
  return item.children?.some((child) => isActiveRoute(child.route)) || false
}

const handleNavigate = () => {
  if (props.mobileOpen) emit('close-mobile')
}

const handleLogout = async () => {
  if (props.mobileOpen) emit('close-mobile')
  await auth.logout()
}

watch(
  () => route.path,
  () => {
    for (const item of ecommerceMenu) {
      if (item.children && isBranchActive(item)) openGroups[item.key] = true
    }
  },
  { immediate: true },
)
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

/* Hover-expand overlay: full width floating over content */
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
  background: #000;
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
  letter-spacing: 0;
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

.collapse-button:hover {
  background: var(--admin-surface-soft);
}

.sidebar-nav {
  flex: 1;
  min-height: 0;
  padding: 0 12px 12px;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-group {
  margin-bottom: 16px;
}

.nav-group-label {
  padding: 14px 10px 8px;
  color: var(--admin-subtle);
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
}

.nav-parent,
.nav-link-item {
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
  transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
}

.nav-parent:hover,
.nav-link-item:hover {
  background: var(--admin-surface-soft);
}

.nav-parent i:first-child {
  width: 20px;
  text-align: center;
  font-size: 1.08rem;
  color: currentColor;
}

.nav-chevron {
  margin-left: auto;
  font-size: 0.78rem;
  transition: transform 0.18s ease;
}

.nav-parent.is-open .nav-chevron,
.nav-branch.is-branch-active>.nav-branch-trigger .nav-chevron {
  transform: rotate(180deg);
}

.submenu {
  padding: 3px 0 3px 0;
}

.submenu.nested {
  padding-left: 14px;
}

.nav-link-item {
  color: #4d4d5c;
  padding-left: 15px;
}

.nav-dot {
  width: 8px;
  height: 8px;
  border: 1.5px solid currentColor;
  border-radius: 999px;
  flex: 0 0 auto;
  opacity: 0.7;
}

.nav-link-item.is-active {
  background: linear-gradient(90deg, #000, #2b2b2b);
  color: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.26);
}

.nav-link-item.is-active .nav-dot {
  opacity: 1;
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

.logout-inline {
  color: var(--admin-danger);
}

.admin-sidebar.is-collapsed .sidebar-brand {
  justify-content: center;
  padding-inline: 10px;
}

.admin-sidebar.is-collapsed .brand-link {
  flex: 0 0 auto;
}

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

.admin-sidebar.is-collapsed .nav-parent,
.admin-sidebar.is-collapsed .nav-link-item {
  justify-content: center;
  padding-inline: 0;
}

.admin-sidebar.is-collapsed .submenu.nested {
  padding-left: 0;
}

.submenu-enter-active,
.submenu-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 991.98px) {
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
