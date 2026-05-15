<template>
  <div class="orders-page">
    <!-- Payment Metric Strip -->
    <div class="metric-strip">
      <AdminMetricCard
        v-for="m in paymentMetrics"
        :key="m.label"
        :label="m.label"
        :value="String(m.value)"
        :meta="m.meta"
        :icon="m.icon"
        :variant="m.variant"
      />
    </div>

    <!-- Order Table (Desktop) -->
    <AdminDataTable
      v-if="!isMobile"
      :columns="columns"
      :items="orders"
      :selectable="true"
      :selected-keys="selectedIds"
      @update:selected-keys="selectedIds = $event"
      @row-click="viewOrder"
    >
      <template #toolbar>
        <AdminTableToolbar
          :search="search"
          :page-size="pageSize"
          search-placeholder="Search Order"
          @update:search="handleSearch"
          @update:page-size="changePageSize"
          @export="handleExport"
        />
      </template>

      <template #cell-orderCode="{ item }">
        <nuxt-link :to="`/admin/orders/${item.id}`" class="order-id-link" @click.stop>{{ item.orderCode }}</nuxt-link>
      </template>

      <template #cell-date="{ item }">
        <span class="date-text">{{ formatDate(item.date) }}</span>
      </template>

      <template #cell-customer="{ item }">
        <div class="customer-cell">
          <img :src="item.customer.avatar" :alt="item.customer.name" class="customer-avatar" />
          <div class="customer-info">
            <strong>{{ item.customer.name }}</strong>
            <small>{{ item.customer.email }}</small>
          </div>
        </div>
      </template>

      <template #cell-paymentStatus="{ item }">
        <AdminStatusBadge :label="paymentLabel(item.paymentStatus)" :variant="paymentVariant(item.paymentStatus)" />
      </template>

      <template #cell-fulfillmentStatus="{ item }">
        <AdminStatusBadge :label="fulfillmentLabel(item.fulfillmentStatus)" :variant="fulfillmentVariant(item.fulfillmentStatus)" dot />
      </template>

      <template #cell-paymentMethod="{ item }">
        <span class="method-text">{{ item.paymentLabel }}</span>
      </template>

      <template #actions="{ item }">
        <AdminActionMenu
          :items="[
            { key: 'view', label: 'View Details', icon: 'bi-eye' },
            { key: 'delete', label: 'Delete', icon: 'bi-trash', variant: 'danger' },
          ]"
          @select="handleAction($event, item)"
        />
      </template>

      <template #pagination>
        <AdminPagination
          :page="page"
          :page-size="pageSize"
          :total="totalOrders"
          @update:page="changePage"
        />
      </template>
    </AdminDataTable>

    <!-- Mobile Card List -->
    <div v-if="isMobile" class="admin-card-shell" style="padding:14px">
      <label style="display:block;position:relative;margin-bottom:12px">
        <i class="bi bi-search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--admin-muted)"></i>
        <input class="admin-control" v-model="search" placeholder="Search Order" style="padding-left:36px;width:100%" @input="resetPage">
      </label>
      <AdminMobileCard
        v-for="item in orders"
        :key="item.id"
        :title="item.orderCode"
        :subtitle="item.customer.name"
        :avatar="item.customer.avatar"
        :meta="[
          { label: 'Date', value: formatDate(item.date) },
          { label: 'Method', value: item.paymentLabel },
        ]"
        @click="viewOrder(item)"
      >
        <template #badge>
          <AdminStatusBadge :label="paymentLabel(item.paymentStatus)" :variant="paymentVariant(item.paymentStatus)" />
        </template>
        <template #actions>
          <AdminActionMenu
            :items="[
              { key: 'view', label: 'View Details', icon: 'bi-eye' },
              { key: 'delete', label: 'Delete', icon: 'bi-trash', variant: 'danger' },
            ]"
            @select="handleAction($event, item)"
          />
        </template>
      </AdminMobileCard>
      <div v-if="totalOrders > orders.length" style="text-align:center;padding:8px">
        <button v-if="page * pageSize < totalOrders" class="admin-secondary-button" @click="changePage(page + 1)">Load More</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHead, useRouter } from '#imports'
import { useAdminStore } from '@/stores/adminStore'
import { usePaginationStore } from '@/stores/paginationStore'
import AdminDataTable from '@/components/Admin/ui/AdminDataTable.vue'
import AdminTableToolbar from '@/components/Admin/ui/AdminTableToolbar.vue'
import AdminPagination from '@/components/Admin/ui/AdminPagination.vue'
import AdminMetricCard from '@/components/Admin/ui/AdminMetricCard.vue'
import AdminStatusBadge from '@/components/Admin/ui/AdminStatusBadge.vue'
import AdminActionMenu from '@/components/Admin/ui/AdminActionMenu.vue'
import AdminMobileCard from '@/components/Admin/ui/AdminMobileCard.vue'
import { useMediaQuery } from '@/composables/useMediaQuery'

const isMobile = useMediaQuery('(max-width: 767px)')

