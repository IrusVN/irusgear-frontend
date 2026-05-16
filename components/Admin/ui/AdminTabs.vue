<template>
  <div class="admin-tabs" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="admin-tab"
      :class="{ active: modelValue === tab.value }"
      type="button"
      role="tab"
      :aria-selected="modelValue === tab.value"
      @click="$emit('update:modelValue', tab.value)"
    >
      <i v-if="tab.icon" class="bi" :class="tab.icon"></i>
      <span>{{ tab.label }}</span>
    </button>
  </div>
</template>

<script setup>
defineEmits(['update:modelValue'])

defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  tabs: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped>
.admin-tabs {
  display: flex;
  align-items: center;
  gap: 14px;
  overflow-x: auto;
}

.admin-tab {
  height: 42px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--admin-text);
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  font-weight: 600;
  transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
}

.admin-tab:hover {
  background: var(--admin-surface-soft);
}

.admin-tab.active {
  background: #000;
  color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.22);
}
</style>
