<template>
  <div class="referrals-page">
    <!-- Metric Strip -->
    <div class="metric-strip">
      <AdminMetricCard label="Total Referrals" :value="String(totalReferrals)" meta="all time" icon="bi-people" variant="neutral" />
      <AdminMetricCard label="Converted" :value="String(convertedCount)" meta="referrals" icon="bi-check-circle" variant="success" />
      <AdminMetricCard label="Active Links" :value="String(activeLinks)" meta="referrals" icon="bi-link-45deg" variant="info" />
      <AdminMetricCard label="Total Earned" :value="formatCompact(totalEarned)" meta="commission" icon="bi-cash-stack" variant="warning" />
    </div>

    <!-- Referrals Table (Desktop) -->
    <AdminDataTable
      v-if="!isMobile"
      :columns="columns"
      :items="referrals"
      :selectable="true"
      :selected-keys="selectedIds"
      @update:selected-keys="selectedIds = $event"
    >
      <template #toolbar>
        <AdminTableToolbar
          :search="search"
          :page-size="pageSize"
          search-placeholder="Search Referrals"
          @update:search="search = $event; resetPage()"
          @update:page-size="pageSize = $event; resetPage()"
          @export="handleExport"
        />
      </template>

      <template #cell-referrer="{ item }">
        <div class="referrer-cell">
          <img :src="item.referrerAvatar" :alt="item.referrerName" class="referrer-avatar" />
          <div class="referrer-info">
            <strong>{{ item.referrerName }}</strong>
            <small>{{ item.referrerEmail }}</small>
          </div>
        </div>
      </template>

      <template #cell-referred="{ item }">
        <span class="referred-name">{{ item.referredName }}</span>
      </template>

      <template #cell-code="{ item }">
        <code class="code-chip">{{ item.code }}</code>
      </template>

      <template #cell-earning="{ item }">
        <strong class="earning-text">{{ formatCurrency(item.earning) }}</strong>
      </template>

      <template #cell-status="{ item }">
        <AdminStatusBadge :label="statusLabel(item.status)" :variant="statusVariant(item.status)" dot />
      </template>

      <template #cell-createdAt="{ item }">
        <span class="date-text">{{ formatDate(item.createdAt) }}</span>
      </template>

      <template #actions="{ item }">
        <AdminActionMenu
          :items="[
            { key: 'view', label: 'View Details', icon: 'bi-eye' },
            { key: 'revoke', label: 'Revoke', icon: 'bi-x-circle', variant: 'danger' },
          ]"
          @select="handleAction($event, item)"
        />
      </template>

      <template #pagination>
        <AdminPagination :page="page" :page-size="pageSize" :total="paginationStore.total" @update:page="page = $event" />
      </template>
    </AdminDataTable>

    <!-- Mobile Card List -->
    <div v-if="isMobile" class="admin-card-shell" style="padding:14px">
      <label style="display:block;position:relative;margin-bottom:12px">
        <i class="bi bi-search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--admin-muted)"></i>
        <input class="admin-control" v-model="search" placeholder="Search Referrals" style="padding-left:36px;width:100%" @input="resetPage">
      </label>
      <AdminMobileCard
        v-for="item in referrals"
        :key="item.id"
        :title="item.referrerName"
        :subtitle="'→ ' + item.referredName"
        :avatar="item.referrerAvatar"
        :meta="[
          { label: 'Code', value: item.code },
          { label: 'Earning', value: formatCurrency(item.earning), class: 'earning-text' },
          { label: 'Date', value: formatDate(item.createdAt) },
        ]"
      >
        <template #badge>
          <AdminStatusBadge :label="statusLabel(item.status)" :variant="statusVariant(item.status)" dot />
        </template>
        <template #actions>
          <AdminActionMenu
            :items="[
              { key: 'view', label: 'View Details', icon: 'bi-eye' },
              { key: 'revoke', label: 'Revoke', icon: 'bi-x-circle', variant: 'danger' },
            ]"
            @select="handleAction($event, item)"
          />
        </template>
      </AdminMobileCard>
      <div v-if="paginationStore.total > page * pageSize" style="text-align:center;padding:8px">
        <button class="admin-secondary-button" @click="page++">Load More</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHead } from '#imports'
