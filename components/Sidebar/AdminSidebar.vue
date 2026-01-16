<template>
  <aside class="admin-sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Header -->
    <div class="sidebar-header">
      <div class="logo-section">
        <div class="logo-icon">
          <i class="bi bi-bag-check-fill"></i>
        </div>
        <span class="logo-text" v-if="!isCollapsed">{{ $t('sidebar.brandName') }}</span>
      </div>
      <button class="collapse-btn" @click="toggleSidebar">
        <i class="bi" :class="isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
      </button>
    </div>

    <!-- Search -->
    <div class="sidebar-search" v-if="!isCollapsed">
      <i class="bi bi-search search-icon"></i>
      <input type="text" :placeholder="$t('sidebar.searchPlaceholder')" v-model="searchQuery" />
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <!-- Main Section -->
      <div class="nav-section">
        <span class="section-title" v-if="!isCollapsed">{{ $t('sidebar.sections.main') }}</span>
        <ul class="nav-list">
          <li v-for="item in mainMenuItems" :key="item.key">
            <NuxtLink 
              :to="item.route" 
              class="nav-item"
              :class="{ active: isActiveRoute(item.route) }"
            >
              <i class="bi" :class="item.icon"></i>
              <span v-if="!isCollapsed">{{ $t(item.label) }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>

    </nav>

    <!-- Bottom Section -->
    <div class="sidebar-bottom">
      <ul class="nav-list">
        <li v-for="item in bottomMenuItems" :key="item.key">
          <NuxtLink 
            :to="item.route" 
            class="nav-item"
            :class="{ active: isActiveRoute(item.route) }"
          >
            <i class="bi" :class="item.icon"></i>
            <span v-if="!isCollapsed">{{ $t(item.label) }}</span>
          </NuxtLink>
        </li>
      </ul>

      <!-- User Profile -->
      <div class="user-profile">
        <div class="user-icon">
          <i class="bi bi-person-circle"></i>
        </div>
        <div class="user-info" v-if="!isCollapsed">
          <span class="user-name">{{ userName }}</span>
          <span class="user-email">{{ userEmail }}</span>
        </div>
        <button class="user-menu-btn" v-if="!isCollapsed">
          <i class="bi bi-three-dots-vertical"></i>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// State
const isCollapsed = ref(false)
const searchQuery = ref('')

// User data (sẽ được thay thế bằng data từ store/API)
const userName = ref('HuuThangLmao')
const userEmail = ref('thang@gmail.com')

// Menu items
const mainMenuItems = [
  { key: 'home', label: 'sidebar.menu.home', icon: 'bi-house-door', route: '/dashboard' },
  { key: 'orders', label: 'sidebar.menu.orders', icon: 'bi-cart3', route: '/dashboard/orders' },
  { key: 'documentation', label: 'sidebar.menu.documentation', icon: 'bi-file-earmark-text', route: '/dashboard/documentation' },
  { key: 'mapOverview', label: 'sidebar.menu.mapOverview', icon: 'bi-grid-1x2', route: '/dashboard/map' },
  { key: 'statistics', label: 'sidebar.menu.statistics', icon: 'bi-pie-chart', route: '/dashboard/statistics' },
]

const bottomMenuItems = [
  { key: 'settings', label: 'sidebar.menu.settings', icon: 'bi-gear', route: '/dashboard/settings' },
  { key: 'help', label: 'sidebar.menu.help', icon: 'bi-question-circle', route: '/dashboard/help' },
]

// Methods
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const isActiveRoute = (itemRoute) => {
  return route.path === itemRoute || route.path.startsWith(itemRoute + '/')
}
</script>

<style scoped>
.admin-sidebar {
  width: 280px;
  min-height: 100vh;
  background: #fff;
  border-right: 1px solid #f0f0f5;
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.admin-sidebar.collapsed {
  width: 80px;
}

/* Header */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: #1f2937;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.logo-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(31, 41, 55, 0.3);
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  animation: fadeInRight 0.3s ease;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.collapse-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.collapse-btn:hover {
  background: #1f2937;
  border-color: #1f2937;
  color: #fff;
  transform: scale(1.05);
}

.collapse-btn:active {
  transform: scale(0.95);
}

/* Search */
.sidebar-search {
  position: relative;
  margin-bottom: 24px;
  animation: fadeInDown 0.3s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sidebar-search input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  color: #374151;
  background: #f9fafb;
  transition: all 0.3s ease;
}

.sidebar-search input::placeholder {
  color: #9ca3af;
}

.sidebar-search input:focus {
  outline: none;
  border-color: #1f2937;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.1);
  transform: scale(1.01);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 14px;
  transition: color 0.2s ease;
}

.sidebar-search:focus-within .search-icon {
  color: #1f2937;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 20px;
}

.section-title {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  padding-left: 12px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  animation: slideInLeft 0.3s ease;
  animation-fill-mode: both;
}

.nav-list li:nth-child(1) { animation-delay: 0.05s; }
.nav-list li:nth-child(2) { animation-delay: 0.1s; }
.nav-list li:nth-child(3) { animation-delay: 0.15s; }
.nav-list li:nth-child(4) { animation-delay: 0.2s; }
.nav-list li:nth-child(5) { animation-delay: 0.25s; }

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  color: #4b5563;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item i {
  font-size: 18px;
  width: 24px;
  text-align: center;
  transition: transform 0.3s ease;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #1f2937;
  transform: translateX(4px);
}

.nav-item:hover i {
  transform: scale(1.15);
}

.nav-item:active {
  transform: translateX(2px) scale(0.98);
}

.nav-item.active {
  background: #1f2937;
  color: #fff;
  box-shadow: 0 4px 12px rgba(31, 41, 55, 0.3);
  transform: translateX(0);
}

.nav-item.active:hover {
  transform: translateX(0);
  box-shadow: 0 6px 16px rgba(31, 41, 55, 0.4);
}

.nav-item.active i {
  color: #fff;
}

/* Bottom Section */
.sidebar-bottom {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #f0f0f5;
}

/* User Profile */
.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  margin-top: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-profile:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.user-profile:active {
  transform: translateY(0);
}

.user-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1f2937;
  font-size: 32px;
  transition: transform 0.3s ease;
}

.user-profile:hover .user-icon {
  transform: scale(1.1);
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-menu-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.user-menu-btn:hover {
  background: #e5e7eb;
  color: #374151;
  transform: rotate(90deg);
}

/* Collapsed state adjustments */
.collapsed .nav-item {
  justify-content: center;
  padding: 12px 8px;
}

.collapsed .nav-item i {
  width: auto;
}

.collapsed .user-profile {
  justify-content: center;
}

.collapsed .sidebar-bottom .nav-list .nav-item {
  justify-content: center;
}

/* Scrollbar styling */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .admin-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: none;
    height: 100vh;
    width: 280px;
  }

  .admin-sidebar.mobile-open {
    transform: translateX(0);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  }

  .collapse-btn {
    display: none;
  }
}
</style>
