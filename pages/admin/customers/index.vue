<template>
  <div class="customers-page">
    <!-- Customer Table (Desktop) -->
    <AdminDataTable
      v-if="!isMobile"
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
          :search-placeholder="$t('admin.customers.searchCustomer')"
          @update:search="handleSearch"
          @update:page-size="changePageSize"
          @export="handleExport"
        >
          <template #actions>
            <button class="admin-primary-button" type="button" @click="handleAdd">
              <i class="bi bi-plus-lg"></i>
              <span>{{ $t('admin.customers.addCustomer') }}</span>
            </button>
          </template>
        </AdminTableToolbar>
      </template>

      <template #cell-name="{ item }">
        <div class="customer-cell">
          <img :src="item.avatar" :alt="item.name" class="customer-avatar" />
          <div class="customer-info">
            <strong>{{ item.name }}</strong>
            <small>{{ item.email }}</small>
          </div>
        </div>
      </template>

      <template #cell-customerCode="{ item }">
        <code class="code-chip">{{ item.customerCode }}</code>
      </template>

      <template #cell-country="{ item }">
        <span class="country-cell">
          <img :src="`https://flagcdn.com/20x15/${item.countryCode.toLowerCase()}.png`" :alt="item.country" class="country-flag" />
          {{ item.country }}
        </span>
      </template>

      <template #cell-orders="{ item }">
        <strong>{{ item.orders.toLocaleString() }}</strong>
      </template>

      <template #cell-totalSpent="{ item }">
        <strong>{{ formatCurrency(item.totalSpent) }}</strong>
      </template>

      <template #actions="{ item }">
        <AdminActionMenu
          :items="[
            { key: 'view', label: $t('admin.customers.viewDetails'), icon: 'bi-eye' },
            { key: 'edit', label: $t('admin.customers.edit'), icon: 'bi-pencil' },
            { key: 'delete', label: $t('admin.customers.delete'), icon: 'bi-trash', variant: 'danger' },
          ]"
          @select="handleAction($event, item)"
        />
      </template>

      <template #pagination>
        <AdminPagination
          :page="page"
          :page-size="pageSize"
          :total="totalCustomers"
          @update:page="changePage"
        />
      </template>
    </AdminDataTable>

    <!-- Mobile Card List -->
    <div v-if="isMobile" class="admin-card-shell" style="padding:14px">
      <label style="display:block;position:relative;margin-bottom:12px">
        <i class="bi bi-search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--admin-muted)"></i>
        <input class="admin-control" :value="search" :placeholder="$t('admin.customers.searchCustomer')" style="padding-left:36px;width:100%" @input="handleSearch($event.target.value)">
      </label>
      <AdminMobileCard
        v-for="item in paginatedCustomers"
        :key="item.id"
        :title="item.name"
        :subtitle="item.email"
        :avatar="item.avatar"
        :meta="[
          { label: $t('admin.customers.orders'), value: item.orders.toLocaleString() },
          { label: $t('admin.customers.spent'), value: formatCurrency(item.totalSpent) },
          { label: $t('admin.customers.idLabel'), value: item.customerCode },
        ]"
        @click="viewCustomer(item)"
      >
        <template #actions>
          <AdminActionMenu
            :items="[
              { key: 'view', label: $t('admin.customers.viewDetails'), icon: 'bi-eye' },
              { key: 'edit', label: $t('admin.customers.edit'), icon: 'bi-pencil' },
              { key: 'delete', label: $t('admin.customers.delete'), icon: 'bi-trash', variant: 'danger' },
            ]"
            @select="handleAction($event, item)"
          />
        </template>
      </AdminMobileCard>
      <div v-if="totalCustomers > customers.length" style="text-align:center;padding:8px">
        <button v-if="page * pageSize < totalCustomers" class="admin-secondary-button" @click="changePage(page + 1)">{{ $t('admin.customers.loadMore') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead, useRouter, useI18n } from '#imports'
import { useAdminStore } from '@/stores/adminStore'
import { usePaginationStore } from '@/stores/paginationStore'
import AdminDataTable from '@/components/Admin/ui/AdminDataTable.vue'
import AdminTableToolbar from '@/components/Admin/ui/AdminTableToolbar.vue'
import AdminPagination from '@/components/Admin/ui/AdminPagination.vue'
import AdminActionMenu from '@/components/Admin/ui/AdminActionMenu.vue'
import AdminMobileCard from '@/components/Admin/ui/AdminMobileCard.vue'
import { useMediaQuery } from '@/composables/useMediaQuery'

const { t } = useI18n()
const isMobile = useMediaQuery('(max-width: 767px)')

definePageMeta({ layout: 'admin' })
useHead({ title: () => t('admin.customers.pageTitle') })

const router = useRouter()
const admin = useAdminStore()
const pagination = usePaginationStore()

const search = ref('')
const searchTimeout = ref(null)
const page = computed(() => pagination.page)
const pageSize = computed(() => pagination.limit)
const totalCustomers = computed(() => pagination.total)

const selectedIds = ref([])
const customers = ref([])

const handleSearch = (val) => {
  search.value = val
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    pagination.page = 1
    fetchCustomers()
  }, 300)
}

const changePage = (p) => {
  pagination.page = p
  fetchCustomers()
}

const changePageSize = (size) => {
  pagination.limit = size
  pagination.page = 1
  fetchCustomers()
}

const columns = computed(() => [
  { key: 'name', label: t('admin.customers.title').replace(/s$/i, ''), width: '26%' },
  { key: 'customerCode', label: t('admin.customers.customerId') },
  { key: 'country', label: t('admin.customers.country') },
  { key: 'orders', label: t('admin.customers.totalOrders'), align: 'center' },
  { key: 'totalSpent', label: t('admin.customers.totalSpent') },
])

const paginatedCustomers = computed(() => customers.value)

const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

const viewCustomer = (item) => router.push(`/admin/customers/${item.id}`)
const handleExport = () => alert(t('admin.customers.exportMock'))
const handleAdd = () => alert(t('admin.customers.addMock'))
const handleAction = async (action, item) => {
  if (action.key === 'delete') {
    if (confirm(t('admin.customers.confirmDelete', { code: item.customerCode }))) {
      try {
        await admin.remove('customers', item.id)
        alert(t('admin.customers.deleteSuccess'))
        fetchCustomers()
      } catch (e) {
        alert(t('admin.customers.deleteFailed', { error: e.message }))
      }
    }
  }
  else router.push(`/admin/customers/${item.id}`)
}

const mapCustomer = (c) => ({
  id: c.id,
  name: c.full_name || c.name,
  email: c.email,
  customerCode: `#CUS${c.id}`,
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.full_name || c.name)}&background=random`,
  country: c.country || t('admin.customers.defaultCountry'),
  countryCode: 'vn',
  orders: c.orders || 0,
  totalSpent: c.total_spent || 0,
})

const fetchCustomers = async () => {
  const res = await admin.fetchList('customers', {
    search: search.value,
    per_page: pageSize.value,
    page: page.value,
  })
  if (res?.data) {
    customers.value = res.data.map(mapCustomer)
  }
}

onMounted(() => {
  pagination.page = 1
  fetchCustomers()
})
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
