<template>
  <section class="admin-card p-4" :class="{ 'is-hoverable': hoverable, 'has-padding': padded }">
    <header v-if="$slots.header || title || subtitle || $slots.actions" class="admin-card-header">
      <div class="admin-card-heading">
        <h3 v-if="title">{{ title }}</h3>
        <p v-if="subtitle">{{ subtitle }}</p>
        <slot name="header" />
      </div>
      <div v-if="$slots.actions" class="admin-card-actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="admin-card-body">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  padded: {
    type: Boolean,
    default: true,
  },
  hoverable: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.admin-card {
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-radius);
  box-shadow: var(--admin-shadow-soft);
  overflow: hidden;
}

.admin-card.has-padding {
  padding: var(--admin-card-padding);
}

.admin-card.is-hoverable {
  transition: box-shadow 0.18s ease, transform 0.18s ease;
}

.admin-card.is-hoverable:hover {
  box-shadow: var(--admin-shadow);
  transform: translateY(-1px);
}

.admin-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.admin-card-heading {
  min-width: 0;
}

.admin-card-heading h3 {
  margin: 0;
  color: var(--admin-text);
  font-size: 1.02rem;
  font-weight: 600;
  line-height: 1.35;
}

.admin-card-heading p {
  margin: 2px 0 0;
  color: var(--admin-muted);
  font-size: 0.88rem;
}

.admin-card-actions {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.admin-card-body {
  min-width: 0;
}
</style>
