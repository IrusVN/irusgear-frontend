<template>
  <div class="admin-data-table admin-card-shell">
    <slot name="toolbar" />

    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th v-if="selectable" class="select-cell">
              <input
                type="checkbox"
                :checked="isAllSelected"
                :indeterminate.prop="isIndeterminate"
                @change="toggleAll($event.target.checked)"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              :style="{ width: column.width || undefined, textAlign: column.align || undefined }"
            >
              {{ column.label }}
            </th>
            <th v-if="$slots.actions" class="actions-cell">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td :colspan="colspan">
              <div class="loading-rows">
                <AdminSkeleton v-for="index in 5" :key="index" height="38px" radius="7px" />
              </div>
            </td>
          </tr>

          <tr v-else-if="items.length === 0">
            <td :colspan="colspan">
              <AdminEmptyState :title="emptyTitle" :description="emptyDescription" />
            </td>
          </tr>

          <tr v-for="item in items" v-else :key="getRowKey(item)" @click="$emit('row-click', item)">
            <td v-if="selectable" class="select-cell" @click.stop>
              <input
                type="checkbox"
                :checked="selectedKeys.includes(getRowKey(item))"
                @change="toggleRow(item, $event.target.checked)"
              />
            </td>

            <td
              v-for="column in columns"
              :key="column.key"
              :style="{ textAlign: column.align || undefined }"
            >
              <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
                {{ item[column.key] }}
              </slot>
            </td>

            <td v-if="$slots.actions" class="actions-cell" @click.stop>
              <slot name="actions" :item="item" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <slot name="pagination" />
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'

const emit = defineEmits(['update:selectedKeys', 'row-click'])

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  selectedKeys: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyTitle: {
    type: String,
    default: 'No records found',
  },
  emptyDescription: {
    type: String,
    default: '',
  },
})

const slots = useSlots()
const colspan = computed(() => props.columns.length + (props.selectable ? 1 : 0) + (slots.actions ? 1 : 0))
const itemKeys = computed(() => props.items.map((item) => getRowKey(item)))
const isAllSelected = computed(() => itemKeys.value.length > 0 && itemKeys.value.every((key) => props.selectedKeys.includes(key)))
const isIndeterminate = computed(() => props.selectedKeys.length > 0 && !isAllSelected.value)

function getRowKey(item) {
  return item?.[props.rowKey] ?? item?.id
}

function toggleAll(checked) {
  emit('update:selectedKeys', checked ? itemKeys.value : [])
}

function toggleRow(item, checked) {
  const key = getRowKey(item)
  const next = checked
    ? [...new Set([...props.selectedKeys, key])]
    : props.selectedKeys.filter((selectedKey) => selectedKey !== key)
  emit('update:selectedKeys', next)
}
</script>

<style scoped>
.admin-data-table {
  overflow: visible;
}

.table-scroll {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 820px;
  border-collapse: collapse;
  background: var(--admin-surface);
}

th,
td {
  border-bottom: 1px solid var(--admin-border);
  color: var(--admin-text);
  padding: 12px 20px;
  vertical-align: middle;
}

th {
  height: 52px;
  color: #4b4b59;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

td {
  height: 52px;
  color: #696977;
  font-size: 0.94rem;
}

tbody tr {
  transition: background 0.16s ease;
}

tbody tr:hover {
  background: #fafafa;
}

tbody tr:last-child td {
  border-bottom: 0;
}

.select-cell {
  width: 58px;
}

.select-cell input {
  width: 18px;
  height: 18px;
  accent-color: #000;
}

.actions-cell {
  width: 112px;
  text-align: center;
}

.loading-rows {
  display: grid;
  gap: 10px;
  padding: 12px 0;
}
</style>
