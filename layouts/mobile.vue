<template>
  <div class="mobile-layout">
    <MobileHeader />
    <main class="mobile-main">
      <slot />
    </main>
    <MobileBottomNav />
  </div>
</template>

<script setup>
import MobileHeader from '~/components/Mobile/MobileHeader.vue'
import MobileBottomNav from '~/components/Mobile/MobileBottomNav.vue'
</script>

<style scoped>
.mobile-layout {
  min-height: 100vh;
  background: #f2f3f7;
  display: flex;
  flex-direction: column;
}

.mobile-main {
  flex: 1 1 auto;
  padding-bottom: 60px;
}
</style>
