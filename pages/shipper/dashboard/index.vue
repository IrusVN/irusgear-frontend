<template>
  <div class="shipper-dashboard">
    <!-- Header -->
    <div class="shipper-greeting" :class="enterClass(0)">
      <div>
        <h1 class="greeting-title">
          {{ t('shipper.dashboard.greeting', { name: shipperName }) }} 👋
        </h1>
        <p class="greeting-sub">{{ t('shipper.dashboard.greetingSub') }}</p>
      </div>
      <div class="greeting-actions">
        <span class="status-dot" :class="{ online: isOnline }"></span>
        <button class="admin-secondary-button" type="button" @click="isOnline = !isOnline">
          {{ isOnline ? t('shipper.dashboard.statusOnline') : t('shipper.dashboard.statusOffline') }}
        </button>
      </div>
    </div>

    <!-- Metric strip -->
    <div class="metric-strip" :class="enterClass(1)">
      <AdminMetricCard
        :label="t('shipper.dashboard.metrics.totalEarnings')"
        :value="formatMoney(metrics.totalEarnings)"
        :meta="t('shipper.dashboard.metrics.totalEarningsMeta')"
        trend="+12.4%"
        trend-direction="up"
        icon="bi-currency-dollar"
        variant="success"
      />
      <AdminMetricCard
        :label="t('shipper.dashboard.metrics.pendingOrders')"
        :value="String(metrics.pendingOrders)"
        :meta="t('shipper.dashboard.metrics.pendingOrdersMeta')"
        icon="bi-box-seam"
        variant="warning"
      />
      <AdminMetricCard
        :label="t('shipper.dashboard.metrics.deliveredOrders')"
        :value="String(metrics.deliveredOrders)"
        :meta="t('shipper.dashboard.metrics.deliveredOrdersMeta')"
        trend="+5"
        trend-direction="up"
        icon="bi-check2-circle"
        variant="success"
      />
      <AdminMetricCard
        :label="t('shipper.dashboard.metrics.todayEarnings')"
        :value="formatMoney(metrics.todayEarnings)"
        :meta="t('shipper.dashboard.metrics.todayEarningsMeta')"
        icon="bi-cash-coin"
        variant="info"
      />
    </div>

    <div class="dashboard-grid">
      <!-- Earnings chart -->
      <div class="dash-col dash-col-chart" :class="enterClass(2)">
        <AdminCard :title="t('shipper.dashboard.earningsChart.title')"
          :subtitle="t('shipper.dashboard.earningsChart.subtitle')">
          <template #actions>
            <select class="admin-control" v-model="chartRange">
              <option value="7">{{ t('shipper.dashboard.earningsChart.last7Days') }}</option>
              <option value="30">{{ t('shipper.dashboard.earningsChart.last30Days') }}</option>
            </select>
          </template>
          <ClientOnly>
            <AdminLineChart :labels="earningsChart.labels" :data="earningsChart.data"
              :label="t('shipper.dashboard.earningsChart.title')" color="#28c76f" height="280px" />
          </ClientOnly>
        </AdminCard>
      </div>

      <!-- Order status doughnut -->
      <div class="dash-col dash-col-status" :class="enterClass(3)">
        <AdminCard :title="t('shipper.dashboard.statusBreakdown.title')"
          :subtitle="t('shipper.dashboard.statusBreakdown.subtitle')">
          <ClientOnly>
            <AdminDoughnutChart :labels="statusBreakdown.labels" :data="statusBreakdown.data"
              :colors="['#28c76f', '#ff9f43', '#ff4c51']" cutout="70%" height="220px">
              <template #center>
                <div class="donut-center">
                  <strong>{{ totalOrders }}</strong>
                  <small>{{ t('shipper.dashboard.statusBreakdown.totalOrders') }}</small>
                </div>
              </template>
            </AdminDoughnutChart>
          </ClientOnly>
          <div class="status-legend">
            <div v-for="(label, i) in statusBreakdown.labels" :key="label" class="status-legend-item">
              <span class="legend-dot" :style="{ background: ['#28c76f', '#ff9f43', '#ff4c51'][i] }"></span>
              <span class="legend-label">{{ label }}</span>
              <strong class="legend-value">{{ statusBreakdown.data[i] }}</strong>
            </div>
          </div>
        </AdminCard>
      </div>

      <!-- Pending orders list -->
      <div class="dash-col dash-col-pending" :class="enterClass(4)">
        <AdminCard :title="t('shipper.dashboard.pendingList.title')"
          :subtitle="t('shipper.dashboard.pendingList.subtitle')" :padded="false">
          <template #actions>
            <NuxtLink to="/shipper/orders/pending" class="orders-view-link">
              {{ t('shipper.dashboard.viewAll') }}
              <i class="bi bi-arrow-right-short"></i>
            </NuxtLink>
          </template>
          <div class="recent-orders-table-wrap">
            <table class="recent-orders-table">
              <thead>
                <tr>
                  <th>{{ t('shipper.dashboard.table.order') }}</th>
                  <th>{{ t('shipper.dashboard.table.customer') }}</th>
                  <th>{{ t('shipper.dashboard.table.address') }}</th>
                  <th>{{ t('shipper.dashboard.table.status') }}</th>
                  <th class="text-end">{{ t('shipper.dashboard.table.fee') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in pendingOrders" :key="order.id">
                  <td>
                    <strong class="order-link">{{ order.orderCode }}</strong>
                  </td>
                  <td>
                    <div class="ro-customer">
                      <span class="ro-avatar">{{ initials(order.customer.name) }}</span>
                      <div>
                        <strong>{{ order.customer.name }}</strong>
                        <small>{{ order.customer.phone }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="ro-address">{{ order.address }}</span>
                  </td>
                  <td>
                    <AdminStatusBadge :label="t(`shipper.status.${order.status}`)"
                      :variant="statusVariant(order.status)" dot />
                  </td>
                  <td class="text-end">
                    <strong>{{ formatMoney(order.shippingFee) }}</strong>
                  </td>
                </tr>
                <tr v-if="!pendingOrders.length">
                  <td colspan="5" class="empty-row">{{ t('shipper.dashboard.empty') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n, useHead } from '#imports'
import { useAuthStore } from '@/stores/authStore'
import { useShipperStore } from '@/stores/shipperStore'
import AdminCard from '@/components/Admin/ui/AdminCard.vue'
import AdminMetricCard from '@/components/Admin/ui/AdminMetricCard.vue'
import AdminStatusBadge from '@/components/Admin/ui/AdminStatusBadge.vue'
import AdminLineChart from '@/components/Admin/charts/AdminLineChart.vue'
import AdminDoughnutChart from '@/components/Admin/charts/AdminDoughnutChart.vue'

definePageMeta({ layout: 'shipper' })
const { t } = useI18n()
useHead({ title: () => `${t('shipper.dashboard.title')} – IrusGear Shipper` })

const auth = useAuthStore()
const shipper = useShipperStore()

const shipperName = computed(() => {
  const u = auth.user || {}
  return u.first_name || u.name || u.full_name || t('shipper.profile.defaultName')
})

const isOnline = ref(true)
const chartRange = ref('7')
const entered = ref(false)

const metrics = computed(() => ({
  totalEarnings: 0,
  pendingOrders: shipper.stats.pending_pickup || 0,
  deliveredOrders: shipper.stats.delivered_today || 0,
  todayEarnings: 0,
}))

const earningsChart = ref({
  labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  data: [320000, 480000, 410000, 680000, 540000, 720000, 540000],
})

const statusBreakdown = computed(() => ({
  labels: [
    t('shipper.status.delivered'),
    t('shipper.status.delivering'),
    t('shipper.status.failed'),
  ],
  data: [
    shipper.stats.delivered_today || 0,
    shipper.stats.delivering || 0,
    shipper.stats.failed_today || 0,
  ],
}))

const totalOrders = computed(() =>
  statusBreakdown.value.data.reduce((a, b) => a + b, 0)
)

const pendingOrders = computed(() => shipper.orders.slice(0, 5))

/* ── helpers ── */
const formatMoney = (n) => `${new Intl.NumberFormat('vi-VN').format(n || 0)}đ`

const initials = (name) =>
  (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('')

const statusVariant = (s) =>
  ({
    delivering: 'info',
    pending_pickup: 'warning',
    picked_up: 'info',
    failed: 'danger',
    delivered: 'success',
    cancelled: 'danger',
  }[s] || 'neutral')

const enterClass = (i) => ({ 'dash-enter': true, 'is-visible': entered.value, [`delay-${i}`]: true })

onMounted(async () => {
  await shipper.fetchStats()
  await shipper.fetchOrders({ per_page: 5 })
  nextTick(() => { entered.value = true })
})
</script>

<style scoped>
.shipper-dashboard {
  width: 100%;
  max-width: 1540px;
  margin: 0 auto;
}

.shipper-greeting {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 22px;
}

.greeting-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--admin-text);
}

.greeting-sub {
  margin: 4px 0 0;
  color: var(--admin-muted);
  font-size: 0.9rem;
}

.greeting-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--admin-muted);
  box-shadow: 0 0 0 4px rgba(109, 103, 119, 0.16);
}

.status-dot.online {
  background: var(--admin-success);
  box-shadow: 0 0 0 4px rgba(40, 199, 111, 0.18);
}

/* ── metric strip ── */
.metric-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--admin-dashboard-gap);
  margin-bottom: var(--admin-dashboard-gap);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--admin-dashboard-gap);
  align-items: stretch;
}

