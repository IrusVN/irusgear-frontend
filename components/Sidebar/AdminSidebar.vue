<template>
  <div class="sidebar-wrapper position-relative">
    <aside class="sidebar-admin d-flex flex-column bg-white border-end p-3 h-100" :class="{ 'sidebar-collapsed': isCollapsed }" >
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
        <div class="d-flex align-items-center gap-3 p-3 rounded-3 bg-light position-relative">
          <i class="bi bi-person-circle fs-2 text-dark"></i>
          <div v-if="!isCollapsed" class="flex-grow-1 overflow-hidden">
            <div class="fw-semibold text-dark text-truncate small">
              {{ userName }}
            </div>
            <div class="text-muted text-truncate">
              {{ userEmail }}
            </div>
          </div>

          <div v-if="!isCollapsed" class="dropdown">
            <button 
              class="btn btn-sm p-0 text-muted" 
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <a class="dropdown-item" href="#">
                  <i class="bi bi-person me-2"></i>
                  Thông tin cá nhân
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  <i class="bi bi-gear me-2"></i>
                  Cài đặt
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item text-danger" @click="handleLogout">
                  <i class="bi bi-box-arrow-right me-2"></i>
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
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

const handleLogout = () => {
  // Clear auth token
  const authToken = useCookie('auth_token')
  authToken.value = null
  
  // Redirect to login
  navigateTo('/auth/login')
}
</script>

<style scoped>
.sidebar-wrapper {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  height: 100vh !important;
  z-index: 1000 !important;
  width: 260px;
  transition: width 0.3s ease;
}

.sidebar-wrapper:has(.sidebar-collapsed) {
  width: 80px;
}

.sidebar-admin {
  width: 100%;
  overflow-y: auto;
  height: 100%;
}

.sidebar-admin.sidebar-collapsed {
  overflow-x: hidden;
}

.toggle-btn {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
  z-index: 1001;
  width: 32px;
  height: 32px;
  padding: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn i {
  font-size: 14px;
}

@media (max-width: 768px) {
  .sidebar-wrapper {
    width: 260px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar-wrapper.mobile-open {
    transform: translateX(0);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  }

  .toggle-btn {
    display: none !important;
  }
}
</style>
