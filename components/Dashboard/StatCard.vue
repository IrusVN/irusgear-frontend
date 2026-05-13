<template>
  <div class="stat-card bg-white rounded-3 p-4 border h-100">
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div class="stat-icon rounded-3 p-3" :class="`bg-${color}-subtle`">
        <i class="bi fs-4" :class="[icon, `text-${color}`]"></i>
      </div>
      <span class="badge rounded-pill" :class="trend === 'up' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'">
        <i class="bi" :class="trend === 'up' ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
        {{ percentage }}%
      </span>
    </div>
    <h3 class="fs-2 fw-bold mb-1">{{ value }}</h3>
    <p class="text-muted mb-2">{{ title }}</p>
    <small class="text-muted">
      <i class="bi bi-calendar3"></i>
      {{ subtitle }}
    </small>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  subtitle: String,
  icon: String,
  color: {
    type: String,
    default: 'primary'
  },
  trend: {
    type: String,
    default: 'up'
  },
  percentage: {
    type: [String, Number],
    default: 0
  }
})
</script>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
