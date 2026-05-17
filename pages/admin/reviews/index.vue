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
          :search-placeholder="$t('admin.reviews.searchReviews')"
          @update:search="handleSearch"
          @update:page-size="changePageSize"
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
        <AdminPagination :page="page" :page-size="pageSize" :total="totalReviews" @update:page="changePage" />
      </template>
    </AdminDataTable>

    <!-- Mobile Card List -->
    <div v-if="isMobile" class="admin-card-shell" style="padding:14px">
      <label style="display:block;position:relative;margin-bottom:12px">
        <i class="bi bi-search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--admin-muted)"></i>
        <input class="admin-control" :value="search" :placeholder="$t('admin.reviews.searchReviews')" style="padding-left:36px;width:100%" @input="handleSearch($event.target.value)">
      </label>
      <AdminMobileCard
        v-for="item in paginatedReviews"
        :key="item.id"
        :title="item.productName"
        :subtitle="item.customerName"
        icon="bi-chat-square-text"
        :meta="[
          { label: $t('admin.reviews.ratingLabel'), value: '⭐'.repeat(item.rating) + ' ' + item.rating + '.0' },
          { label: $t('admin.reviews.date'), value: formatDate(item.createdAt) },
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
      <div v-if="totalReviews > reviews.length" style="text-align:center;padding:8px">
        <button v-if="page * pageSize < totalReviews" class="admin-secondary-button" @click="changePage(page + 1)">{{ $t('admin.reviews.loadMore') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead, useI18n } from '#imports'
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

const { t } = useI18n()
const isMobile = useMediaQuery('(max-width: 767px)')

definePageMeta({ layout: 'admin' })
useHead({ title: () => t('admin.reviews.pageTitle') })

const admin = useAdminStore()
const pagination = usePaginationStore()

const search = ref('')
const searchTimeout = ref(null)
const page = computed(() => pagination.page)
const pageSize = computed(() => pagination.limit)
const totalReviews = computed(() => pagination.total)

const selectedIds = ref([])
const reviews = ref([])
const stats = ref(null)

const handleSearch = (val) => {
  search.value = val
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    pagination.page = 1
    fetchReviews()
  }, 300)
}

const changePage = (p) => {
  pagination.page = p
  fetchReviews()
}

const changePageSize = (size) => {
  pagination.limit = size
  pagination.page = 1
  fetchReviews()
}

const reviewMetrics = computed(() => {
  const s = stats.value || {}
  return [
    { label: t('admin.reviews.totalReviews'), value: s.total_reviews || 0, meta: t('admin.reviews.allTime'), icon: 'bi-chat-square-text', variant: 'neutral' },
    { label: t('admin.reviews.published'), value: s.approved_reviews || 0, meta: t('admin.reviews.reviewsMeta'), icon: 'bi-check-circle', variant: 'success' },
    { label: t('admin.reviews.pending'), value: s.pending_reviews || 0, meta: t('admin.reviews.reviewsMeta'), icon: 'bi-clock', variant: 'warning' },
    { label: t('admin.reviews.avgRating'), value: Number(s.average_rating || 0).toFixed(1), meta: t('admin.reviews.outOf5'), icon: 'bi-star-fill', variant: 'info' },
  ]
})

const columns = computed(() => [
  { key: 'productName', label: t('admin.reviews.product'), width: '20%' },
  { key: 'customerName', label: t('admin.reviews.customer') },
  { key: 'rating', label: t('admin.reviews.rating') },
  { key: 'title', label: t('admin.reviews.review') },
  { key: 'status', label: t('admin.reviews.status') },
  { key: 'createdAt', label: t('admin.reviews.date') },
])

const paginatedReviews = computed(() => reviews.value)

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
const statusLabel = (s) => ({
  approved: t('admin.reviews.published'),
  published: t('admin.reviews.published'),
  pending: t('admin.reviews.pending'),
  rejected: t('admin.reviews.rejected'),
}[s] || s)
const statusVariant = (s) => ({ approved: 'success', published: 'success', pending: 'warning', rejected: 'danger' }[s] || 'neutral')

const actionItems = (item) => {
  const items = [{ key: 'view', label: t('admin.reviews.viewDetails'), icon: 'bi-eye' }]
  if (item.status === 'pending') items.push({ key: 'approve', label: t('admin.reviews.approve'), icon: 'bi-check-lg' })
  if (item.status !== 'rejected') items.push({ key: 'reject', label: t('admin.reviews.reject'), icon: 'bi-x-lg', variant: 'danger' })
  return items
}

const handleAction = async (action, item) => {
  try {
    if (action.key === 'approve') {
      await admin.patch('reviews', item.id + '/status', { status: 'approved' })
      alert(t('admin.reviews.approvedMock'))
      fetchReviews()
      fetchStats()
    } else if (action.key === 'reject') {
      await admin.patch('reviews', item.id + '/status', { status: 'rejected' })
      alert(t('admin.reviews.rejectedMock'))
      fetchReviews()
      fetchStats()
    } else {
      alert(t('admin.reviews.actionMock', { label: action.label, id: item.id }))
    }
  } catch (e) {
    alert(t('admin.reviews.actionFailed', { error: e.message }))
  }
}

const handleExport = () => alert(t('admin.reviews.exportMock'))

const mapReview = (r) => ({
  id: r.id,
  productName: r.product?.name || t('admin.reviews.unknownProduct'),
  customerName: r.author?.name || t('admin.reviews.anonymous'),
  rating: r.rating || 0,
  title: r.content?.substring(0, 50) + (r.content?.length > 50 ? '...' : '') || t('admin.reviews.noContent'),
  status: r.status,
  createdAt: r.createdAt || r.created_at,
})

const fetchReviews = async () => {
  const res = await admin.fetchList('reviews', {
    search: search.value,
    per_page: pageSize.value,
    page: page.value,
  })
  if (res?.data) {
    reviews.value = res.data.map(mapReview)
  }
}

const fetchStats = async () => {
  const res = await admin.fetchOne('reviews/stats')
  if (res?.data) {
    stats.value = res.data
  }
}

onMounted(() => {
  pagination.page = 1
  fetchReviews()
  fetchStats()
})
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
