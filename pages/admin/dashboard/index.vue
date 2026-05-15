<template>
  <div class="dashboard-container">
    <!-- Row 1: Welcome Hero + Statistics Strip -->
    <div class="dash-row dash-row-hero">
      <!-- Welcome Card -->
      <div class="dash-col dash-col-hero" :class="enterClass(0)">
        <div class="admin-card-shell hero-card">
          <div class="hero-content">
            <div class="hero-text">
              <h2 class="hero-title">Congratulations <span class="hero-highlight">Admin!</span> 🎉</h2>
              <p class="hero-sub">Best seller of the month</p>
              <strong class="hero-value">₫{{ formatCompact(dashboardData.metrics.revenue) }}</strong>
              <nuxt-link to="/admin/products" class="admin-primary-button hero-cta">
                View Sales
              </nuxt-link>
            </div>
            <div class="hero-visual">
              <div class="hero-trophy">🏆</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Strip -->
      <div class="dash-col dash-col-stats" :class="enterClass(1)">
        <div class="stats-strip">
          <div
            v-for="(ch, i) in dashboardData.salesChannels"
            :key="ch.label"
            class="stats-strip-item"
          >
            <AdminMetricCard
              :label="ch.label"
              :value="'₫' + formatCompact(ch.value)"
              :meta="ch.orders.toLocaleString() + ' orders'"
              :trend="ch.change !== 0 ? (ch.change > 0 ? '+' : '') + ch.change + '%' : ''"
              :trend-direction="ch.change > 0 ? 'up' : ch.change < 0 ? 'down' : 'neutral'"
              :icon="ch.icon"
              :variant="ch.variant"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Row 2: Profit + Expenses + Revenue Report + Budget -->
    <div class="dash-row dash-row-charts">
      <!-- Profit -->
      <div class="dash-col dash-col-sm" :class="enterClass(2)">
        <div class="admin-card-shell chart-mini-card">
          <div class="mini-header">
            <span class="mini-label">Profit</span>
            <AdminStatusBadge label="+68.2%" variant="success" />
          </div>
          <strong class="mini-value">₫{{ formatCompact(624000000) }}</strong>
          <ClientOnly>
            <AdminLineChart
              :labels="dashboardData.profit.labels"
              :data="dashboardData.profit.data"
              label="Profit"
              color="#28c76f"
              height="100px"
              :options="sparkOpts"
            />
          </ClientOnly>
        </div>
      </div>

      <!-- Expenses Doughnut -->
      <div class="dash-col dash-col-sm" :class="enterClass(3)">
        <div class="admin-card-shell chart-mini-card">
          <div class="mini-header">
            <span class="mini-label">Expenses</span>
            <AdminStatusBadge label="+4.2%" variant="warning" />
          </div>
          <strong class="mini-value">₫{{ formatCompact(843000000) }}</strong>
          <ClientOnly>
            <AdminDoughnutChart
              :labels="dashboardData.expenseBreakdown.labels"
              :data="dashboardData.expenseBreakdown.data"
              :colors="['#ff9f43', '#ffe0b2']"
              cutout="68%"
              height="100px"
            >
              <template #center>
                <span class="donut-center-text">78%</span>
              </template>
            </AdminDoughnutChart>
          </ClientOnly>
        </div>
      </div>

      <!-- Revenue Report -->
      <div class="dash-col dash-col-lg" :class="enterClass(4)">
        <AdminCard title="Revenue Report">
          <template #actions>
            <div class="revenue-legend">
              <span class="legend-item"><span class="legend-dot" style="background:#000"></span>Earning</span>
              <span class="legend-item"><span class="legend-dot" style="background:#00cfe8"></span>Expense</span>
            </div>
          </template>
          <ClientOnly>
            <AdminBarChart
              :labels="dashboardData.revenueReport.labels"
              :datasets="revenueDatasets"
              height="280px"
              :options="revenueOpts"
            />
          </ClientOnly>
        </AdminCard>
      </div>

      <!-- Budget -->
      <div class="dash-col dash-col-sm" :class="enterClass(5)">
        <div class="admin-card-shell chart-mini-card">
          <div class="mini-header">
            <span class="mini-label">Budget</span>
          </div>
          <strong class="mini-value">₫{{ formatCompact(560000000) }}</strong>
          <p class="mini-sub">Last month ₫480M</p>
          <ClientOnly>
            <AdminSparkline
              :data="dashboardData.budget.data"
              color="#00cfe8"
              height="60px"
              :fill="true"
            />
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Row 3: Leads + Earning Reports + Popular Products + Orders -->
    <div class="dash-row dash-row-mid">
      <!-- Generated Leads -->
      <div class="dash-col dash-col-leads" :class="enterClass(6)">
        <AdminCard title="Generated Leads">
          <div class="leads-content">
            <ClientOnly>
              <AdminDoughnutChart
                :labels="dashboardData.leads.labels"
                :data="dashboardData.leads.data"
                :colors="['#28c76f', '#00cfe8', '#ff9f43']"
                cutout="65%"
                height="140px"
              >
                <template #center>
                  <div class="leads-center">
                    <strong>350</strong>
                    <small>Leads</small>
                  </div>
                </template>
              </AdminDoughnutChart>
            </ClientOnly>
            <div class="leads-legend">
              <div v-for="(item, idx) in leadsLegend" :key="idx" class="leads-legend-item">
                <span class="legend-dot" :style="{ background: item.color }"></span>
                <span class="legend-text">{{ item.label }} – {{ item.value }}</span>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>

      <!-- Earning Reports -->
      <div class="dash-col dash-col-earning" :class="enterClass(7)">
        <AdminCard title="Earning Reports" subtitle="Weekly Overview">
          <div class="earning-items">
            <div
              v-for="item in dashboardData.earningReports"
              :key="item.label"
              class="earning-item"
            >
              <span class="earning-icon" :class="'is-' + item.variant">
                <i class="bi" :class="item.icon"></i>
              </span>
              <div class="earning-copy">
                <strong>{{ item.label }}</strong>
                <small>{{ item.description }}</small>
              </div>
              <div class="earning-stat">
                <strong>₫{{ formatCompact(item.value) }}</strong>
                <AdminStatusBadge
                  :label="'+' + item.change + '%'"
                  :variant="item.change > 20 ? 'success' : 'info'"
                />
              </div>
            </div>
          </div>
          <ClientOnly>
            <AdminBarChart
              :labels="dashboardData.profit.labels"
              :datasets="earningBarDatasets"
              height="180px"
              :options="earningBarOpts"
            />
          </ClientOnly>
        </AdminCard>
      </div>

      <!-- Popular Products -->
      <div class="dash-col dash-col-products" :class="enterClass(8)">
        <AdminCard title="Popular Products" :padded="false">
          <div class="popular-products-list">
            <div
              v-for="product in topProducts"
              :key="product.id"
              class="popular-product-row"
            >
              <img :src="product.image" :alt="product.name" class="pp-img" />
              <div class="pp-copy">
                <strong>{{ product.name }}</strong>
                <small>{{ product.vendor }}</small>
              </div>
              <div class="pp-stat">
                <strong>₫{{ formatCompact(product.revenue) }}</strong>
                <small>{{ product.sales }} sales</small>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>

    <!-- Row 4: Transactions + Recent Orders -->
    <div class="dash-row dash-row-bottom">
      <!-- Transactions -->
      <div class="dash-col dash-col-transactions" :class="enterClass(9)">
        <AdminCard title="Transactions">
          <div class="transaction-list">
            <div
              v-for="tx in dashboardData.transactions"
              :key="tx.id"
              class="transaction-row"
            >
              <span class="tx-icon" :class="'is-' + tx.variant">
                <i class="bi" :class="tx.icon"></i>
              </span>
              <div class="tx-copy">
                <strong>{{ tx.type }}</strong>
                <small>{{ tx.description }}</small>
              </div>
              <span class="tx-amount" :class="{ 'is-negative': tx.amount < 0 }">
                {{ tx.amount > 0 ? '+' : '' }}₫{{ formatCompact(Math.abs(tx.amount)) }}
              </span>
            </div>
          </div>
        </AdminCard>
      </div>

      <!-- Recent Orders -->
      <div class="dash-col dash-col-orders" :class="enterClass(10)">
        <AdminCard title="Recent Orders" :padded="false">
          <div class="recent-orders-table-wrap">
            <table class="recent-orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th class="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id">
                  <td><nuxt-link :to="`/admin/orders/${order.id}`" class="order-link">{{ order.orderCode }}</nuxt-link></td>
                  <td>
                    <div class="ro-customer">
                      <img :src="order.customer.avatar" :alt="order.customer.name" class="ro-avatar" />
                      <div>
                        <strong>{{ order.customer.name }}</strong>
                        <small>{{ order.customer.email }}</small>
                      </div>
                    </div>
                  </td>
                  <td>{{ formatDate(order.date) }}</td>
                  <td><AdminStatusBadge :label="statusLabel(order.paymentStatus)" :variant="statusVariant(order.paymentStatus)" /></td>
                  <td class="text-end"><strong>₫{{ formatCompact(order.total) }}</strong></td>
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
import { useHead } from '#imports'
import { adminDashboardMock, adminDashboardTopProducts, adminDashboardRecentOrders } from '~/mocks/admin/dashboard.mock'
import AdminCard from '@/components/Admin/ui/AdminCard.vue'
import AdminMetricCard from '@/components/Admin/ui/AdminMetricCard.vue'
import AdminStatusBadge from '@/components/Admin/ui/AdminStatusBadge.vue'
import AdminBarChart from '@/components/Admin/charts/AdminBarChart.vue'
import AdminLineChart from '@/components/Admin/charts/AdminLineChart.vue'
import AdminDoughnutChart from '@/components/Admin/charts/AdminDoughnutChart.vue'
import AdminSparkline from '@/components/Admin/charts/AdminSparkline.vue'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Dashboard – IrusGear Admin' })

