<template>
  <div class="reviews-page">
    <!-- Metric Strip -->
    <div class="metric-strip">
      <AdminMetricCard
        v-for="m in reviewMetrics"
        :key="m.label"
        :label="m.label"
        :value="String(m.value)"
        :meta="m.meta"
        :icon="m.icon"
        :variant="m.variant"
      />
    </div>

    <!-- Reviews Table (Desktop) -->
    <AdminDataTable
      v-if="!isMobile"
      :columns="columns"
      :items="paginatedReviews"
      :selectable="true"
      :selected-keys="selectedIds"
      @update:selected-keys="selectedIds = $event"
    >
      <template #toolbar>
        <AdminTableToolbar
          :search="search"
          :page-size="pageSize"
          search-placeholder="Search Reviews"
          @update:search="search = $event; resetPage()"
          @update:page-size="pageSize = $event; resetPage()"
          @export="handleExport"
        />
      </template>

      <template #cell-productName="{ item }">
        <strong class="product-name">{{ item.productName }}</strong>
      </template>

      <template #cell-customerName="{ item }">
        <span class="customer-name">{{ item.customerName }}</span>
      </template>

      <template #cell-rating="{ item }">
        <div class="stars-cell">
          <i v-for="s in 5" :key="s" class="bi" :class="s <= item.rating ? 'bi-star-fill star-filled' : 'bi-star star-empty'"></i>
          <span class="rating-num">{{ item.rating }}.0</span>
        </div>
      </template>

      <template #cell-title="{ item }">
        <span class="review-title">{{ item.title }}</span>
      </template>

      <template #cell-status="{ item }">
        <AdminStatusBadge :label="statusLabel(item.status)" :variant="statusVariant(item.status)" />
      </template>

      <template #cell-createdAt="{ item }">
        <span class="date-text">{{ formatDate(item.createdAt) }}</span>
      </template>

      <template #actions="{ item }">
        <AdminActionMenu
          :items="actionItems(item)"
          @select="handleAction($event, item)"
        />
      </template>

      <template #pagination>
        <AdminPagination :page="page" :page-size="pageSize" :total="filteredReviews.length" @update:page="page = $event" />
      </template>
    </AdminDataTable>

    <!-- Mobile Card List -->
    <div v-if="isMobile" class="admin-card-shell" style="padding:14px">
      <label style="display:block;position:relative;margin-bottom:12px">
        <i class="bi bi-search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--admin-muted)"></i>
        <input class="admin-control" v-model="search" placeholder="Search Reviews" style="padding-left:36px;width:100%" @input="resetPage">
      </label>
      <AdminMobileCard
        v-for="item in paginatedReviews"
        :key="item.id"
        :title="item.productName"
        :subtitle="item.customerName"
        icon="bi-chat-square-text"
        :meta="[
          { label: 'Rating', value: '⭐'.repeat(item.rating) + ' ' + item.rating + '.0' },
          { label: 'Date', value: formatDate(item.createdAt) },
        ]"
      >
        <template #badge>
          <AdminStatusBadge :label="statusLabel(item.status)" :variant="statusVariant(item.status)" />
        </template>
        <template #actions>
          <AdminActionMenu
            :items="actionItems(item)"
            @select="handleAction($event, item)"
          />
        </template>
      </AdminMobileCard>
      <div v-if="filteredReviews.length > pageSize" style="text-align:center;padding:8px">
        <button v-if="page * pageSize < filteredReviews.length" class="admin-secondary-button" @click="page++">Load More</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHead } from '#imports'
import { adminReviewsMock } from '~/mocks/admin/reviews.mock'
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
useHead({ title: 'Manage Reviews – IrusGear Admin' })

const search = ref('')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref([])
const resetPage = () => { page.value = 1 }

const allReviews = adminReviewsMock

const reviewMetrics = computed(() => [
  { label: 'Total Reviews', value: allReviews.length, meta: 'all time', icon: 'bi-chat-square-text', variant: 'neutral' },
  { label: 'Published', value: allReviews.filter(r => r.status === 'published').length, meta: 'reviews', icon: 'bi-check-circle', variant: 'success' },
  { label: 'Pending', value: allReviews.filter(r => r.status === 'pending').length, meta: 'reviews', icon: 'bi-clock', variant: 'warning' },
  { label: 'Avg Rating', value: (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1), meta: 'out of 5', icon: 'bi-star-fill', variant: 'info' },
])

const columns = [
  { key: 'productName', label: 'Product', width: '20%' },
  { key: 'customerName', label: 'Customer' },
  { key: 'rating', label: 'Rating' },
  { key: 'title', label: 'Review' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Date' },
]

const filteredReviews = computed(() => {
  if (!search.value) return allReviews
  const q = search.value.toLowerCase()
  return allReviews.filter(r => r.productName.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q) || r.title.toLowerCase().includes(q))
})

const paginatedReviews = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredReviews.value.slice(start, start + pageSize.value)
})

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
const statusLabel = (s) => ({ published: 'Published', pending: 'Pending', rejected: 'Rejected' }[s] || s)
const statusVariant = (s) => ({ published: 'success', pending: 'warning', rejected: 'danger' }[s] || 'neutral')

const actionItems = (item) => {
  const items = [{ key: 'view', label: 'View Details', icon: 'bi-eye' }]
  if (item.status === 'pending') items.push({ key: 'approve', label: 'Approve', icon: 'bi-check-lg' })
  if (item.status !== 'rejected') items.push({ key: 'reject', label: 'Reject', icon: 'bi-x-lg', variant: 'danger' })
  items.push({ key: 'delete', label: 'Delete', icon: 'bi-trash', variant: 'danger' })
  return items
}
const handleAction = (action, item) => alert(`${action.label} review #${item.id} (mock)`)
const handleExport = () => alert('Export reviews (mock)')
</script>

<style scoped>
.reviews-page { max-width: 1560px; }
.metric-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 20px; }

.product-name { font-size: 0.9rem; color: var(--admin-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; max-width: 200px; }
.customer-name { font-size: 0.88rem; color: var(--admin-muted); }
.review-title { font-size: 0.88rem; color: var(--admin-text); }
.date-text { font-size: 0.86rem; color: var(--admin-muted); white-space: nowrap; }

.stars-cell { display: flex; align-items: center; gap: 2px; }
.star-filled { color: #f5a623; font-size: 0.82rem; }
.star-empty { color: #d5d5da; font-size: 0.82rem; }
.rating-num { margin-left: 6px; font-size: 0.82rem; font-weight: 700; color: var(--admin-text); }

@media screen and (max-width: 1199.98px) { .metric-strip { grid-template-columns: repeat(2, 1fr); } }
@media screen and (max-width: 767.98px) { .metric-strip { grid-template-columns: 1fr; } }
</style>
