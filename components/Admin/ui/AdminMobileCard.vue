<template>
  <div class="mcard" @click="$emit('click')">
    <div class="mcard-header">
      <img v-if="avatar" :src="avatar" :alt="title" class="mcard-avatar" />
      <div class="mcard-avatar-icon" v-else-if="icon" :style="{ background: iconBg }">
        <i class="bi" :class="icon"></i>
      </div>
      <div class="mcard-title-group">
        <strong class="mcard-title">{{ title }}</strong>
        <span v-if="subtitle" class="mcard-subtitle">{{ subtitle }}</span>
      </div>
      <div class="mcard-right-slot">
        <slot name="badge" />
        <div @click.stop>
          <slot name="actions" />
        </div>
      </div>
    </div>
    <div v-if="meta && meta.length" class="mcard-meta">
      <div v-for="(m, i) in meta" :key="i" class="mcard-meta-item">
        <span class="mcard-meta-label">{{ m.label }}</span>
        <span class="mcard-meta-value" :class="m.class">{{ m.value }}</span>
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  avatar: { type: String, default: '' },
  icon: { type: String, default: '' },
  iconBg: { type: String, default: 'var(--admin-surface-soft)' },
  meta: { type: Array, default: () => [] },
})

defineEmits(['click'])
</script>

<style scoped>
.mcard {
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 10px;
  -webkit-tap-highlight-color: transparent;
  transition: box-shadow 0.15s;
}
.mcard:active { box-shadow: 0 0 0 2px rgba(0,0,0,0.06); }

.mcard-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mcard-avatar {
  width: 42px; height: 42px;
  border-radius: 10px;
  object-fit: cover;
  flex: 0 0 auto;
  background: var(--admin-surface-soft);
}

.mcard-avatar-icon {
  width: 42px; height: 42px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex: 0 0 auto;
  font-size: 1.1rem;
  color: var(--admin-text);
}

.mcard-title-group {
  flex: 1; min-width: 0;
}

.mcard-title {
  display: block;
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--admin-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mcard-subtitle {
  display: block;
  font-size: 0.78rem;
  color: var(--admin-muted);
  margin-top: 1px;
}

.mcard-right-slot {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.mcard-action-btn {
  width: 36px; height: 36px;
  border: 0; background: transparent;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: var(--admin-muted);
  font-size: 1.1rem;
}
.mcard-action-btn:active { background: var(--admin-surface-soft); }

.mcard-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--admin-border);
}

.mcard-meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.mcard-meta-label {
  font-size: 0.74rem;
  color: var(--admin-muted);
  font-weight: 500;
}

.mcard-meta-value {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--admin-text);
}
</style>
