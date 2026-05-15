<template>
  <div class="admin-table-toolbar">
    <div class="toolbar-left">
      <label v-if="searchable" class="toolbar-search">
        <i class="bi bi-search"></i>
        <input
          :value="search"
          type="search"
          :placeholder="searchPlaceholder"
          @input="$emit('update:search', $event.target.value)"
        />
      </label>
      <slot name="filters" />
    </div>

    <div class="toolbar-actions">
      <label v-if="showPageSize" class="page-size-select">
        <select :value="pageSize" @change="$emit('update:page-size', Number($event.target.value))">
          <option v-for="option in pageSizeOptions" :key="option" :value="option">{{ option }}</option>
        </select>
        <i class="bi bi-chevron-down"></i>
      </label>

      <button v-if="showExport" class="admin-secondary-button" type="button" @click="$emit('export')">
        <i class="bi bi-upload"></i>
        <span>Export</span>
      </button>

      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineEmits(['update:search', 'update:page-size', 'export'])

defineProps({
  search: {
    type: String,
    default: '',
  },
  searchPlaceholder: {
    type: String,
    default: 'Search',
  },
  searchable: {
    type: Boolean,
    default: true,
  },
  showExport: {
    type: Boolean,
    default: true,
  },
  showPageSize: {
    type: Boolean,
    default: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  pageSizeOptions: {
    type: Array,
    default: () => [10, 25, 50, 100],
  },
})
</script>

<style scoped>
.admin-table-toolbar {
  padding: 18px 20px;
  background: var(--admin-surface);
  border-bottom: 1px solid var(--admin-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.toolbar-left,
.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-left {
  min-width: 0;
}

.toolbar-search {
  width: 230px;
  height: 40px;
  margin: 0;
  border: 1px solid var(--admin-border);
  border-radius: 7px;
  background: #fff;
  color: var(--admin-muted);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
}

.toolbar-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--admin-text);
}

.toolbar-search input::placeholder {
  color: var(--admin-subtle);
}

.page-size-select {
  height: 40px;
  margin: 0;
  border: 1px solid var(--admin-border);
  border-radius: 7px;
  background: #fff;
  display: inline-flex;
  align-items: center;
  position: relative;
}

.page-size-select select {
  min-width: 74px;
  height: 100%;
  border: 0;
  outline: 0;
  appearance: none;
  background: transparent;
  color: var(--admin-text);
  padding: 0 34px 0 13px;
}

.page-size-select i {
  position: absolute;
  right: 12px;
  color: var(--admin-muted);
  pointer-events: none;
  font-size: 0.78rem;
}

.admin-secondary-button {
  height: 40px;
  border: 0;
  border-radius: 7px;
  background: #ececef;
  color: var(--admin-muted);
  padding: 0 15px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

:deep(.admin-primary-button) {
  height: 40px;
  border: 0;
  border-radius: 7px;
  background: #000;
  color: #fff;
  padding: 0 17px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.22);
}

@media screen and (max-width: 767.98px) {
  .admin-table-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .toolbar-left,
  .toolbar-actions,
  .toolbar-search {
    width: 100%;
  }
}
</style>
