<template>
  <div class="admin-pagination">
    <p v-if="showSummary" class="pagination-summary">
      Showing {{ from }} to {{ to }} of {{ total }} entries
    </p>

    <div class="pagination-controls" role="navigation" aria-label="Pagination">
      <button type="button" :disabled="currentPage <= 1" @click="goTo(1)">
        <i class="bi bi-chevron-double-left"></i>
      </button>
      <button type="button" :disabled="currentPage <= 1" @click="goTo(currentPage - 1)">
        <i class="bi bi-chevron-left"></i>
      </button>

      <button
        v-for="item in visiblePages"
        :key="item.key"
        type="button"
        :disabled="item.ellipsis"
        :class="{ active: item.page === currentPage }"
        @click="!item.ellipsis && goTo(item.page)"
      >
        {{ item.label }}
      </button>

      <button type="button" :disabled="currentPage >= totalPages" @click="goTo(currentPage + 1)">
        <i class="bi bi-chevron-right"></i>
      </button>
      <button type="button" :disabled="currentPage >= totalPages" @click="goTo(totalPages)">
        <i class="bi bi-chevron-double-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['update:page'])

const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 0,
  },
  showSummary: {
    type: Boolean,
    default: true,
  },
})

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const currentPage = computed(() => Math.min(Math.max(1, props.page), totalPages.value))
const from = computed(() => (props.total === 0 ? 0 : (currentPage.value - 1) * props.pageSize + 1))
const to = computed(() => Math.min(props.total, currentPage.value * props.pageSize))

const visiblePages = computed(() => {
  const pages = []
  const max = totalPages.value

  if (max <= 6) {
    for (let page = 1; page <= max; page += 1) pages.push({ key: page, page, label: page })
    return pages
  }

  const candidates = new Set([1, max, currentPage.value, currentPage.value - 1, currentPage.value + 1])
  const sorted = [...candidates].filter((page) => page >= 1 && page <= max).sort((a, b) => a - b)

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      pages.push({ key: `ellipsis-${page}`, label: '...', ellipsis: true })
    }
    pages.push({ key: page, page, label: page })
  })

  return pages
})

const goTo = (page) => {
  const nextPage = Math.min(Math.max(1, page), totalPages.value)
  if (nextPage !== currentPage.value) emit('update:page', nextPage)
}
</script>

<style scoped>
.admin-pagination {
  padding: 16px 20px;
  border-top: 1px solid var(--admin-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.pagination-summary {
  margin: 0;
  color: var(--admin-subtle);
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pagination-controls button {
  min-width: 36px;
  height: 36px;
  border: 0;
  border-radius: 7px;
  background: #f0f0f2;
  color: var(--admin-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.pagination-controls button.active {
  background: #000;
  color: #fff;
  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.24);
}

.pagination-controls button:disabled {
  color: var(--admin-subtle);
  cursor: not-allowed;
  opacity: 0.65;
}

@media (max-width: 767.98px) {
  .admin-pagination {
    align-items: flex-start;
    flex-direction: column;
  }

  .pagination-controls {
    flex-wrap: wrap;
  }
}
</style>