import AdminDataTable from '@/components/Admin/ui/AdminDataTable.vue'
import AdminTableToolbar from '@/components/Admin/ui/AdminTableToolbar.vue'
import AdminPagination from '@/components/Admin/ui/AdminPagination.vue'
import AdminMetricCard from '@/components/Admin/ui/AdminMetricCard.vue'
import AdminStatusBadge from '@/components/Admin/ui/AdminStatusBadge.vue'
import AdminActionMenu from '@/components/Admin/ui/AdminActionMenu.vue'
import AdminMobileCard from '@/components/Admin/ui/AdminMobileCard.vue'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { useAdminStore } from '@/stores/adminStore'
import { usePaginationStore } from '@/stores/paginationStore'
import { useI18n } from 'vue-i18n'

const isMobile = useMediaQuery('(max-width: 767px)')

definePageMeta({ layout: 'admin' })
useHead({ title: 'Referrals – IrusGear Admin' })

const adminStore = useAdminStore()
const paginationStore = usePaginationStore()
const { t } = useI18n()

const search = ref('')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref([])
const resetPage = () => { page.value = 1 }

const referrals = ref([])
const totalReferrals = ref(0)
const convertedCount = ref(0)
const activeLinks = ref(0)
const totalEarned = ref(0)

const columns = [
  { key: 'referrer', label: 'Referrer', width: '22%' },
  { key: 'referred', label: 'Referred User' },
  { key: 'code', label: 'Code' },
  { key: 'earning', label: 'Earning' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Date' },
]

const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
const formatCompact = (n) => { if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M ₫'; return (n / 1e3).toFixed(0) + 'K ₫' }
const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

const statusLabel = (s) => t(`admin.status.${s}`) || s
const statusVariant = (s) => ({ active: 'info', converted: 'success', completed: 'success', expired: 'neutral', pending: 'warning', cancelled: 'danger' }[s] || 'neutral')

const fetchReferrals = async () => {
  const res = await adminStore.fetchList('referrals', {
    page: page.value,
    per_page: pageSize.value,
    search: search.value
  })
  
  if (res && res.data) {
    referrals.value = res.data.map(r => {
      const referrerName = r.referrer?.name || 'Unknown'
      const referredName = r.referred?.name || 'Unknown'
      return {
        id: r.id,
        referrerName,
        referrerEmail: r.referrer?.email || '',
        referrerAvatar: r.referrer?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(referrerName)}&background=random`,
        referredName,
        code: r.referral_code || '',
        earning: Number(r.commission_amount || 0),
        status: r.status,
        createdAt: r.created_at,
      }
    })
  }
}

const fetchStats = async () => {
  const res = await adminStore.fetchOne('referrals/stats')
  if (res && res.data) {
    totalReferrals.value = res.data.referrals?.total || 0
    convertedCount.value = res.data.referrals?.completed || 0
    activeLinks.value = res.data.codes?.active || 0
    totalEarned.value = Number(res.data.commission?.total || 0)
  }
}

onMounted(() => {
  fetchReferrals()
  fetchStats()
})

watch([page, pageSize, search], () => {
  fetchReferrals()
})

const handleAction = async (action, item) => {
  if (action.key === 'revoke') {
    if (confirm('Are you sure you want to revoke this referral?')) {
      const res = await adminStore.patch(`referrals/${item.id}/status`, { status: 'cancelled' })
      if (res) {
        fetchReferrals()
        fetchStats()
      }
    }
  } else {
    alert(`${action.label} referral #${item.id}`)
  }
}

const handleExport = () => alert('Export referrals (mock)')
</script>

<style scoped>
.referrals-page { max-width: 1560px; }
.metric-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 20px; }

.referrer-cell { display: flex; align-items: center; gap: 10px; }
.referrer-avatar { width: 34px; height: 34px; border-radius: 999px; object-fit: cover; flex: 0 0 auto; }
.referrer-info { min-width: 0; }
.referrer-info strong { display: block; font-size: 0.88rem; color: var(--admin-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
.referrer-info small { color: var(--admin-muted); font-size: 0.78rem; }
.referred-name { font-size: 0.88rem; color: var(--admin-text); }
.code-chip { padding: 3px 8px; background: var(--admin-surface-soft); border-radius: 5px; font-size: 0.84rem; color: var(--admin-text); white-space: nowrap; }
.earning-text { color: var(--admin-success); font-size: 0.9rem; }
.date-text { font-size: 0.86rem; color: var(--admin-muted); white-space: nowrap; }

@media screen and (max-width: 1199.98px) { .metric-strip { grid-template-columns: repeat(2, 1fr); } }
@media screen and (max-width: 767.98px) { .metric-strip { grid-template-columns: 1fr; } }
</style>
