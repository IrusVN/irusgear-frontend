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
      :items="paginatedOrders"
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
          @update:search="search = $event; resetPage()"
          @update:page-size="pageSize = $event; resetPage()"
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
          :total="filteredOrders.length"
          @update:page="page = $event"
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
        v-for="item in paginatedOrders"
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
      <div v-if="filteredOrders.length > pageSize" style="text-align:center;padding:8px">
        <button v-if="page * pageSize < filteredOrders.length" class="admin-secondary-button" @click="page++">Load More</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHead, useRouter } from '#imports'
import { adminOrdersMock } from '~/mocks/admin/orders.mock'
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

/* ── state ── */
const search = ref('')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref([])

const resetPage = () => { page.value = 1 }

/* ── metrics ── */
const allOrders = adminOrdersMock
const paymentMetrics = computed(() => [
  { label: 'Pending Payment', value: allOrders.filter(o => o.paymentStatus === 'pending').length, meta: 'orders', icon: 'bi-clock', variant: 'warning' },
  { label: 'Completed', value: allOrders.filter(o => o.paymentStatus === 'paid').length, meta: 'orders', icon: 'bi-check-circle', variant: 'success' },
  { label: 'Refunded', value: allOrders.filter(o => o.paymentStatus === 'refunded').length, meta: 'orders', icon: 'bi-arrow-counterclockwise', variant: 'info' },
  { label: 'Failed', value: allOrders.filter(o => o.paymentStatus === 'failed').length, meta: 'orders', icon: 'bi-x-circle', variant: 'danger' },
])

/* ── columns ── */
const columns = [
  { key: 'orderCode', label: 'Order', width: '100px' },
  { key: 'date', label: 'Date' },
  { key: 'customer', label: 'Customer', width: '22%' },
  { key: 'paymentStatus', label: 'Payment' },
  { key: 'fulfillmentStatus', label: 'Fulfillment' },
  { key: 'paymentMethod', label: 'Method' },
]

/* ── filtering ── */
const filteredOrders = computed(() => {
  if (!search.value) return allOrders
  const q = search.value.toLowerCase()
  return allOrders.filter(o =>
    o.orderCode.toLowerCase().includes(q) ||
    o.customer.name.toLowerCase().includes(q) ||
    o.customer.email.toLowerCase().includes(q)
  )
})

const paginatedOrders = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredOrders.value.slice(start, start + pageSize.value)
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
