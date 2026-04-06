<template>
  <div class="position-relative">
    <aside class="sidebar-admin d-flex flex-column bg-white border-end p-3 position-relative vh-100 overflow-hidden" :class="{ 'sidebar-collapsed': isCollapsed }" >
      <!-- Header -->
      <div class="d-flex align-items-center gap-2 mb-4">
        <div class="bg-dark text-white rounded-3 d-flex align-items-center justify-content-center p-2" >
          <i class="bi bi-bag-check-fill fs-5"></i>
        </div>
        <span v-if="!isCollapsed" class="fs-5 fw-bold text-dark">
          {{ $t('sidebar.brandName') }}
        </span>
      </div>

      <!-- Search -->
      <div v-if="!isCollapsed" class="input-group mb-4">
        <span class="input-group-text bg-light border-end-0">
          <i class="bi bi-search text-muted"></i>
        </span>
        <input
          class="form-control bg-light border-start-0"
          :placeholder="$t('sidebar.searchPlaceholder')"
          v-model="searchQuery"
        />
      </div>

      <!-- Navigation -->
      <nav class="flex-grow-1 overflow-auto">
        <div class="mb-4">
          <small v-if="!isCollapsed" class="text-muted text-uppercase fw-semibold ps-3 d-block mb-2" >
            {{ $t('sidebar.sections.main') }}
          </small>

          <ul class="nav flex-column gap-1">
            <li v-for="item in mainMenuItems" :key="item.key">
              <NuxtLink :to="item.route" class="nav-link d-flex align-items-center gap-3 rounded-3 px-3 py-2" :class="isActiveRoute(item.route) ? 'bg-dark text-white' : 'text-secondary'" >
                <i class="bi fs-5" :class="item.icon"></i>
                <span v-if="!isCollapsed">{{ $t(item.label) }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Bottom -->
      <div class="pt-3 border-top">
        <ul class="nav flex-column gap-1 mb-3">
          <li v-for="item in bottomMenuItems" :key="item.key">
            <NuxtLink :to="item.route" class="nav-link d-flex align-items-center gap-3 rounded-3 px-3 py-2" :class="isActiveRoute(item.route) ? 'bg-dark text-white' : 'text-secondary'" >
              <i class="bi fs-5" :class="item.icon"></i>
              <span v-if="!isCollapsed">{{ $t(item.label) }}</span>
            </NuxtLink>
          </li>
        </ul>

        <!-- User -->
        <div class="d-flex align-items-center gap-3 p-3 rounded-3 bg-light">
          <i class="bi bi-person-circle fs-2 text-dark"></i>
          <div v-if="!isCollapsed" class="flex-grow-1 overflow-hidden">
            <div class="fw-semibold text-dark text-truncate small">
              {{ userName }}
            </div>
            <div class="text-muted text-truncate">
              {{ userEmail }}
            </div>
          </div>

          <button v-if="!isCollapsed" class="btn btn-sm p-0 text-muted">
            <i class="bi bi-three-dots-vertical"></i>
          </button>
        </div>
      </div>
    </aside>
    <!-- Toggle button -->
    <button class="toggle-btn btn btn-outline-secondary btn-sm position-absolute top-50 end-0 rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center" @click="toggleSidebar" >
      <i class="bi" :class="isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isCollapsed = ref(false)
const searchQuery = ref('')

const userName = ref('HuuThangLmao')
const userEmail = ref('thang@gmail.com')

const mainMenuItems = [
  { key: 'home', label: 'sidebar.menu.home', icon: 'bi-house-door', route: '/admin/dashboard' },
  { key: 'orders', label: 'sidebar.menu.orders', icon: 'bi-cart3', route: '/admin/orders' },
  { key: 'products', label: 'sidebar.menu.products', icon: 'bi-box-seam', route: '/admin/products' },
]

const bottomMenuItems = [
  { key: 'settings', label: 'sidebar.menu.settings', icon: 'bi-gear', route: '#' },
  { key: 'help', label: 'sidebar.menu.help', icon: 'bi-question-circle', route: '#' },
]

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const isActiveRoute = (itemRoute) => {
  if (itemRoute === '#') return false
  return route.path === itemRoute || route.path.startsWith(itemRoute + '/')
}
</script>

<style scoped>
.sidebar-admin {
  transition: width .3s ease;
}
.toggle-btn {
  transform: translate(50%, -50%);
}
@media (max-width: 768px) {
  .sidebar-admin {
    position: fixed;
    top: 9.1%;
    left: 0;
    height: 100vh;
    width: 260px;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    background: #fff;
  }

  .mobile-open .sidebar-admin {
    transform: translateX(0);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  }

  .toggle-btn {
    display: none !important;
  }
}
</style>
