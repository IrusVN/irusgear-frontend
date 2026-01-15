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
import { ref, computed } from 'vue'
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
  transition: width 0.3s ease;
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
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
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
  background: #f3f4f6;
  color: #6366f1;
}

/* Search */
.sidebar-search {
  position: relative;
  margin-bottom: 24px;
}

.sidebar-search input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  color: #374151;
  background: #f9fafb;
  transition: all 0.2s ease;
}

.sidebar-search input::placeholder {
  color: #9ca3af;
}

.sidebar-search input:focus {
  outline: none;
  border-color: #6366f1;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 14px;
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
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
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
  transition: all 0.2s ease;
  position: relative;
}

.nav-item i {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #6366f1;
}

.nav-item.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.nav-item.active i {
  color: #fff;
}

.nav-badge {
  margin-left: auto;
  background: #e0e7ff;
  color: #6366f1;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.nav-item.active .nav-badge {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

/* Capacity Card */
.capacity-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  margin: 16px 0;
  text-align: center;
  position: relative;
}

.capacity-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.capacity-close:hover {
  background: #e5e7eb;
  color: #374151;
}

.capacity-ring {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  position: relative;
}

.circular-chart {
  width: 100%;
  height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #e5e7eb;
  stroke-width: 2.5;
}

.circle {
  fill: none;
  stroke: #6366f1;
  stroke-width: 2.5;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
  transform: rotate(-90deg);
  transform-origin: center;
}

@keyframes progress {
  0% {
    stroke-dasharray: 0 100;
  }
}

.capacity-percent {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: 700;
  color: #374151;
}

.capacity-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.capacity-desc {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 12px;
  line-height: 1.4;
}

.upgrade-btn {
  width: 100%;
  padding: 10px 16px;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upgrade-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
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
  transition: all 0.2s ease;
}

.user-profile:hover {
  background: #f3f4f6;
}

.user-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  font-size: 32px;
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
}

.user-menu-btn:hover {
  background: #e5e7eb;
  color: #374151;
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

/* Responsive */
@media (max-width: 768px) {
  .admin-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .admin-sidebar.show {
    transform: translateX(0);
  }
}
</style>