.dash-col { min-width: 0; }
.dash-col-chart { grid-column: span 8; }
.dash-col-status { grid-column: span 4; }
.dash-col-pending { grid-column: span 12; }

/* ── status doughnut ── */
.donut-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.donut-center strong {
  font-size: 1.4rem;
  color: var(--admin-text);
  font-weight: 700;
}

.donut-center small {
  color: var(--admin-muted);
  font-size: 0.74rem;
}

.status-legend {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.status-legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.86rem;
}

.legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  display: inline-block;
}

.legend-label {
  color: var(--admin-muted);
  flex: 1;
}

.legend-value {
  color: var(--admin-text);
  font-weight: 700;
}

/* ── pending table ── */
.orders-view-link {
  color: var(--admin-primary);
  font-size: 0.84rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  text-decoration: none;
  white-space: nowrap;
}

.orders-view-link:hover { color: var(--admin-text); }
.orders-view-link i { font-size: 1rem; }

.recent-orders-table-wrap { overflow-x: auto; }

.recent-orders-table {
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.recent-orders-table th {
  padding: 14px 20px;
  color: var(--admin-muted);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.74rem;
  letter-spacing: 0.04em;
  background: var(--admin-surface-soft);
  border-top: 1px solid var(--admin-border);
  border-bottom: 1px solid var(--admin-border);
  text-align: left;
  white-space: nowrap;
}

.recent-orders-table td {
  height: 62px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--admin-border);
  vertical-align: middle;
  color: var(--admin-text);
}

