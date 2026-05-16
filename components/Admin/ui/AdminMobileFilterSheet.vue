<template>
  <div>
    <!-- Trigger button -->
    <button class="filter-trigger" type="button" @click="isOpen = true">
      <i class="bi bi-funnel"></i>
      <span>Filters</span>
      <span v-if="activeCount" class="filter-badge">{{ activeCount }}</span>
    </button>

    <!-- BottomSheet -->
    <BottomSheet :open="isOpen" @close="isOpen = false">
      <div class="filter-sheet">
        <div class="filter-sheet-header">
          <span>Filters</span>
          <button type="button" class="filter-sheet-reset" @click="handleReset">Reset All</button>
        </div>

        <div class="filter-sheet-body">
          <div v-for="filter in filters" :key="filter.key" class="filter-group">
            <label class="filter-label">{{ filter.label }}</label>
            <select
              class="admin-control filter-select"
              :value="filter.value"
              @change="handleChange(filter.key, $event.target.value)"
            >
              <option v-for="opt in filter.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
        </div>

        <div class="filter-sheet-footer">
          <button class="admin-secondary-button" type="button" @click="isOpen = false">Cancel</button>
          <button class="admin-primary-button" type="button" @click="handleApply">Apply Filters</button>
        </div>
      </div>
    </BottomSheet>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BottomSheet from '@/components/Common/BottomSheet.vue'

const props = defineProps({
  filters: {
    type: Array,
    required: true,
    // Each filter: { key, label, value, defaultValue, options: [{ value, label }] }
  },
})

const emit = defineEmits(['change', 'reset'])

const isOpen = ref(false)

const activeCount = computed(() =>
  props.filters.filter(f => f.value !== f.defaultValue).length
)

const handleChange = (key, value) => {
  emit('change', { key, value })
}

const handleReset = () => {
  emit('reset')
}

const handleApply = () => {
  isOpen.value = false
}
</script>

<style scoped>
.filter-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid var(--admin-border);
  border-radius: 8px;
  background: var(--admin-surface);
  color: var(--admin-text);
  font-size: 0.88rem;
  font-weight: 600;
  -webkit-tap-highlight-color: transparent;
}

.filter-trigger:active {
  background: var(--admin-surface-soft);
}

.filter-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 10px;
  background: var(--admin-primary);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
}

.filter-sheet {
  padding: 0 0 env(safe-area-inset-bottom, 12px);
}

.filter-sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 20px 16px;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--admin-text);
}

.filter-sheet-reset {
  border: 0;
  background: transparent;
  color: var(--admin-primary);
  font-size: 0.88rem;
  font-weight: 600;
}

.filter-sheet-body {
  padding: 0 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--admin-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.filter-select {
  width: 100%;
  height: 44px;
  font-size: 0.92rem;
}

.filter-sheet-footer {
  display: flex;
  gap: 10px;
  padding: 12px 20px 0;
  border-top: 1px solid var(--admin-border);
}

.filter-sheet-footer .admin-secondary-button,
.filter-sheet-footer .admin-primary-button {
  flex: 1;
  height: 44px;
  justify-content: center;
}
</style>