const dashboardData = adminDashboardMock
const topProducts = adminDashboardTopProducts
const recentOrders = adminDashboardRecentOrders

/* ---------- animations ---------- */
const entered = ref(false)
onMounted(() => { nextTick(() => { entered.value = true }) })
const enterClass = (i) => ({ 'dash-enter': true, 'is-visible': entered.value, [`delay-${i}`]: true })

/* ---------- formatters ---------- */
const formatCompact = (n) => {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

const formatDate = (d) => {
  const dt = new Date(d)
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const statusLabel = (s) => ({ pending: 'Pending', paid: 'Paid', failed: 'Failed', cancelled: 'Cancelled', refunded: 'Refunded' }[s] || s)
const statusVariant = (s) => ({ pending: 'warning', paid: 'success', failed: 'danger', cancelled: 'neutral', refunded: 'info' }[s] || 'neutral')

/* ---------- chart configs ---------- */
const sparkOpts = { plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } } }

const revenueDatasets = computed(() => [
  { label: 'Earning', data: dashboardData.revenueReport.earning, backgroundColor: '#000', borderRadius: 6, barThickness: 12 },
  { label: 'Expense', data: dashboardData.revenueReport.expense.map(v => Math.abs(v)), backgroundColor: '#00cfe8', borderRadius: 6, barThickness: 12 },
])

