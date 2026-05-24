<template>
  <div class="reviews-page">
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
        >
          <template #filters>
            <select v-model="statusFilter" class="review-filter" @change="applyFilters">
              <option value="">{{ $t('admin.reviews.allStatuses') }}</option>
              <option value="approved">{{ $t('admin.reviews.published') }}</option>
              <option value="pending">{{ $t('admin.reviews.pending') }}</option>
              <option value="rejected">{{ $t('admin.reviews.rejected') }}</option>
            </select>
            <select v-model="ratingFilter" class="review-filter" @change="applyFilters">
              <option value="">{{ $t('admin.reviews.allRatings') }}</option>
              <option v-for="rating in ratingOptions" :key="rating" :value="rating">
                {{ rating }} {{ $t('product.star') }}
              </option>
            </select>
            <label class="reported-filter">
              <input v-model="reportedOnly" type="checkbox" @change="applyFilters">
              <span>{{ $t('admin.reviews.reportedOnly') }}</span>
            </label>
          </template>
        </AdminTableToolbar>
      </template>

      <template #cell-productName="{ item }">
        <strong class="product-name">{{ item.productName }}</strong>
      </template>

      <template #cell-customerName="{ item }">
        <span class="customer-name">{{ item.customerName }}</span>
      </template>

      <template #cell-rating="{ item }">
        <div class="stars-cell">
          <i
            v-for="s in 5"
            :key="s"
            class="bi"
            :class="s <= item.rating ? 'bi-star-fill star-filled' : 'bi-star star-empty'"
          />
          <span class="rating-num">{{ item.rating }}.0</span>
        </div>
      </template>

      <template #cell-title="{ item }">
        <div class="review-title-wrap">
          <span class="review-title">{{ item.title }}</span>
          <span v-if="item.reportCount" class="report-pill">
            {{ item.reportCount }} {{ $t('admin.reviews.reports') }}
          </span>
        </div>
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

    <div v-if="isMobile" class="admin-card-shell mobile-review-list">
      <label class="mobile-search">
        <i class="bi bi-search" />
        <input class="admin-control" :value="search" :placeholder="$t('admin.reviews.searchReviews')" @input="handleSearch($event.target.value)">
      </label>
      <div class="mobile-filters">
        <select v-model="statusFilter" class="review-filter" @change="applyFilters">
          <option value="">{{ $t('admin.reviews.allStatuses') }}</option>
          <option value="approved">{{ $t('admin.reviews.published') }}</option>
          <option value="pending">{{ $t('admin.reviews.pending') }}</option>
          <option value="rejected">{{ $t('admin.reviews.rejected') }}</option>
        </select>
        <select v-model="ratingFilter" class="review-filter" @change="applyFilters">
          <option value="">{{ $t('admin.reviews.allRatings') }}</option>
          <option v-for="rating in ratingOptions" :key="rating" :value="rating">
            {{ rating }} {{ $t('product.star') }}
          </option>
        </select>
        <label class="reported-filter">
          <input v-model="reportedOnly" type="checkbox" @change="applyFilters">
          <span>{{ $t('admin.reviews.reportedOnly') }}</span>
        </label>
      </div>
      <AdminMobileCard
        v-for="item in paginatedReviews"
        :key="item.id"
        :title="item.productName"
        :subtitle="item.customerName"
        icon="bi-chat-square-text"
        :meta="[
          { label: $t('admin.reviews.ratingLabel'), value: `${item.rating}.0/5` },
          { label: $t('admin.reviews.reports'), value: String(item.reportCount || 0) },
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
    </div>

    <section v-if="selectedReview" class="review-detail admin-card-shell">
      <div class="review-detail__head">
        <div>
          <h2>{{ $t('admin.reviews.detailTitle') }}</h2>
          <p>{{ selectedReview.productName }} · {{ selectedReview.customerName }}</p>
        </div>
        <button type="button" class="admin-secondary-button" @click="selectedReview = null">
          {{ $t('common.close') }}
        </button>
      </div>
      <div class="review-detail__grid">
        <div>
          <div class="detail-label">{{ $t('admin.reviews.rating') }}</div>
          <div class="stars-cell">
            <i
              v-for="s in 5"
              :key="s"
              class="bi"
              :class="s <= selectedReview.rating ? 'bi-star-fill star-filled' : 'bi-star star-empty'"
            />
            <span class="rating-num">{{ selectedReview.rating }}.0</span>
          </div>
        </div>
        <div>
          <div class="detail-label">{{ $t('admin.reviews.status') }}</div>
          <AdminStatusBadge :label="statusLabel(selectedReview.status)" :variant="statusVariant(selectedReview.status)" />
        </div>
        <div>
          <div class="detail-label">{{ $t('admin.reviews.helpfulCount') }}</div>
          <strong>{{ selectedReview.helpfulCount }}</strong>
        </div>
        <div>
          <div class="detail-label">{{ $t('admin.reviews.reports') }}</div>
          <strong>{{ selectedReview.reportCount }}</strong>
        </div>
        <div>
          <div class="detail-label">{{ $t('admin.reviews.verifiedPurchase') }}</div>
          <strong>{{ selectedReview.verifiedPurchase ? $t('admin.reviews.yes') : $t('admin.reviews.no') }}</strong>
        </div>
      </div>
      <div class="review-detail__content">{{ selectedReview.content || $t('admin.reviews.noContent') }}</div>
      <div v-if="selectedReview.rejectedReason" class="review-rejected-reason">
        <strong>{{ $t('admin.reviews.rejectReason') }}:</strong>
        <span>{{ selectedReview.rejectedReason }}</span>
      </div>
      <div class="report-list">
        <h3>{{ $t('admin.reviews.reportDetails') }}</h3>
        <div v-if="!selectedReview.reports.length" class="report-empty">
          {{ $t('admin.reviews.noReports') }}
        </div>
        <div v-for="report in selectedReview.reports" :key="report.id" class="report-item">
          <div>
            <strong>{{ reportReasonLabel(report.reason) }}</strong>
            <p v-if="report.content">{{ report.content }}</p>
          </div>
          <span>{{ formatDate(report.createdAt) }}</span>
        </div>
      </div>
    </section>

    <section v-if="rejectTarget" class="review-detail admin-card-shell">
      <div class="review-detail__head">
        <div>
          <h2>{{ $t('admin.reviews.rejectReview') }}</h2>
          <p>{{ rejectTarget.productName }} · {{ rejectTarget.customerName }}</p>
        </div>
        <button type="button" class="admin-secondary-button" @click="cancelReject">
          {{ $t('admin.reviews.cancel') }}
        </button>
      </div>
      <textarea
        v-model="rejectReason"
        class="reject-reason-input"
        rows="4"
        :placeholder="$t('admin.reviews.rejectReasonPlaceholder')"
      />
      <div class="reject-actions">
        <button type="button" class="admin-secondary-button" @click="cancelReject">
          {{ $t('admin.reviews.cancel') }}
        </button>
        <button type="button" class="admin-danger-button" :disabled="!rejectReason.trim()" @click="submitReject">
          {{ $t('admin.reviews.reject') }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
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
import { toast } from 'vue-sonner'
import { exportToCsv } from '@/utils/exportCsv'
import { useStatusFormat } from '@/composables/useStatusFormat'

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
const ratingOptions = [5, 4, 3, 2, 1]

const selectedIds = ref([])
const reviews = ref([])
const stats = ref(null)
const statusFilter = ref('')
const ratingFilter = ref('')
const reportedOnly = ref(false)
const selectedReview = ref(null)
const rejectTarget = ref(null)
const rejectReason = ref('')

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

const applyFilters = () => {
  pagination.page = 1
  fetchReviews()
}

const reviewMetrics = computed(() => {
  const s = stats.value || {}
  return [
    { label: t('admin.reviews.totalReviews'), value: s.total_reviews || 0, meta: t('admin.reviews.allTime'), icon: 'bi-chat-square-text', variant: 'neutral' },
    { label: t('admin.reviews.published'), value: s.approved_reviews || 0, meta: t('admin.reviews.reviewsMeta'), icon: 'bi-check-circle', variant: 'success' },
    { label: t('admin.reviews.reported'), value: s.reported_reviews || 0, meta: t('admin.reviews.reviewsMeta'), icon: 'bi-flag', variant: 'danger' },
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

const formatDate = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
const { formatReviewStatus } = useStatusFormat()
const statusLabel = (status) => formatReviewStatus(status).label
const statusVariant = (status) => formatReviewStatus(status).variant

const actionItems = (item) => {
  const items = [{ key: 'view', label: t('admin.reviews.viewDetails'), icon: 'bi-eye' }]
  if (item.status !== 'approved') items.push({ key: 'approve', label: t('admin.reviews.approve'), icon: 'bi-check-lg' })
  if (item.status !== 'rejected') items.push({ key: 'reject', label: t('admin.reviews.reject'), icon: 'bi-x-lg', variant: 'danger' })
  return items
}

const handleAction = async (action, item) => {
  try {
    if (action.key === 'approve') {
      await admin.patch('reviews', `${item.id}/status`, { status: 'approved' })
      toast.success(t('admin.reviews.approveSuccess'))
      fetchReviews()
      fetchStats()
      return
    }

    if (action.key === 'reject') {
      rejectTarget.value = item
      rejectReason.value = item.rejectedReason || ''
      return
    }

    await openReviewDetails(item.id)
  } catch (e) {
    toast.error(t('admin.reviews.actionFailed', { error: e.message }))
  }
}

const openReviewDetails = async (id) => {
  const res = await admin.fetchOne(`reviews/${id}`)
  if (res?.data) {
    selectedReview.value = mapReview(res.data)
  }
}

const cancelReject = () => {
  rejectTarget.value = null
  rejectReason.value = ''
}

const submitReject = async () => {
  if (!rejectTarget.value || !rejectReason.value.trim()) return

  try {
    await admin.patch('reviews', `${rejectTarget.value.id}/status`, {
      status: 'rejected',
      rejected_reason: rejectReason.value.trim(),
    })
    toast.success(t('admin.reviews.rejectSuccess'))
    cancelReject()
    fetchReviews()
    fetchStats()
  } catch (e) {
    toast.error(t('admin.reviews.actionFailed', { error: e.message }))
  }
}

const handleExport = () => {
  if (!reviews.value.length) {
    toast.warning(t('admin.reviews.noDataToExport'))
    return
  }
  exportToCsv({
    filename: 'reviews',
    items: reviews.value,
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'productName', label: t('admin.reviews.product') },
      { key: 'customerName', label: t('admin.reviews.customer') },
      { key: 'rating', label: t('admin.reviews.rating') },
      { key: 'title', label: t('admin.reviews.review') },
      { key: 'status', label: t('admin.reviews.status') },
      { key: 'reportCount', label: t('admin.reviews.reports') },
      { key: 'verifiedPurchaseLabel', label: t('admin.reviews.verifiedPurchase') },
      { key: 'createdAt', label: t('admin.reviews.date') },
    ],
  })
  toast.success(t('admin.reviews.exportSuccess', { count: reviews.value.length }))
}

const mapReview = (review) => ({
  id: review.id,
  productName: review.product?.name || t('admin.reviews.unknownProduct'),
  customerName: review.author?.name || t('admin.reviews.anonymous'),
  rating: review.rating || 0,
  content: review.content || '',
  title: review.content?.substring(0, 50) + (review.content?.length > 50 ? '...' : '') || t('admin.reviews.noContent'),
  status: review.status,
  helpfulCount: review.helpfulCount || 0,
  reportCount: review.reportCount || 0,
  verifiedPurchase: Boolean(review.verifiedPurchase),
  verifiedPurchaseLabel: review.verifiedPurchase ? t('admin.reviews.yes') : t('admin.reviews.no'),
  reports: Array.isArray(review.reports) ? review.reports : [],
  rejectedReason: review.rejectedReason || '',
  createdAt: review.createdAt || review.created_at,
})

const reportReasonLabel = (reason) => ({
  spam: t('product.reportSpam'),
  irrelevant: t('product.reportIrrelevant'),
  offensive: t('product.reportOffensive'),
  personal_info: t('product.reportPersonalInfo'),
  other: t('product.reportOther'),
}[reason] || reason)

const fetchReviews = async () => {
  const res = await admin.fetchList('reviews', {
    search: search.value,
    per_page: pageSize.value,
    page: page.value,
    status: statusFilter.value,
    rating: ratingFilter.value,
    reported: reportedOnly.value ? 1 : '',
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
.review-title-wrap { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.review-title { font-size: 0.88rem; color: var(--admin-text); }
.date-text { font-size: 0.86rem; color: var(--admin-muted); white-space: nowrap; }

.stars-cell { display: flex; align-items: center; gap: 2px; }
.star-filled { color: #f5a623; font-size: 0.82rem; }
.star-empty { color: #d5d5da; font-size: 0.82rem; }
.rating-num { margin-left: 6px; font-size: 0.82rem; font-weight: 700; color: var(--admin-text); }

.review-filter {
  background: #fff;
  border: 1px solid var(--admin-border);
  border-radius: 7px;
  color: var(--admin-text);
  height: 40px;
  min-width: 150px;
  padding: 0 12px;
}

.reported-filter {
  align-items: center;
  background: #fff;
  border: 1px solid var(--admin-border);
  border-radius: 7px;
  color: var(--admin-text);
  display: inline-flex;
  font-size: 0.88rem;
  gap: 8px;
  height: 40px;
  margin: 0;
  padding: 0 12px;
}

.report-pill {
  align-self: flex-start;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 999px;
  color: #be123c;
  font-size: 0.76rem;
  font-weight: 800;
  padding: 3px 8px;
}

.mobile-review-list {
  display: grid;
  gap: 12px;
  padding: 14px;
}

.mobile-search {
  display: block;
  margin-bottom: 0;
  position: relative;
}

.mobile-search i {
  color: var(--admin-muted);
  left: 12px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.mobile-search input {
  padding-left: 36px;
  width: 100%;
}

.mobile-filters {
  display: grid;
  gap: 10px;
}

.review-detail {
  margin-top: 18px;
  padding: 20px;
}

.review-detail__head {
  align-items: flex-start;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 16px;
}

.review-detail__head h2 {
  color: var(--admin-text);
  font-size: 1.05rem;
  margin: 0 0 4px;
}

.review-detail__head p {
  color: var(--admin-muted);
  margin: 0;
}

.review-detail__grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-bottom: 16px;
}

.detail-label {
  color: var(--admin-muted);
  font-size: 0.78rem;
  font-weight: 800;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.review-detail__content,
.review-rejected-reason,
.report-item,
.report-empty {
  background: #fafafa;
  border: 1px solid var(--admin-border);
  border-radius: 8px;
  color: var(--admin-text);
  line-height: 1.55;
  padding: 14px;
}

.review-rejected-reason {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.report-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.report-list h3 {
  color: var(--admin-text);
  font-size: 0.95rem;
  margin: 0;
}

.report-item {
  align-items: flex-start;
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.report-item p {
  color: var(--admin-muted);
  margin: 6px 0 0;
}

.report-item > span {
  color: var(--admin-muted);
  flex: 0 0 auto;
  font-size: 0.82rem;
}

.reject-reason-input {
  border: 1px solid var(--admin-border);
  border-radius: 8px;
  color: var(--admin-text);
  min-height: 110px;
  padding: 12px;
  resize: vertical;
  width: 100%;
}

.reject-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 12px;
}

.admin-danger-button {
  background: #dc2626;
  border: 0;
  border-radius: 7px;
  color: #fff;
  font-weight: 800;
  height: 40px;
  padding: 0 15px;
}

.admin-danger-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

@media screen and (max-width: 1199.98px) {
  .metric-strip { grid-template-columns: repeat(2, 1fr); }
  .review-detail__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media screen and (max-width: 767.98px) {
  .metric-strip,
  .review-detail__grid { grid-template-columns: 1fr; }
  .review-detail__head,
  .report-item,
  .reject-actions { flex-direction: column; }
}
</style>
