<template>
  <div ref="root" class="admin-action-menu">
    <button class="action-trigger" type="button" :aria-expanded="isOpen" @click="toggle">
      <i class="bi bi-three-dots-vertical"></i>
    </button>

    <Transition name="action-menu">
      <div v-if="isOpen" class="action-dropdown">
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
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits(['select'])

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const root = ref(null)
const isOpen = ref(false)

const toggle = () => {
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
</style>
