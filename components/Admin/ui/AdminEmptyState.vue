<template>
  <div class="admin-empty-state">
    <span class="empty-icon">
      <i class="bi" :class="icon"></i>
    </span>
    <h3>{{ title }}</h3>
    <p v-if="description">{{ description }}</p>
    <div v-if="$slots.actions" class="empty-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'No data found',
  },
  description: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'bi-inbox',
  },
})
</script>

<style scoped>
.admin-empty-state {
  min-height: 260px;
  padding: 34px 20px;
  color: var(--admin-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.empty-icon {
  width: 54px;
  height: 54px;
  border-radius: 12px;
  background: var(--admin-surface-soft);
  color: var(--admin-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.45rem;
  margin-bottom: 14px;
}

.admin-empty-state h3 {
  margin: 0;
  color: var(--admin-text);
  font-size: 1.05rem;
  font-weight: 700;
}

.admin-empty-state p {
  max-width: 420px;
  margin: 7px 0 0;
}

.empty-actions {
  margin-top: 18px;
}
</style>
