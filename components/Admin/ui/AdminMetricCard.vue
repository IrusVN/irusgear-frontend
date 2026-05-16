<template>
  <div class="admin-metric-card">
    <div class="metric-copy">
      <span class="metric-label">{{ label }}</span>
      <strong class="metric-value">{{ value }}</strong>
      <span v-if="meta || trend" class="metric-meta">
        <span v-if="meta">{{ meta }}</span>
        <span v-if="trend" class="metric-trend" :class="trendClass">{{ trend }}</span>
      </span>
    </div>

    <span class="metric-icon" :class="variantClass">
      <i class="bi" :class="icon"></i>
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  meta: {
    type: String,
    default: '',
  },
  trend: {
    type: String,
    default: '',
  },
  trendDirection: {
    type: String,
    default: 'up',
    validator: (value) => ['up', 'down', 'neutral'].includes(value),
  },
  icon: {
    type: String,
    default: 'bi-graph-up',
  },
  variant: {
    type: String,
    default: 'neutral',
    validator: (value) => ['neutral', 'success', 'info', 'warning', 'danger'].includes(value),
  },
})

const variantClass = computed(() => `is-${props.variant}`)
const trendClass = computed(() => `is-${props.trendDirection}`)
</script>

<style scoped>
.admin-metric-card {
  min-height: 94px;
  padding: 20px var(--admin-card-padding);
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-radius);
  box-shadow: var(--admin-shadow-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.metric-copy {
  min-width: 0;
  display: grid;
  gap: 5px;
}

.metric-label {
  color: var(--admin-muted);
  font-size: 0.9rem;
}

.metric-value {
  color: var(--admin-text);
  font-size: 1.48rem;
  font-weight: 600;
  line-height: 1.1;
}

.metric-meta {
  color: var(--admin-muted);
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.metric-trend {
  border-radius: 5px;
  padding: 2px 7px;
  font-size: 0.74rem;
  font-weight: 700;
}

.metric-trend.is-up {
  background: rgba(40, 199, 111, 0.14);
  color: var(--admin-success);
}

.metric-trend.is-down {
  background: rgba(255, 76, 81, 0.14);
  color: var(--admin-danger);
}

.metric-trend.is-neutral {
  background: var(--admin-surface-soft);
  color: var(--admin-muted);
}

.metric-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--admin-radius);
  background: var(--admin-surface-soft);
  color: var(--admin-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  font-size: 1.18rem;
}

.metric-icon.is-success {
  background: rgba(40, 199, 111, 0.14);
  color: var(--admin-success);
}

.metric-icon.is-info {
  background: rgba(0, 207, 232, 0.14);
  color: var(--admin-info);
}

.metric-icon.is-warning {
  background: rgba(255, 159, 67, 0.16);
  color: var(--admin-warning);
}

.metric-icon.is-danger {
  background: rgba(255, 76, 81, 0.14);
  color: var(--admin-danger);
}
</style>