definePageMeta({ layout: 'admin' })
useHead({ title: 'Orders – IrusGear Admin' })

const router = useRouter()
const admin = useAdminStore()
const pagination = usePaginationStore()

/* ── state ── */
const search = ref('')
const searchTimeout = ref(null)
const page = computed(() => pagination.page)
const pageSize = computed(() => pagination.limit)
const totalOrders = computed(() => pagination.total)

const selectedIds = ref([])
const orders = ref([])
const stats = ref(null)

const handleSearch = (val) => {
  search.value = val
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    pagination.page = 1
    fetchOrders()
  }, 300)
}

const changePage = (p) => {
  pagination.page = p
  fetchOrders()
}

const changePageSize = (size) => {
  pagination.limit = size
  pagination.page = 1
  fetchOrders()
}

/* ── metrics ── */
const paymentMetrics = computed(() => {
  const s = stats.value?.by_payment_status || {}
  return [
    { label: 'Pending Payment', value: s.pending || 0, meta: 'orders', icon: 'bi-clock', variant: 'warning' },
    { label: 'Completed', value: s.paid || 0, meta: 'orders', icon: 'bi-check-circle', variant: 'success' },
    { label: 'Refunded', value: s.refunded || 0, meta: 'orders', icon: 'bi-arrow-counterclockwise', variant: 'info' },
    { label: 'Failed', value: s.failed || 0, meta: 'orders', icon: 'bi-x-circle', variant: 'danger' },
  ]
})

/* ── columns ── */
const columns = [
  { key: 'orderCode', label: 'Order', width: '100px' },
  { key: 'date', label: 'Date' },
  { key: 'customer', label: 'Customer', width: '22%' },
  { key: 'paymentStatus', label: 'Payment' },
  { key: 'fulfillmentStatus', label: 'Fulfillment' },
  { key: 'paymentMethod', label: 'Method' },
]

/* ── mapping ── */
const mapOrder = (o) => ({
  id: o.id,
  orderCode: o.order_number,
  date: o.created_at,
  customer: {
    name: o.customer?.name || 'Guest',
    email: o.customer?.email || o.guest_email || '',
    avatar: '', // fallback to initials or empty
  },
  paymentStatus: o.payment?.status || 'pending',
  fulfillmentStatus: o.status,
  paymentMethod: o.payment?.method || 'cod',
  paymentLabel: o.payment ? (o.payment.method === 'cod' ? 'Cash on Delivery' : o.payment.method) : 'N/A',
})

/* ── data fetching ── */
const fetchOrders = async () => {
  const res = await admin.fetchList('orders', {
    search: search.value,
  })
  if (res?.data) {
    orders.value = res.data.map(mapOrder)
  }
}

const fetchStats = async () => {
  const res = await admin.fetchOne('orders/stats')
  if (res?.data) {
    stats.value = res.data
  }
}

onMounted(() => {
  pagination.reset()
  fetchOrders()
  fetchStats()
})

/* ── helpers ── */
const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

const paymentLabel = (s) => ({ pending: 'Pending', paid: 'Paid', failed: 'Failed', cancelled: 'Cancelled', refunded: 'Refunded' }[s] || s)
const paymentVariant = (s) => ({ pending: 'warning', paid: 'success', failed: 'danger', cancelled: 'neutral', refunded: 'info' }[s] || 'neutral')

const fulfillmentLabel = (s) => ({
  ready_to_pickup: 'Ready to Pickup', out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered', dispatched: 'Dispatched', processing: 'Processing',
}[s] || s)
const fulfillmentVariant = (s) => ({
  ready_to_pickup: 'info', out_for_delivery: 'warning',
  delivered: 'success', dispatched: 'neutral', processing: 'neutral',
}[s] || 'neutral')

const viewOrder = (item) => router.push(`/admin/orders/${item.id}`)
const handleExport = () => alert('Export triggered (mock)')
const handleAction = (action, item) => {
  if (action.key === 'delete') alert(`Delete order ${item.orderCode} (mock)`)
  else router.push(`/admin/orders/${item.id}`)
}
</script>

<style scoped>
.orders-page { max-width: 1560px; }

.metric-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 20px;
}

.order-id-link { color: var(--admin-primary); font-weight: 700; text-decoration: none; }
.order-id-link:hover { text-decoration: underline; }

.date-text { color: var(--admin-muted); font-size: 0.88rem; white-space: nowrap; }

.customer-cell { display: flex; align-items: center; gap: 10px; }
.customer-avatar { width: 34px; height: 34px; border-radius: 999px; object-fit: cover; flex: 0 0 auto; }
.customer-info { min-width: 0; }
.customer-info strong { display: block; font-size: 0.88rem; color: var(--admin-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
.customer-info small { color: var(--admin-muted); font-size: 0.78rem; }

.method-text { font-size: 0.86rem; color: var(--admin-muted); white-space: nowrap; }

@media screen and (max-width: 1199.98px) { .metric-strip { grid-template-columns: repeat(2, 1fr); } }
@media screen and (max-width: 767.98px) { .metric-strip { grid-template-columns: 1fr; } }
</style>
