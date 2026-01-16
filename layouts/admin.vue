<template>
  <div class="admin-layout">
    <!-- Mobile Header -->
    <header class="mobile-header">
      <button class="hamburger-btn" @click="toggleMobileSidebar" :class="{ active: isMobileSidebarOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <span class="mobile-brand">{{ $t('sidebar.brandName') }}</span>
    </header>

    <!-- Overlay for mobile -->
    <div class="sidebar-overlay" :class="{ show: isMobileSidebarOpen }" @click="closeMobileSidebar"></div>

    <AdminSidebar :class="{ 'mobile-open': isMobileSidebarOpen }" />
    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminSidebar from '~/components/Sidebar/AdminSidebar.vue'

const isMobileSidebarOpen = ref(false)

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.admin-main {
  flex: 1;
  padding: 24px;
  overflow-x: hidden;
  transition: margin-left 0.3s ease;
}

/* Mobile Header */
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 16px;
  align-items: center;
  gap: 16px;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.mobile-brand {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

/* Hamburger Button */
.hamburger-btn {
  width: 40px;
  height: 40px;
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.hamburger-btn:hover {
  background: #f3f4f6;
}

.hamburger-btn span {
  display: block;
  width: 24px;
  height: 2px;
  background: #1f2937;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

/* Hamburger Animation */
.hamburger-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-btn.active span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Overlay */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.sidebar-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* Responsive */
@media (max-width: 768px) {
  .mobile-header {
    display: flex;
  }

  .sidebar-overlay {
    display: block;
  }

  .admin-main {
    padding: 80px 16px 16px;
    margin-left: 0 !important;
  }
}
</style>
