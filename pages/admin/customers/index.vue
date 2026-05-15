<template>
  <div class="customers-page">
    <!-- Customer Table -->
    <AdminDataTable
      :columns="columns"
      :items="paginatedCustomers"
      :selectable="true"
      :selected-keys="selectedIds"
      @update:selected-keys="selectedIds = $event"
      @row-click="viewCustomer"
    >
      <template #toolbar>
        <AdminTableToolbar
          :search="search"
          :page-size="pageSize"
          search-placeholder="Search Customer"
          @update:search="search = $event; resetPage()"
          @update:page-size="pageSize = $event; resetPage()"
          @export="handleExport"
        >
          <template #actions>
            <button class="admin-primary-button" type="button" @click="handleAdd">
              <i class="bi bi-plus-lg"></i>
              <span>Add Customer</span>
            </button>
          </template>
        </AdminTableToolbar>
      </template>

      <!-- Customer -->
      <template #cell-name="{ item }">
        <div class="customer-cell">
          <img :src="item.avatar" :alt="item.name" class="customer-avatar" />
          <div class="customer-info">
            <strong>{{ item.name }}</strong>
            <small>{{ item.email }}</small>
          </div>
        </div>
      </template>

      <!-- Customer ID -->
      <template #cell-customerCode="{ item }">
        <code class="code-chip">{{ item.customerCode }}</code>
      </template>

      <!-- Country -->
      <template #cell-country="{ item }">
        <span class="country-cell">
          <img :src="`https://flagcdn.com/20x15/${item.countryCode.toLowerCase()}.png`" :alt="item.country" class="country-flag" />
          {{ item.country }}
        </span>
      </template>

      <!-- Orders -->
      <template #cell-orders="{ item }">
        <strong>{{ item.orders.toLocaleString() }}</strong>
      </template>

      <!-- Total Spent -->
      <template #cell-totalSpent="{ item }">
        <strong>{{ formatCurrency(item.totalSpent) }}</strong>
      </template>

      <!-- Actions -->
      <template #actions="{ item }">
        <AdminActionMenu
          :items="[
            { key: 'view', label: 'View Details', icon: 'bi-eye' },
            { key: 'edit', label: 'Edit', icon: 'bi-pencil' },
            { key: 'delete', label: 'Delete', icon: 'bi-trash', variant: 'danger' },
          ]"
          @select="handleAction($event, item)"
        />
      </template>

      <template #pagination>
        <AdminPagination
          :page="page"
          :page-size="pageSize"
          :total="filteredCustomers.length"
          @update:page="page = $event"
        />
      </template>
    </AdminDataTable>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHead, useRouter } from '#imports'
import { adminCustomersMock } from '~/mocks/admin/customers.mock'
import AdminDataTable from '@/components/Admin/ui/AdminDataTable.vue'
import AdminTableToolbar from '@/components/Admin/ui/AdminTableToolbar.vue'
import AdminPagination from '@/components/Admin/ui/AdminPagination.vue'
import AdminActionMenu from '@/components/Admin/ui/AdminActionMenu.vue'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Customers – IrusGear Admin' })

const router = useRouter()

const search = ref('')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref([])

const resetPage = () => { page.value = 1 }

const columns = [
  { key: 'name', label: 'Customer', width: '26%' },
  { key: 'customerCode', label: 'Customer ID' },
  { key: 'country', label: 'Country' },
  { key: 'orders', label: 'Orders', align: 'center' },
  { key: 'totalSpent', label: 'Total Spent' },
]

const filteredCustomers = computed(() => {
  if (!search.value) return adminCustomersMock
  const q = search.value.toLowerCase()
  return adminCustomersMock.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.customerCode.includes(q))
})

const paginatedCustomers = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredCustomers.value.slice(start, start + pageSize.value)
})

const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

const viewCustomer = (item) => router.push(`/admin/customers/${item.id}`)
const handleExport = () => alert('Export triggered (mock)')
const handleAdd = () => alert('Add customer (mock)')
const handleAction = (action, item) => {
  if (action.key === 'delete') alert(`Delete customer ${item.customerCode} (mock)`)
  else router.push(`/admin/customers/${item.id}`)
}
</script>

<style scoped>
.customers-page { max-width: 1560px; }

.customer-cell { display: flex; align-items: center; gap: 12px; }
.customer-avatar { width: 36px; height: 36px; border-radius: 999px; object-fit: cover; flex: 0 0 auto; }
.customer-info { min-width: 0; }
.customer-info strong { display: block; font-size: 0.9rem; color: var(--admin-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
.customer-info small { color: var(--admin-muted); font-size: 0.8rem; }

.code-chip { padding: 3px 8px; background: var(--admin-surface-soft); border-radius: 5px; font-size: 0.84rem; color: var(--admin-text); }

.country-cell { display: inline-flex; align-items: center; gap: 8px; font-size: 0.88rem; color: var(--admin-text); white-space: nowrap; }
.country-flag { width: 20px; height: 15px; border-radius: 2px; object-fit: cover; }
</style>
