<template>
  <div class="referrals-page">
    <!-- Metric Strip -->
    <div class="metric-strip">
      <AdminMetricCard label="Total Referrals" :value="String(allReferrals.length)" meta="all time" icon="bi-people" variant="neutral" />
      <AdminMetricCard label="Converted" :value="String(allReferrals.filter(r => r.status === 'converted').length)" meta="referrals" icon="bi-check-circle" variant="success" />
      <AdminMetricCard label="Active Links" :value="String(allReferrals.filter(r => r.status === 'active').length)" meta="referrals" icon="bi-link-45deg" variant="info" />
      <AdminMetricCard label="Total Earned" :value="formatCompact(totalEarned)" meta="commission" icon="bi-cash-stack" variant="warning" />
    </div>

    <!-- Referrals Table (Desktop) -->
    <AdminDataTable
      v-if="!isMobile"
      :columns="columns"
      :items="paginatedReferrals"
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
        <AdminPagination :page="page" :page-size="pageSize" :total="filteredReferrals.length" @update:page="page = $event" />
      </template>
    </AdminDataTable>

    <!-- Mobile Card List -->
    <div v-if="isMobile" class="admin-card-shell" style="padding:14px">
      <label style="display:block;position:relative;margin-bottom:12px">
        <i class="bi bi-search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--admin-muted)"></i>
        <input class="admin-control" v-model="search" placeholder="Search Referrals" style="padding-left:36px;width:100%" @input="resetPage">
      </label>
      <AdminMobileCard
        v-for="item in paginatedReferrals"
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
      <div v-if="filteredReferrals.length > pageSize" style="text-align:center;padding:8px">
        <button v-if="page * pageSize < filteredReferrals.length" class="admin-secondary-button" @click="page++">Load More</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHead } from '#imports'
import { adminCustomersMock } from '~/mocks/admin/customers.mock'
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
useHead({ title: 'Referrals – IrusGear Admin' })

const search = ref('')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref([])
const resetPage = () => { page.value = 1 }

const statusCycle = ['active', 'converted', 'expired', 'active', 'converted']
const codePrefixes = ['IRUS', 'GEAR', 'REF', 'VIP', 'DEAL']

const allReferrals = Array.from({ length: 50 }, (_, i) => {
  const referrer = adminCustomersMock[i % adminCustomersMock.length]
  const referred = adminCustomersMock[(i + 7) % adminCustomersMock.length]
  return {
    id: i + 1,
    referrerName: referrer.name,
    referrerEmail: referrer.email,
    referrerAvatar: referrer.avatar,
    referredName: referred.name,
    code: `${codePrefixes[i % codePrefixes.length]}-${String(1000 + i * 97).slice(0, 4)}`,
    earning: 50000 + ((i * 73000) % 2500000),
    status: statusCycle[i % statusCycle.length],
    createdAt: `2026-04-${String((i % 28) + 1).padStart(2, '0')}T10:00:00.000Z`,
  }
})

const totalEarned = computed(() => allReferrals.filter(r => r.status === 'converted').reduce((s, r) => s + r.earning, 0))

const columns = [
  { key: 'referrer', label: 'Referrer', width: '22%' },
  { key: 'referred', label: 'Referred User' },
  { key: 'code', label: 'Code' },
  { key: 'earning', label: 'Earning' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Date' },
]

const filteredReferrals = computed(() => {
  if (!search.value) return allReferrals
  const q = search.value.toLowerCase()
  return allReferrals.filter(r => r.referrerName.toLowerCase().includes(q) || r.referredName.toLowerCase().includes(q) || r.code.toLowerCase().includes(q))
})

const paginatedReferrals = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredReferrals.value.slice(start, start + pageSize.value)
})

const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
const formatCompact = (n) => { if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M ₫'; return (n / 1e3).toFixed(0) + 'K ₫' }
const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

const statusLabel = (s) => ({ active: 'Active', converted: 'Converted', expired: 'Expired' }[s] || s)
const statusVariant = (s) => ({ active: 'info', converted: 'success', expired: 'neutral' }[s] || 'neutral')

const handleAction = (action, item) => alert(`${action.label} referral #${item.id} (mock)`)
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