const revenueOpts = {
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#a8a8b3' } },
    y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#a8a8b3' } },
  },
}

const earningBarDatasets = computed(() => [
  { label: 'Earning', data: [40, 60, 50, 65, 45, 72, 55], backgroundColor: '#28c76f', borderRadius: 5, barThickness: 14 },
])

const earningBarOpts = {
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#a8a8b3' } },
    y: { display: false },
  },
}

const leadsLegend = [
  { label: 'Organic', value: 184, color: '#28c76f' },
  { label: 'Ads', value: 94, color: '#00cfe8' },
  { label: 'Referral', value: 72, color: '#ff9f43' },
]
</script>

<style scoped>
.dashboard-container { max-width: 1560px; }

/* ─── Staggered entrance ─── */
.dash-enter { opacity: 0; transform: translateY(18px); transition: opacity 0.45s ease, transform 0.45s ease; }
.dash-enter.is-visible { opacity: 1; transform: translateY(0); }
.delay-0 { transition-delay: 0s; }
.delay-1 { transition-delay: .06s; }
.delay-2 { transition-delay: .12s; }
.delay-3 { transition-delay: .18s; }
.delay-4 { transition-delay: .24s; }
.delay-5 { transition-delay: .30s; }
.delay-6 { transition-delay: .36s; }
.delay-7 { transition-delay: .42s; }
.delay-8 { transition-delay: .48s; }
.delay-9 { transition-delay: .54s; }
.delay-10 { transition-delay: .60s; }

