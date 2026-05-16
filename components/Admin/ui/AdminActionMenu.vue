<template>
  <div ref="root" class="admin-action-menu">
    <button class="action-trigger" type="button" :aria-expanded="isOpen" @click="handleTrigger">
      <i class="bi bi-three-dots-vertical"></i>
    </button>

    <!-- Desktop dropdown -->
    <Transition name="action-menu">
      <div v-if="isOpen && !isMobile" class="action-dropdown">
        <button
          v-for="item in items"
          :key="item.key || item.label"
          class="action-item"
          :class="{ danger: item.variant === 'danger' }"
          type="button"
          @click="handleSelect(item)"
        >
          <i v-if="item.icon" class="bi" :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </button>
        <slot />
      </div>
    </Transition>

    <!-- Mobile BottomSheet -->
    <BottomSheet :open="isOpen && isMobile" @close="close">
      <div class="action-sheet-content">
        <div class="action-sheet-header">
          <span>Actions</span>
          <button type="button" class="action-sheet-close" @click="close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <button
          v-for="item in items"
          :key="'m-' + (item.key || item.label)"
          class="action-sheet-item"
          :class="{ danger: item.variant === 'danger' }"
          type="button"
          @click="handleSelect(item)"
        >
          <i v-if="item.icon" class="bi" :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </button>
      </div>
    </BottomSheet>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useMediaQuery } from '@/composables/useMediaQuery'
import BottomSheet from '@/components/Common/BottomSheet.vue'

const emit = defineEmits(['select'])

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const root = ref(null)
const isOpen = ref(false)
const isMobile = useMediaQuery('(max-width: 767px)')

const handleTrigger = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const handleSelect = (item) => {
  emit('select', item)
  close()
}

const handleDocumentClick = (event) => {
  if (!root.value || root.value.contains(event.target)) return
  if (isMobile.value) return // BottomSheet handles its own close
  close()
}

onMounted(() => document.addEventListener('click', handleDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', handleDocumentClick))
</script>

<style scoped>
.admin-action-menu {
  position: relative;
  display: inline-flex;
}

.action-trigger {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--admin-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-trigger:hover {
  background: var(--admin-surface-soft);
  color: var(--admin-text);
}

.action-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 150px;
  padding: 6px;
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  border-radius: 8px;
  box-shadow: var(--admin-shadow);
  z-index: 20;
}

.action-item {
  width: 100%;
  min-height: 34px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--admin-text);
  padding: 7px 9px;
  display: flex;
  align-items: center;
  gap: 9px;
  text-align: left;
  white-space: nowrap;
}

.action-item:hover {
  background: var(--admin-surface-soft);
}

.action-item.danger {
  color: var(--admin-danger);
}

.action-menu-enter-active,
.action-menu-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}

.action-menu-enter-from,
.action-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

/* BottomSheet action items */
.action-sheet-content {
  padding: 0 0 12px;
}

.action-sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 20px 16px;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--admin-text);
}

.action-sheet-close {
  width: 36px;
  height: 36px;
  border: 0;
  background: var(--admin-surface-soft);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--admin-text);
  font-size: 1rem;
}

.action-sheet-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border: 0;
  background: transparent;
  color: var(--admin-text);
  font-size: 0.96rem;
  font-weight: 500;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
}

.action-sheet-item:active {
  background: var(--admin-surface-soft);
}

.action-sheet-item i {
  width: 22px;
  font-size: 1.1rem;
  text-align: center;
}

.action-sheet-item.danger {
  color: var(--admin-danger);
}

@media screen and (max-width: 767px) {
  .action-trigger {
    width: 44px;
    height: 44px;
    font-size: 1.2rem;
  }
}
</style>