.recent-orders-table tbody tr:hover { background: var(--admin-surface-soft); }
.recent-orders-table tbody tr:last-child td { border-bottom: 0; }

.order-link {
  color: var(--admin-text);
  font-weight: 700;
}

.ro-customer {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ro-avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: linear-gradient(135deg, #e0dffe, #b8e6cf);
  color: #2f2b3d;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.78rem;
  flex: 0 0 auto;
}

.ro-customer strong {
  display: block;
  color: var(--admin-text);
  font-size: 0.86rem;
  font-weight: 600;
  white-space: nowrap;
}

.ro-customer small {
  color: var(--admin-muted);
  font-size: 0.78rem;
}

.ro-address {
  color: var(--admin-muted);
  font-size: 0.84rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-end { text-align: right; }
.text-end strong { color: var(--admin-text); font-weight: 700; }

.empty-row {
  text-align: center;
  color: var(--admin-muted);
  padding: 40px 20px !important;
}

/* ── enter animation ── */
.dash-enter {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.dash-enter.is-visible {
  opacity: 1;
  transform: translateY(0);
}
.delay-0 { transition-delay: 0s; }
.delay-1 { transition-delay: .06s; }
.delay-2 { transition-delay: .12s; }
.delay-3 { transition-delay: .18s; }
.delay-4 { transition-delay: .24s; }

/* ── responsive ── */
@media screen and (max-width: 1199.98px) {
  .metric-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dash-col-chart { grid-column: span 12; }
  .dash-col-status { grid-column: span 12; }
}

@media screen and (max-width: 767.98px) {
  .shipper-dashboard { padding-bottom: 80px; }
  .metric-strip { grid-template-columns: 1fr 1fr; gap: 12px; }
  .dashboard-grid { gap: 12px; }
  .greeting-title { font-size: 1.18rem; }
  .greeting-sub { font-size: 0.84rem; }
  .shipper-greeting {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .greeting-actions { align-self: stretch; justify-content: space-between; }
  .recent-orders-table th:nth-child(3),
  .recent-orders-table td:nth-child(3),
  .recent-orders-table th:nth-child(5),
  .recent-orders-table td:nth-child(5) {
    display: none;
  }
  .recent-orders-table { min-width: 0; }
  .recent-orders-table th,
  .recent-orders-table td { padding: 10px 12px; font-size: 0.82rem; }
  .ro-avatar { width: 28px; height: 28px; font-size: 0.7rem; }
}

@media screen and (max-width: 480px) {
  .metric-strip { grid-template-columns: 1fr; }
}
</style>