/* ─── Grid rows ─── */
.dash-row { display: grid; gap: 20px; margin-bottom: 20px; }

.dash-row-hero { grid-template-columns: 1fr 1fr; }
.dash-row-charts { grid-template-columns: 1fr 1fr 2.4fr 1fr; }
.dash-row-mid { grid-template-columns: 1fr 1.5fr 1.2fr; }
.dash-row-bottom { grid-template-columns: 1fr 2fr; }

/* ─── Hero card ─── */
.hero-card { padding: 28px; }
.hero-content { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.hero-text { display: flex; flex-direction: column; gap: 6px; }
.hero-title { margin: 0; font-size: 1.28rem; font-weight: 700; color: var(--admin-text); }
.hero-highlight { color: var(--admin-primary); }
.hero-sub { margin: 0; color: var(--admin-muted); font-size: 0.92rem; }
.hero-value { font-size: 1.65rem; color: var(--admin-primary); }
.hero-cta { margin-top: 8px; width: fit-content; font-size: 0.85rem; }
.hero-visual { flex: 0 0 auto; }
.hero-trophy { font-size: 4rem; line-height: 1; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.1)); }

/* ─── Stats strip ─── */
.stats-strip { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; height: 100%; }

/* ─── Mini chart cards ─── */
.chart-mini-card { padding: 20px; display: flex; flex-direction: column; gap: 6px; }
.mini-header { display: flex; align-items: center; justify-content: space-between; }
.mini-label { color: var(--admin-muted); font-size: 0.88rem; }
.mini-value { font-size: 1.45rem; font-weight: 700; color: var(--admin-text); }
.mini-sub { margin: 0; color: var(--admin-muted); font-size: 0.82rem; }
.donut-center-text { font-weight: 700; font-size: 1.1rem; color: var(--admin-text); }

/* ─── Revenue legend ─── */
.revenue-legend { display: flex; gap: 16px; }
.legend-item { display: flex; align-items: center; gap: 6px; color: var(--admin-muted); font-size: 0.82rem; }
.legend-dot { width: 8px; height: 8px; border-radius: 999px; display: inline-block; }

/* ─── Leads ─── */
.leads-content { display: flex; flex-direction: column; gap: 14px; align-items: center; }
.leads-center { display: flex; flex-direction: column; align-items: center; }
.leads-center strong { font-size: 1.3rem; color: var(--admin-text); }
.leads-center small { color: var(--admin-muted); font-size: 0.78rem; }
.leads-legend { width: 100%; display: flex; flex-direction: column; gap: 6px; }
.leads-legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--admin-text); }
.legend-text { font-weight: 500; }

