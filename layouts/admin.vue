<template>
  <div class="d-flex min-vh-100 bg-light">
    <!-- Mobile Header -->
    <header class="mobile-header d-none d-md-none position-fixed top-0 start-0 end-0 bg-white border-bottom px-3 align-items-center gap-3" style="height: 60px; z-index: 999;">
      <button class="hamburger-btn btn p-2" @click="toggleMobileSidebar" :class="{ active: isMobileSidebarOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <span class="fs-5 fw-bold text-dark">{{ $t('sidebar.brandName') }}</span>
    </header>

    <!-- Overlay for mobile -->
    <div 
      class="sidebar-overlay position-fixed top-0 start-0 end-0 bottom-0 d-none d-md-none" 
      :class="{ show: isMobileSidebarOpen }" 
      style="background: rgba(0, 0, 0, 0.5); z-index: 998;"
      @click="closeMobileSidebar"
    ></div>

    <AdminSidebar :class="{ 'mobile-open': isMobileSidebarOpen }" />
    <main class="admin-main flex-grow-1 p-4 overflow-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminSidebar from '@/components/Sidebar/AdminSidebar.vue'

const isMobileSidebarOpen = ref(false)

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}
</script>

<style scoped>
/* Hamburger Button - Bootstrap không có sẵn */
.hamburger-btn {
  width: 40px;
  height: 40px;
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

/* Overlay Animation */
.sidebar-overlay {
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
    display: flex !important;
  }

  .sidebar-overlay {
    display: block !important;
  }

  .admin-main {
    padding: 80px 16px 16px !important;
    margin-left: 0 !important;
  }
}
</style>
