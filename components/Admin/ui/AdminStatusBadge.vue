<template>
  <span class="admin-status-badge" :class="variantClass">
    <span v-if="dot" class="status-dot"></span>
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'neutral',
    validator: (value) => ['neutral', 'success', 'info', 'warning', 'danger', 'dark'].includes(value),
  },
  dot: {
    type: Boolean,
    default: false,
  },
})

const variantClass = computed(() => `is-${props.variant}`)
</script>

<style scoped>
.admin-status-badge {
  min-height: 24px;
  border-radius: 6px;
  padding: 3px 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: currentColor;
}

.admin-status-badge.is-neutral {
  background: var(--admin-surface-soft);
  color: var(--admin-muted);
}

.admin-status-badge.is-success {
  background: rgba(40, 199, 111, 0.16);
  color: var(--admin-success);
}

.admin-status-badge.is-info {
  background: rgba(0, 207, 232, 0.16);
  color: #00a9c0;
}

.admin-status-badge.is-warning {
  background: rgba(255, 159, 67, 0.17);
  color: #ff8a00;
}

.admin-status-badge.is-danger {
  background: rgba(255, 76, 81, 0.16);
  color: var(--admin-danger);
}

.admin-status-badge.is-dark {
  background: #000;
  color: #fff;
}
</style>