/* ─── Earning reports ─── */
.earning-items { display: flex; flex-direction: column; gap: 14px; margin-bottom: 18px; }
.earning-item { display: flex; align-items: center; gap: 14px; }
.earning-icon { width: 40px; height: 40px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex: 0 0 auto; }
.earning-icon.is-neutral { background: var(--admin-surface-soft); color: var(--admin-text); }
.earning-icon.is-success { background: rgba(40,199,111,0.14); color: var(--admin-success); }
.earning-copy { flex: 1; min-width: 0; }
.earning-copy strong { display: block; font-size: 0.92rem; }
.earning-copy small { color: var(--admin-muted); font-size: 0.8rem; }
.earning-stat { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.earning-stat strong { font-size: 0.95rem; }

/* ─── Popular products ─── */
.popular-products-list { padding: 0; }
.popular-product-row { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-bottom: 1px solid var(--admin-border); transition: background 0.15s; }
.popular-product-row:last-child { border-bottom: 0; }
.popular-product-row:hover { background: var(--admin-surface-soft); }
.pp-img { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; flex: 0 0 auto; background: var(--admin-surface-soft); }
.pp-copy { flex: 1; min-width: 0; }
.pp-copy strong { display: block; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pp-copy small { color: var(--admin-muted); font-size: 0.8rem; }
.pp-stat { text-align: right; }
.pp-stat strong { display: block; font-size: 0.9rem; }
.pp-stat small { color: var(--admin-muted); font-size: 0.78rem; }

/* ─── Transactions ─── */
.transaction-list { display: flex; flex-direction: column; gap: 14px; }
.transaction-row { display: flex; align-items: center; gap: 14px; }
.tx-icon { width: 40px; height: 40px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex: 0 0 auto; }
.tx-icon.is-neutral { background: var(--admin-surface-soft); color: var(--admin-text); }
.tx-icon.is-success { background: rgba(40,199,111,0.14); color: var(--admin-success); }
.tx-icon.is-info { background: rgba(0,207,232,0.14); color: var(--admin-info); }
.tx-icon.is-danger { background: rgba(255,76,81,0.14); color: var(--admin-danger); }
.tx-copy { flex: 1; min-width: 0; }
.tx-copy strong { display: block; font-size: 0.9rem; }
.tx-copy small { color: var(--admin-muted); font-size: 0.8rem; }
.tx-amount { font-weight: 700; font-size: 0.92rem; color: var(--admin-success); white-space: nowrap; }
.tx-amount.is-negative { color: var(--admin-danger); }

/* ─── Recent orders table ─── */
.recent-orders-table-wrap { overflow-x: auto; }
.recent-orders-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
.recent-orders-table th { padding: 12px 20px; color: var(--admin-muted); font-weight: 600; text-transform: uppercase; font-size: 0.76rem; letter-spacing: 0.04em; background: var(--admin-surface-soft); border-bottom: 1px solid var(--admin-border); text-align: left; white-space: nowrap; }
.recent-orders-table td { padding: 12px 20px; border-bottom: 1px solid var(--admin-border); vertical-align: middle; }
.recent-orders-table tbody tr:hover { background: var(--admin-surface-soft); }
.recent-orders-table tbody tr:last-child td { border-bottom: 0; }
.order-link { color: var(--admin-primary); font-weight: 600; text-decoration: none; }
.order-link:hover { text-decoration: underline; }
.ro-customer { display: flex; align-items: center; gap: 10px; }
.ro-avatar { width: 32px; height: 32px; border-radius: 999px; object-fit: cover; flex: 0 0 auto; }
.ro-customer strong { display: block; font-size: 0.86rem; white-space: nowrap; }
.ro-customer small { color: var(--admin-muted); font-size: 0.78rem; }
.text-end { text-align: right; }

/* ─── Responsive ─── */
@media (max-width: 1199.98px) {
  .dash-row-hero { grid-template-columns: 1fr; }
  .dash-row-charts { grid-template-columns: 1fr 1fr; }
  .dash-row-mid { grid-template-columns: 1fr 1fr; }
  .dash-row-bottom { grid-template-columns: 1fr; }
}

@media (max-width: 767.98px) {
  .dash-row-charts,
  .dash-row-mid,
  .dash-row-bottom { grid-template-columns: 1fr; }
  .stats-strip { grid-template-columns: 1fr; }
  .hero-content { flex-direction: column; text-align: center; }
  .hero-cta { align-self: center; }
}
</style>
