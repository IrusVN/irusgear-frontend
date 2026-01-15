<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from '~/components/Sidebar/AdminSidebar.vue'
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
}

@media (max-width: 768px) {
  .admin-main {
    padding: 16px;
  }
}
</style>
