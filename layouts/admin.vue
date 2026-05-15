<template>
  <div class="admin-shell">
    <AdminSidebar
      :mobile-open="isMobileSidebarOpen"
      @close-mobile="closeMobileSidebar"
      @collapsed-change="handleCollapsedChange"
    />

    <Transition name="admin-overlay">
      <button
        v-if="isMobileSidebarOpen"
        class="admin-sidebar-overlay"
        type="button"
        aria-label="Close menu"
        @click="closeMobileSidebar"
      ></button>
    </Transition>

    <main class="admin-content" :class="{ 'is-collapsed': isSidebarCollapsed, 'has-bottom-nav': isMobile }">
      <div class="admin-content-inner">
        <AdminTopbar @toggle-mobile="toggleMobileSidebar" />
        <div class="admin-page-body">
          <slot />
        </div>
      </div>
    </main>

    <AdminBottomNav />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AdminTopbar from '@/components/Admin/layout/AdminTopbar.vue'
import AdminSidebar from '@/components/Sidebar/AdminSidebar.vue'
import AdminBottomNav from '@/components/Admin/layout/AdminBottomNav.vue'
import { useMediaQuery } from '@/composables/useMediaQuery'

const isMobileSidebarOpen = ref(false)
const isSidebarCollapsed = ref(false)
const isMobile = useMediaQuery('(max-width: 767px)')

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

const handleCollapsedChange = (value) => {
  isSidebarCollapsed.value = value
}

watch(isMobileSidebarOpen, (isOpen) => {
  if (import.meta.client) {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})
</script>

<style scoped>
.admin-sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 1020;
  border: 0;
  background: rgba(17, 17, 22, 0.48);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 0;
  cursor: pointer;
}

.admin-overlay-enter-active,
.admin-overlay-leave-active {
  transition: opacity 0.28s ease;
}

.admin-overlay-enter-from,
.admin-overlay-leave-to {
  opacity: 0;
}
</style>
