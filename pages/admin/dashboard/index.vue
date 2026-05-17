<template>
  <div class="dashboard-container">
    <div class="dashboard-grid">
      <!-- Welcome Card -->
      <div class="dash-col dash-col-hero" :class="enterClass(0)">
        <div class="admin-card-shell hero-card">
          <div class="hero-content">
            <div class="hero-text">
              <h2 class="hero-title">{{ t('admin.dashboard.heroTitle') }} <span class="hero-highlight">{{
                t('admin.dashboard.heroName') }}</span> 🎉</h2>
              <p class="hero-sub">{{ t('admin.dashboard.heroSubtitle') }}</p>
              <strong class="hero-value">{{ formatNumber(dashboardData.metrics.revenue) }}đ</strong>
              <nuxt-link to="/admin/products" class="admin-primary-button hero-cta">
                {{ t('admin.dashboard.viewSales') }}
              </nuxt-link>
            </div>
            <div class="hero-visual">
              <div class="hero-trophy">🏆</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Card -->
      <div class="dash-col dash-col-stats" :class="enterClass(1)">
        <div class="admin-card-shell statistics-card">
          <div class="statistics-header">
            <h3>{{ t('admin.dashboard.statistics') }}</h3>
            <span>{{ t('admin.dashboard.updatedAgo') }}</span>
          </div>
          <div class="statistics-grid">
            <div v-for="metric in statisticsMetrics" :key="metric.label" class="statistics-item">
              <span class="statistics-icon" :class="'is-' + metric.variant">
                <i class="bi" :class="metric.icon"></i>
              </span>
              <div class="statistics-copy">
                <strong>{{ metric.value }}</strong>
                <span>{{ metric.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profit -->
      <div class="dash-col dash-col-sm" :class="enterClass(2)" v-if="dashboardData.profit.data.length > 0">
        <div class="admin-card-shell chart-mini-card">
          <div class="mini-header">
            <span class="mini-label">{{ t('admin.dashboard.profit') }}</span>
            <AdminStatusBadge label="+68.2%" variant="success" />
          </div>
          <strong class="mini-value">{{ formatNumber(dashboardData.profit.data.reduce((a, b) => a + b, 0)) }}đ</strong>
          <ClientOnly>
            <AdminLineChart :labels="dashboardData.profit.labels" :data="dashboardData.profit.data"
              :label="t('admin.dashboard.profit')" color="#28c76f" height="100px" :options="sparkOpts" />
          </ClientOnly>
        </div>
      </div>

      <!-- Expenses Doughnut -->
      <div class="dash-col dash-col-sm" :class="enterClass(3)" v-if="dashboardData.expenseBreakdown.data.length > 0">
        <div class="admin-card-shell chart-mini-card">
          <div class="mini-header">
            <span class="mini-label">{{ t('admin.dashboard.expenses') }}</span>
            <AdminStatusBadge label="+4.2%" variant="warning" />
          </div>
          <strong class="mini-value">{{ formatNumber(dashboardData.expenseBreakdown.data.reduce((a, b) => a + b, 0)) }}đ</strong>
          <ClientOnly>
            <AdminDoughnutChart :labels="dashboardData.expenseBreakdown.labels"
              :data="dashboardData.expenseBreakdown.data" :colors="['#ff9f43', '#ffe0b2']" cutout="68%" height="100px">
              <template #center>
                <span class="donut-center-text">78%</span>
              </template>
            </AdminDoughnutChart>
          </ClientOnly>
        </div>
      </div>

      <!-- Revenue Report + Budget -->
      <div class="dash-col dash-col-revenue-budget" :class="enterClass(4)">
        <div class="admin-card-shell revenue-budget-card" :style="dashboardData.budget.data.length === 0 ? 'grid-template-columns: 1fr;' : ''">
          <div class="revenue-panel">
            <div class="revenue-card-header">
              <h3>{{ t('admin.dashboard.revenueReport') }}</h3>
              <div class="revenue-legend">
                <span class="legend-item"><span class="legend-dot" style="background:#000"></span>{{
                  t('admin.dashboard.earning') }}</span>
                <span class="legend-item"><span class="legend-dot" style="background:#ff9f43"></span>{{
                  t('admin.dashboard.expense') }}</span>
              </div>
            </div>
            <ClientOnly>
              <AdminBarChart :labels="dashboardData.revenueReport.labels" :datasets="revenueDatasets" height="304px"
                :options="revenueOpts" />
            </ClientOnly>
          </div>
          <aside class="budget-panel" v-if="dashboardData.budget.data.length > 0">
            <select class="admin-control budget-year" :aria-label="t('admin.dashboard.budgetYear')">
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
            <div class="budget-summary">
              <strong>{{ formatNumber(dashboardData.budget.actual) }}đ</strong>
              <span>{{ t('admin.dashboard.budgetTarget', { amount: formatNumber(dashboardData.budget.target) + ' đ' }) }}</span>
            </div>
            <ClientOnly>
              <AdminSparkline :data="dashboardData.budget.data" color="#2f2b3d" height="96px" :fill="false" />
            </ClientOnly>
            <button class="admin-primary-button budget-action" type="button">
              {{ t('admin.dashboard.increaseBudget') }}
            </button>
          </aside>
        </div>
      </div>

      <!-- Orders by Status -->
      <div class="dash-col dash-col-leads" :class="enterClass(6)" v-if="dashboardData.ordersByStatus.data.length > 0">
        <AdminCard :title="t('admin.dashboard.ordersByStatus')" :subtitle="t('admin.dashboard.ordersByStatusSubtitle')">
          <template #actions>
            <button class="card-menu-button" type="button" :aria-label="t('admin.dashboard.moreActions')">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
          </template>
          <div class="leads-content">
            <div class="leads-copy">
              <h3>{{ dashboardData.ordersByStatus.data.reduce((a, b) => a + b, 0) }}</h3>
              <span>{{ t('admin.dashboard.totalOrders') }}</span>
              <strong>{{ dashboardData.ordersByStatus.data[0] || 0 }}</strong>
              <small><i class="bi bi-chevron-up"></i> {{ dashboardData.ordersByStatus.labels[0] || '' }}</small>
            </div>
            <div class="leads-chart">
              <ClientOnly>
                <AdminDoughnutChart :labels="dashboardData.ordersByStatus.labels" :data="dashboardData.ordersByStatus.data"
                  :colors="['#28c76f', '#b8f1ce', '#e5f8ed', '#ff9f43', '#ffe0b2', '#ea5455', '#fce4e4', '#00cfe8', '#d0f8fc']" cutout="72%" height="148px">
                  <template #center>
                    <div class="leads-center">
                      <strong>{{ dashboardData.ordersByStatus.data.reduce((a, b) => a + b, 0) }}</strong>
                    </div>
                  </template>
                </AdminDoughnutChart>
              </ClientOnly>
              <div class="leads-mini-legend">
                <span v-for="(lbl, idx) in dashboardData.ordersByStatus.labels.slice(0, 3)" :key="lbl">
                  <i :style="{ background: ['#28c76f', '#b8f1ce', '#e5f8ed'][idx] }"></i> {{ lbl }}
                </span>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>

      <!-- Sales Channels -->
      <div class="dash-col dash-col-earning" :class="enterClass(7)" v-if="dashboardData.salesChannels.length > 0">
        <AdminCard :title="t('admin.dashboard.salesChannels')" :subtitle="t('admin.dashboard.salesChannelsSubtitle')" :padded="false">
          <template #actions>
            <button class="card-menu-button" type="button" :aria-label="t('admin.dashboard.moreEarningActions')">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
          </template>
          <div class="earning-items" style="padding: 20px;">
            <div v-for="(item, idx) in dashboardData.salesChannels" :key="item.channel" class="earning-item">
              <span class="earning-icon" :class="idx === 0 ? 'is-success' : 'is-neutral'">
                <i class="bi" :class="idx === 0 ? 'bi-globe' : 'bi-shop'"></i>
              </span>
              <div class="earning-copy">
                <strong>{{ item.channel }}</strong>
                <small>{{ t('admin.dashboard.ordersCount', { count: item.orders }) }}</small>
              </div>
              <div class="earning-stat">
                <strong>{{ formatNumber(item.revenue) }}đ</strong>
                <AdminStatusBadge :label="item.percentage + '%'" variant="info" />
              </div>
            </div>
          </div>
        </AdminCard>
      </div>

      <!-- Popular Products -->
      <div class="dash-col dash-col-products" :class="enterClass(8)">
        <AdminCard :title="t('admin.dashboard.popularProducts')" :subtitle="t('admin.dashboard.totalVisitors')"
          :padded="false">
          <template #actions>
            <button class="card-menu-button" type="button" :aria-label="t('admin.dashboard.moreProductActions')">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
          </template>
          <div class="popular-products-list">
            <div v-for="product in topProducts" :key="product.id" class="popular-product-row">
              <img :src="product.image" :alt="product.name" class="pp-img" />
              <div class="pp-copy">
                <strong>{{ product.name }}</strong>
                <small>{{ product.vendor }}</small>
              </div>
              <div class="pp-stat">
                <strong>{{ formatNumber(product.revenue) }}đ</strong>
                <small>{{ t('admin.dashboard.salesCount', { count: product.sales }) }}</small>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>

      <!-- Orders by Location -->
      <div class="dash-col dash-col-countries" :class="enterClass(9)" v-if="dashboardData.ordersByLocation.length > 0">
        <AdminCard :title="t('admin.dashboard.ordersByLocation')" :subtitle="t('admin.dashboard.locationSubtitle')">
          <template #actions>
            <button class="card-menu-button" type="button" :aria-label="t('admin.dashboard.moreCountryActions')">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
          </template>
          <div class="transaction-list" style="margin-top: 16px;">
            <div v-for="(item, idx) in dashboardData.ordersByLocation" :key="item.location" class="transaction-row">
              <span class="tx-icon" :class="idx === 0 ? 'is-success' : 'is-info'">
                <i class="bi bi-geo-alt"></i>
              </span>
              <div class="tx-copy">
                <strong>{{ item.location }}</strong>
                <small>{{ item.orders_count }} {{ t('admin.dashboard.orders') }}</small>
              </div>
              <span class="tx-amount">
                {{ formatNumber(item.revenue) }}đ
              </span>
            </div>
          </div>
        </AdminCard>
      </div>

      <!-- Transactions -->
      <div class="dash-col dash-col-transactions" :class="enterClass(10)" v-if="transactionsView.length > 0">
        <AdminCard :title="t('admin.dashboard.transactions')" :subtitle="t('admin.dashboard.transactionsSubtitle')">
          <template #actions>
            <button class="card-menu-button" type="button" :aria-label="t('admin.dashboard.moreTxActions')">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
          </template>
          <div class="transaction-list">
            <div v-for="tx in transactionsView" :key="tx.id" class="transaction-row">
              <span class="tx-icon" :class="'is-' + tx.variant">
                <i class="bi" :class="tx.icon"></i>
              </span>
              <div class="tx-copy">
                <strong>{{ tx.type }}</strong>
                <small>{{ tx.description }}</small>
              </div>
              <span class="tx-amount" :class="{ 'is-negative': tx.amount < 0 }">
                {{ tx.amount > 0 ? '+' : '' }}{{ formatNumber(Math.abs(tx.amount)) }}đ
              </span>
            </div>
          </div>
        </AdminCard>
      </div>

      <!-- Recent Orders -->
      <div class="dash-col dash-col-orders" :class="enterClass(11)">
        <AdminCard :title="t('admin.dashboard.recentOrders')" :subtitle="t('admin.dashboard.recentOrdersSubtitle')"
          :padded="false">
          <template #actions>
            <nuxt-link to="/admin/orders" class="orders-view-link">
              {{ t('admin.dashboard.viewAll') }}
              <i class="bi bi-arrow-right-short"></i>
            </nuxt-link>
          </template>
          <div class="recent-orders-table-wrap">
            <table class="recent-orders-table">
              <thead>
                <tr>
                  <th>{{ t('admin.dashboard.table.order') }}</th>
                  <th>{{ t('admin.dashboard.table.customer') }}</th>
                  <th>{{ t('admin.dashboard.table.date') }}</th>
                  <th>{{ t('admin.dashboard.table.status') }}</th>
                  <th class="text-end">{{ t('admin.dashboard.table.amount') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id">
                  <td><nuxt-link :to="`/admin/orders/${order.id}`" class="order-link">{{ order.orderCode }}</nuxt-link>
                  </td>
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
                  <td>
                    <AdminStatusBadge :label="statusLabel(order.paymentStatus)"
                      :variant="statusVariant(order.paymentStatus)" />
                  </td>
                  <td class="text-end"><strong>{{ formatNumber(order.total) }}đ</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>
    </div>

    <footer class="dashboard-footer dash-enter delay-12" :class="{ 'is-visible': entered }">
      <span>{{ t('admin.dashboard.footerMadeBy') }}</span>
      <nav :aria-label="t('admin.dashboard.footerNavigation')">
        <a href="#" @click.prevent>{{ t('admin.dashboard.license') }}</a>
        <a href="#" @click.prevent>{{ t('admin.dashboard.moreThemes') }}</a>
        <a href="#" @click.prevent>{{ t('admin.dashboard.documentation') }}</a>
        <a href="#" @click.prevent>{{ t('admin.dashboard.support') }}</a>
      </nav>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useHead, useI18n } from '#imports'
import { useAdminStore } from '@/stores/adminStore'
import { vietnamAddressApi } from '@/composables/useVietnamAddressApi'
import AdminCard from '@/components/Admin/ui/AdminCard.vue'
import AdminStatusBadge from '@/components/Admin/ui/AdminStatusBadge.vue'
import AdminBarChart from '@/components/Admin/charts/AdminBarChart.vue'
import AdminLineChart from '@/components/Admin/charts/AdminLineChart.vue'
import AdminDoughnutChart from '@/components/Admin/charts/AdminDoughnutChart.vue'
import AdminSparkline from '@/components/Admin/charts/AdminSparkline.vue'
import { useStatusFormat } from '@/composables/useStatusFormat'

definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => `${t('admin.dashboard.title')} – IrusGear Admin` })

const admin = useAdminStore()

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

/* ---------- reactive state ---------- */
const dashboardData = ref({
  metrics: { sales: 0, customers: 0, products: 0, revenue: 0 },
  revenueReport: { labels: [], earning: [], expense: [] },
  profit: { labels: [], data: [] },
  expenseBreakdown: { labels: [], data: [] },
  leads: { labels: [], data: [] },
  budget: { labels: [], data: [] },
  earningReports: [],
  transactions: [],
  ordersByLocation: [],
  salesChannels: [],
  ordersByStatus: { labels: [], data: [] }
})

const topProducts = ref([])
const recentOrders = ref([])

/* ---------- Transactions normaliser ---------- */
// Backend đôi khi trả chuỗi tiếng Việt bị hỏng encoding (xuất hiện ký tự "?"),
// nên ta tự suy ra label dựa vào icon/variant/dấu của amount rồi dịch qua i18n.
const isCorruptedText = (s) => typeof s !== 'string' || !s.trim() || s.includes('?')

const inferTxTypeKey = (tx) => {
  const icon = (tx?.icon || '').toLowerCase()
  const variant = (tx?.variant || '').toLowerCase()
  if (icon.includes('arrow-return') || variant === 'danger' || (typeof tx?.amount === 'number' && tx.amount < 0)) {
    return 'refund'
  }
  if (icon.includes('credit-card')) return 'vnpayPayment'
  if (icon.includes('wallet')) return 'momoPayment'
  if (icon.includes('cash')) return 'codPayment'
  return 'payment'
}

const inferTxDescription = (tx) => {
  const key = inferTxTypeKey(tx)
  if (key === 'refund') return t('admin.dashboard.txDescriptions.refundCustomer')
  const id = tx?.order_id || tx?.orderId || tx?.id || '—'
  return t('admin.dashboard.txDescriptions.orderRef', { id })
}

const transactionsView = computed(() =>
  (dashboardData.value.transactions || []).map((tx) => {
    const typeKey = inferTxTypeKey(tx)
    return {
      ...tx,
      type: isCorruptedText(tx.type) ? t(`admin.dashboard.txTypes.${typeKey}`) : tx.type,
      description: isCorruptedText(tx.description) ? inferTxDescription(tx) : tx.description,
    }
  })
)

/* ---------- animations ---------- */
const entered = ref(false)

const fetchDashboard = async () => {
  const res = await admin.fetchOne('dashboard', { days: 30 })
  if (res?.data) {
    if (res.data.metrics) {
      dashboardData.value.metrics = {
        ...dashboardData.value.metrics,
        ...res.data.metrics
      }
    }
    if (res.data.revenue_report) {
      dashboardData.value.revenueReport = {
        labels: res.data.revenue_report.labels || dashboardData.value.revenueReport.labels,
        earning: res.data.revenue_report.earning || dashboardData.value.revenueReport.earning,
        expense: res.data.revenue_report.expense || dashboardData.value.revenueReport.expense
      }
    }
    if (res.data.orders_by_location) {
      // BE trả raw province_code (vd '79', 'HCM'). Resolve qua vietnamAddressApi
      // (cache local, gọi 1 lần fetch /provinces.json) → tên tỉnh tiếng Việt.
      // Đồng thời merge các entry trùng tỉnh (vd 'HCM' + '79' = TP HCM).
      const resolved = await Promise.all(
        res.data.orders_by_location.map(async (item) => {
          const result = await vietnamAddressApi.resolveAddressCode({
            province_code: item.location,
          })
          return {
            ...item,
            location: result?.province?.label || item.location,
          }
        }),
      )

      // Merge các entry cùng resolved label (HCM text + 79 code → cùng "TP Hồ Chí Minh")
      const merged = {}
      for (const item of resolved) {
        if (!merged[item.location]) {
          merged[item.location] = { location: item.location, orders_count: 0, revenue: 0 }
        }
        merged[item.location].orders_count += Number(item.orders_count || 0)
        merged[item.location].revenue += Number(item.revenue || 0)
      }
      dashboardData.value.ordersByLocation = Object.values(merged)
        .sort((a, b) => b.revenue - a.revenue)
    }
    if (res.data.sales_channels) {
      dashboardData.value.salesChannels = res.data.sales_channels
    }
    if (res.data.orders_by_status) {
      dashboardData.value.ordersByStatus = {
        labels: Object.keys(res.data.orders_by_status).map(status => statusLabel(status)),
        data: Object.values(res.data.orders_by_status)
      }
    }
    if (res.data.expense_breakdown) {
      dashboardData.value.expenseBreakdown = res.data.expense_breakdown
    }
    if (res.data.profit) {
      dashboardData.value.profit = res.data.profit
    }
    if (res.data.budget) {
      dashboardData.value.budget = res.data.budget
    }
    if (res.data.transactions) {
      dashboardData.value.transactions = res.data.transactions
    }
    if (res.data.top_products) {
      topProducts.value = res.data.top_products.map(p => ({
        id: p.id,
        name: p.name,
        vendor: p.vendor || p.category || 'Accessories',
        revenue: p.revenue || p.sales || 0,
        sales: p.sales_count || p.quantity_sold || p.sales || 0,
        image: p.image || 'https://via.placeholder.com/48'
      }))
    }
    if (res.data.recent_orders) {
      recentOrders.value = res.data.recent_orders.map(o => {
        const customerName = o.customer?.name || o.customer_name || 'Guest'
        return {
          id: o.id,
          orderCode: o.orderCode || o.order_number || `#ORD${o.id}`,
          customer: {
            name: customerName,
            avatar: o.customer?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=random`,
            email: o.customer?.email || ''
          },
          total: o.total,
          paymentStatus: o.paymentStatus || o.status || 'pending',
          date: o.date || o.created_at || new Date().toISOString()
        }
      })
    }
  }
}

onMounted(() => {
  nextTick(() => { entered.value = true })
  fetchDashboard()
})
const enterClass = (i) => ({ 'dash-enter': true, 'is-visible': entered.value, [`delay-${i}`]: true })
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

/* ---------- formatters ---------- */
const formatNumber = (n) => {
  return new Intl.NumberFormat('vi-VN').format(n || 0)
}

const formatDate = (d) => {
  const dt = new Date(d)
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const { formatPaymentStatus } = useStatusFormat()
const statusLabel = (s) => formatPaymentStatus(s).label
const statusVariant = (s) => formatPaymentStatus(s).variant

const statisticsMetrics = computed(() => [
  {
    label: t('admin.dashboard.stats.sales'),
    value: formatNumber(dashboardData.value.metrics.sales),
    icon: 'bi-pie-chart',
    variant: 'neutral',
  },
  {
    label: t('admin.dashboard.stats.customers'),
    value: formatNumber(dashboardData.value.metrics.customers),
    icon: 'bi-people',
    variant: 'info',
  },
  {
    label: t('admin.dashboard.stats.products'),
    value: formatNumber(dashboardData.value.metrics.products),
    icon: 'bi-cart3',
    variant: 'danger',
  },
  {
    label: t('admin.dashboard.stats.revenue'),
    value: `${formatNumber(dashboardData.value.metrics.revenue)}đ`,
    icon: 'bi-currency-dollar',
    variant: 'success',
  },
])

/* ---------- chart configs ---------- */
const sparkOpts = { plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } } }

const revenueDatasets = computed(() => [
  { label: t('admin.dashboard.earning'), data: dashboardData.value.revenueReport.earning, backgroundColor: '#000', borderRadius: 6, barThickness: 12 },
  { label: t('admin.dashboard.expense'), data: dashboardData.value.revenueReport.expense.map(v => Math.abs(v)), backgroundColor: '#ff9f43', borderRadius: 6, barThickness: 12 },
])

const revenueOpts = {
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#a8a8b3' } },
    y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#a8a8b3' } },
  },
}

const earningBarDatasets = computed(() => [
  { label: t('admin.dashboard.earning'), data: [40, 60, 50, 65, 45, 72, 55], backgroundColor: '#28c76f', borderRadius: 5, barThickness: 14 },
])

const earningBarOpts = {
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#a8a8b3' } },
    y: { display: false },
  },
}

const leadsLegend = computed(() => [
  { label: t('admin.dashboard.leadSources.organic'), value: 184, color: '#28c76f' },
  { label: t('admin.dashboard.leadSources.ads'), value: 94, color: '#00cfe8' },
  { label: t('admin.dashboard.leadSources.referral'), value: 72, color: '#ff9f43' },
])
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  max-width: 1540px;
  margin: 0 auto;
}

/* ─── Staggered entrance ─── */
.dash-enter {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.dash-enter.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.delay-0 {
  transition-delay: 0s;
}

.delay-1 {
  transition-delay: .06s;
}

.delay-2 {
  transition-delay: .12s;
}

.delay-3 {
  transition-delay: .18s;
}

.delay-4 {
  transition-delay: .24s;
}

.delay-5 {
  transition-delay: .30s;
}

.delay-6 {
  transition-delay: .36s;
}

.delay-7 {
  transition-delay: .42s;
}

.delay-8 {
  transition-delay: .48s;
}

.delay-9 {
  transition-delay: .54s;
}

.delay-10 {
  transition-delay: .60s;
}

.delay-11 {
  transition-delay: .66s;
}

.delay-12 {
  transition-delay: .72s;
}

/* ─── Grid rows ─── */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--admin-dashboard-gap);
  align-items: stretch;
}

.dash-col {
  min-width: 0;
}

.dash-col>.admin-card-shell,
.dash-col> :deep(.admin-card) {
  height: 100%;
}

.dash-col>.admin-card-shell,
.dash-col> :deep(.admin-card) {
  transition: box-shadow 0.18s ease, transform 0.18s ease;
}

.dash-col>.admin-card-shell:hover,
.dash-col> :deep(.admin-card):hover {
  box-shadow: var(--admin-shadow);
  transform: translateY(-1px);
}

.dash-col-hero {
  grid-column: span 4;
}

.dash-col-stats {
  grid-column: span 8;
}

.dash-col-sm {
  grid-column: span 2;
}

.dash-col-revenue-budget {
  grid-column: span 8;
}

.dash-col-leads,
.dash-col-earning,
.dash-col-products,
.dash-col-countries {
  grid-column: span 4;
}

.dash-col-transactions {
  grid-column: span 4;
}

.dash-col-orders {
  grid-column: span 8;
}

/* ─── Hero card ─── */
.hero-card {
  padding: var(--admin-card-padding);
  min-height: 168px;
  overflow: hidden;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hero-title {
  margin: 0;
  font-size: 1.12rem;
  font-weight: 600;
  color: var(--admin-text);
}

.hero-highlight {
  color: var(--admin-primary);
}

.hero-sub {
  margin: 0;
  color: var(--admin-muted);
  font-size: 0.92rem;
}

.hero-value {
  font-size: 1.68rem;
  line-height: 1.2;
  color: var(--admin-primary);
}

.hero-cta {
  margin-top: 8px;
  width: fit-content;
  font-size: 0.85rem;
}

.hero-visual {
  flex: 0 0 112px;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-trophy {
  font-size: 4.1rem;
  line-height: 1;
  filter: drop-shadow(0 10px 18px rgba(47, 43, 61, 0.12));
  transform: translateY(4px);
}

/* ─── Statistics card ─── */
.statistics-card {
  min-height: 168px;
  padding: var(--admin-card-padding);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
}

.statistics-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.statistics-header h3 {
  margin: 0;
  color: var(--admin-text);
  font-size: 1.06rem;
  font-weight: 500;
}

.statistics-header span {
  color: var(--admin-subtle);
  font-size: 0.82rem;
  white-space: nowrap;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

.statistics-item {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.statistics-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--admin-radius);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  font-size: 1.12rem;
  background: rgba(47, 43, 61, 0.08);
  color: var(--admin-text);
}

.statistics-icon.is-info {
  background: rgba(0, 207, 232, 0.14);
  color: var(--admin-info);
}

.statistics-icon.is-danger {
  background: rgba(255, 76, 81, 0.14);
  color: var(--admin-danger);
}

.statistics-icon.is-success {
  background: rgba(40, 199, 111, 0.14);
  color: var(--admin-success);
}

.statistics-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.statistics-copy strong {
  color: var(--admin-text);
  font-size: 1.18rem;
  font-weight: 500;
  line-height: 1.2;
}

.statistics-copy span {
  color: var(--admin-muted);
  font-size: 0.84rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ─── Mini chart cards ─── */
.chart-mini-card {
  padding: var(--admin-card-padding);
  min-height: 390px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}

.mini-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mini-label {
  color: var(--admin-muted);
  font-size: 0.88rem;
}

.mini-value {
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--admin-text);
}

.mini-sub {
  margin: 0;
  color: var(--admin-muted);
  font-size: 0.82rem;
}

.donut-center-text {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--admin-text);
}

/* ─── Revenue and budget ─── */
.revenue-budget-card {
  min-height: 390px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  overflow: hidden;
}

.revenue-panel {
  min-width: 0;
  padding: var(--admin-card-padding);
}

.revenue-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.revenue-card-header h3 {
  margin: 0;
  color: var(--admin-text);
  font-size: 1.02rem;
  font-weight: 600;
  line-height: 1.35;
}

.revenue-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--admin-muted);
  font-size: 0.82rem;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  display: inline-block;
}

.budget-panel {
  border-left: 1px solid var(--admin-border);
  padding: var(--admin-card-padding);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  text-align: center;
}

.budget-year {
  width: 88px;
  height: 36px;
  padding-left: 12px;
  font-size: 0.84rem;
}

.budget-summary {
  display: grid;
  gap: 4px;
}

.budget-summary strong {
  color: var(--admin-text);
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 1.2;
}

.budget-summary span {
  color: var(--admin-muted);
  font-size: 0.9rem;
}

.budget-action {
  width: 100%;
  max-width: 180px;
}

/* ─── Leads ─── */
.dash-col-leads> :deep(.admin-card),
.dash-col-earning> :deep(.admin-card),
.dash-col-products> :deep(.admin-card),
.dash-col-countries> :deep(.admin-card) {
  min-height: 430px;
}

.dash-col-earning> :deep(.admin-card),
.dash-col-products> :deep(.admin-card),
.dash-col-countries> :deep(.admin-card) {
  display: flex;
  flex-direction: column;
}

.dash-col-earning> :deep(.admin-card-body),
.dash-col-products> :deep(.admin-card-body),
.dash-col-countries> :deep(.admin-card-body) {
  flex: 1;
}

.dash-col-leads> :deep(.admin-card-body) {
  container-type: inline-size;
}

.dash-col-products> :deep(.admin-card-header) {
  padding: 20px 20px 0;
  margin-bottom: 8px;
}

.card-menu-button {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: var(--admin-radius);
  background: transparent;
  color: var(--admin-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.card-menu-button:hover {
  background: var(--admin-surface-soft);
  color: var(--admin-text);
}

.card-menu-button:focus-visible,
.orders-view-link:focus-visible,
.hero-cta:focus-visible,
.budget-action:focus-visible,
.budget-year:focus-visible {
  outline: 2px solid rgba(115, 103, 240, 0.34);
  outline-offset: 2px;
}

.leads-content {
  min-height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(128px, 150px);
  gap: 18px;
  align-items: center;
}

.leads-copy {
  min-width: 0;
  display: grid;
  gap: 5px;
}

.leads-copy h3 {
  margin: 0;
  color: var(--admin-text);
  font-size: 1.02rem;
  font-weight: 500;
}

.leads-copy>span {
  color: var(--admin-muted);
  font-size: 0.88rem;
}

.leads-copy>strong {
  margin-top: 12px;
  color: var(--admin-text);
  font-size: 2rem;
  font-weight: 500;
  line-height: 1.15;
}

.leads-copy>small {
  color: var(--admin-success);
  font-size: 0.88rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.leads-copy i {
  font-size: 1rem;
}

.leads-chart {
  width: 100%;
  min-width: 0;
  max-width: 150px;
  display: grid;
  justify-items: center;
  gap: 10px;
  justify-self: end;
}

.leads-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.leads-center strong {
  font-size: 1.22rem;
  line-height: 1.1;
  color: var(--admin-text);
  font-weight: 600;
}

.leads-center small {
  color: var(--admin-success);
  font-size: 0.72rem;
  font-weight: 600;
}

.leads-mini-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 7px 10px;
  color: var(--admin-muted);
  font-size: 0.74rem;
}

.leads-mini-legend span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.leads-mini-legend i {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  display: inline-block;
}

@container (max-width: 420px) {
  .leads-content {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  .leads-copy {
    justify-items: center;
  }

  .leads-chart {
    justify-self: center;
  }
}

/* ─── Earning reports ─── */
.earning-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 22px;
}

.earning-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.earning-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--admin-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex: 0 0 auto;
}

.earning-icon.is-neutral {
  background: var(--admin-surface-soft);
  color: var(--admin-text);
}

.earning-icon.is-success {
  background: rgba(40, 199, 111, 0.14);
  color: var(--admin-success);
}

.earning-copy {
  flex: 1;
  min-width: 0;
}

.earning-copy strong {
  display: block;
  color: var(--admin-text);
  font-size: 0.92rem;
  font-weight: 600;
}

.earning-copy small {
  color: var(--admin-muted);
  font-size: 0.8rem;
}

.earning-stat {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.earning-stat strong {
  color: var(--admin-text);
  font-size: 0.95rem;
  font-weight: 500;
}

/* ─── Popular products ─── */
.popular-products-list {
  padding: 0 0 4px;
}

.popular-product-row {
  min-height: 58px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--admin-border);
  transition: background 0.15s;
}

.popular-product-row:last-child {
  border-bottom: 0;
}

.popular-product-row:hover {
  background: var(--admin-surface-soft);
}

.pp-img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  flex: 0 0 auto;
  background: var(--admin-surface-soft);
}

.pp-copy {
  flex: 1;
  min-width: 0;
}

.pp-copy strong {
  display: block;
  color: var(--admin-text);
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pp-copy small {
  color: var(--admin-muted);
  font-size: 0.8rem;
}

.pp-stat {
  text-align: right;
}

.pp-stat strong {
  display: block;
  color: var(--admin-text);
  font-size: 0.9rem;
  font-weight: 500;
}

.pp-stat small {
  color: var(--admin-muted);
  font-size: 0.78rem;
}

/* ─── Orders by countries ─── */
.country-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-bottom: 1px solid var(--admin-border);
  margin: 0 calc(var(--admin-card-padding) * -1) 20px;
  padding: 0 var(--admin-card-padding);
}

.country-tabs button {
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--admin-muted);
  font-size: 0.86rem;
  font-weight: 500;
  padding: 0 4px 12px;
  cursor: pointer;
}

.country-tabs button.is-active {
  color: var(--admin-text);
  border-bottom-color: var(--admin-text);
}

.country-tabs button:focus-visible {
  outline: 2px solid rgba(115, 103, 240, 0.34);
  outline-offset: 2px;
}

.country-timeline {
  display: grid;
  gap: 18px;
}

.country-shipment {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  column-gap: 14px;
  row-gap: 18px;
  position: relative;
}

.country-shipment::before {
  content: "";
  position: absolute;
  left: 11px;
  top: 28px;
  bottom: 28px;
  border-left: 1px dashed var(--admin-border-strong);
}

.shipment-node {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  background: var(--admin-surface);
  font-size: 0.82rem;
}

.shipment-node.is-sender {
  border: 1px solid rgba(40, 199, 111, 0.34);
  color: var(--admin-success);
}

.shipment-node.is-receiver {
  color: var(--admin-text);
}

.shipment-copy {
  min-width: 0;
  display: grid;
  gap: 3px;
}

.shipment-copy span {
  color: var(--admin-success);
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
}

.shipment-copy strong {
  color: var(--admin-text);
  font-size: 0.9rem;
  font-weight: 600;
}

.shipment-copy small {
  color: var(--admin-muted);
  font-size: 0.82rem;
  line-height: 1.35;
}

.shipment-node.is-receiver+.shipment-copy span {
  color: var(--admin-text);
}

/* ─── Transactions ─── */
.dash-col-transactions> :deep(.admin-card),
.dash-col-orders> :deep(.admin-card) {
  min-height: 470px;
}

.dash-col-orders> :deep(.admin-card) {
  display: flex;
  flex-direction: column;
}

.dash-col-orders> :deep(.admin-card-header) {
  padding: 20px 20px 0;
  margin-bottom: 14px;
}

.dash-col-orders> :deep(.admin-card-body) {
  flex: 1;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.transaction-row {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.tx-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--admin-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex: 0 0 auto;
}

.tx-icon.is-neutral {
  background: var(--admin-surface-soft);
  color: var(--admin-text);
}

.tx-icon.is-success {
  background: rgba(40, 199, 111, 0.14);
  color: var(--admin-success);
}

.tx-icon.is-info {
  background: rgba(0, 207, 232, 0.14);
  color: var(--admin-info);
}

.tx-icon.is-danger {
  background: rgba(255, 76, 81, 0.14);
  color: var(--admin-danger);
}

.tx-copy {
  flex: 1;
  min-width: 0;
}

.tx-copy strong {
  display: block;
  color: var(--admin-text);
  font-size: 0.9rem;
  font-weight: 600;
}

.tx-copy small {
  color: var(--admin-muted);
  font-size: 0.8rem;
}

.tx-amount {
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--admin-success);
  white-space: nowrap;
}

.tx-amount.is-negative {
  color: var(--admin-danger);
}

/* ─── Recent orders table ─── */
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

.orders-view-link:hover {
  color: var(--admin-primary-hover);
}

.orders-view-link i {
  font-size: 1rem;
}

.recent-orders-table-wrap {
  overflow-x: auto;
}

.recent-orders-table-wrap::-webkit-scrollbar {
  height: 8px;
}

.recent-orders-table-wrap::-webkit-scrollbar-track {
  background: transparent;
}

.recent-orders-table-wrap::-webkit-scrollbar-thumb {
  background: rgba(47, 43, 61, 0.16);
  border-radius: 999px;
}

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

.recent-orders-table tbody tr:hover {
  background: var(--admin-surface-soft);
}

.recent-orders-table tbody tr:last-child td {
  border-bottom: 0;
}

.order-link {
  color: var(--admin-text);
  font-weight: 600;
  text-decoration: none;
}

.order-link:hover {
  color: var(--admin-primary);
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
  object-fit: cover;
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

.recent-orders-table .text-end strong {
  color: var(--admin-text);
  font-weight: 600;
}

.text-end {
  text-align: right;
}

/* ─── Dashboard footer and floating actions ─── */
.dashboard-footer {
  min-height: 60px;
  margin-top: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  color: var(--admin-muted);
  font-size: 0.9rem;
}

.dashboard-footer span {
  color: var(--admin-muted);
}

.dashboard-footer nav {
  display: flex;
  align-items: center;
  gap: 22px;
}

.dashboard-footer a {
  color: var(--admin-text);
  text-decoration: none;
  font-size: 0.88rem;
  transition: color 0.18s ease;
}

.dashboard-footer a:hover,
.dashboard-footer a:focus-visible {
  color: var(--admin-primary);
}

.dashboard-floating-actions {
  position: fixed;
  right: 28px;
  bottom: 24px;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: none;
}

.dashboard-floating-actions>* {
  pointer-events: auto;
}

.dashboard-config-button,
.dashboard-top-button,
.dashboard-buy-button {
  border: 0;
  box-shadow: 0 6px 18px rgba(47, 43, 61, 0.18);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.dashboard-config-button,
.dashboard-top-button {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.dashboard-config-button {
  background: #000;
}

.dashboard-top-button {
  background: #000;
}

.dashboard-buy-button {
  min-height: 40px;
  padding: 0 20px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #28dac6;
  color: #fff;
  font-size: 0.86rem;
  font-weight: 700;
  text-decoration: none;
}

.dashboard-config-button:hover,
.dashboard-top-button:hover,
.dashboard-buy-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(47, 43, 61, 0.24);
}

.dashboard-config-button:focus-visible,
.dashboard-top-button:focus-visible,
.dashboard-buy-button:focus-visible {
  outline: 2px solid rgba(115, 103, 240, 0.4);
  outline-offset: 3px;
}

/* ─── Responsive ─── */
@media screen and (max-width: 1199.98px) {

  .dash-col-hero,
  .dash-col-stats,
  .dash-col-sm,
  .dash-col-leads,
  .dash-col-earning,
  .dash-col-countries {
    grid-column: span 6;
  }

  .dash-col-revenue-budget,
  .dash-col-products,
  .dash-col-transactions,
  .dash-col-orders {
    grid-column: span 12;
  }

  .statistics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .revenue-budget-card {
    grid-template-columns: minmax(0, 1fr) 240px;
  }
}

@media screen and (max-width: 991.98px) {

  .dash-col-hero,
  .dash-col-stats,
  .dash-col-revenue-budget,
  .dash-col-products,
  .dash-col-countries,
  .dash-col-orders {
    grid-column: span 12;
  }

  .dash-col-sm,
  .dash-col-leads,
  .dash-col-earning,
  .dash-col-transactions {
    grid-column: span 6;
  }

  .hero-card,
  .statistics-card {
    min-height: 156px;
  }

  .chart-mini-card,
  .revenue-budget-card {
    min-height: 340px;
  }

  .dash-col-leads> :deep(.admin-card),
  .dash-col-earning> :deep(.admin-card),
  .dash-col-products> :deep(.admin-card),
  .dash-col-countries> :deep(.admin-card) {
    min-height: 400px;
  }
}

@media screen and (max-width: 767.98px) {
  .dashboard-container {
    padding-bottom: 72px;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .dash-col-hero,
  .dash-col-stats,
  .dash-col-sm,
  .dash-col-revenue-budget,
  .dash-col-leads,
  .dash-col-earning,
  .dash-col-products,
  .dash-col-countries,
  .dash-col-transactions,
  .dash-col-orders {
    grid-column: 1 / -1;
  }

  /* Stats: 2x2 compact grid */
  .statistics-card {
    padding: 20px;
    gap: 18px;
  }

  .statistics-header {
    flex-direction: column;
    gap: 4px;
  }

  .statistics-grid {
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .statistics-item {
    gap: 10px;
  }

  .statistics-icon {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .statistics-copy strong {
    font-size: 1rem;
  }

  /* Hero compact */
  .hero-card {
    padding: 20px;
  }

  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .hero-cta {
    align-self: center;
  }

  .hero-title {
    font-size: 1.1rem;
  }

  .hero-value {
    font-size: 1.35rem;
  }

  .hero-visual {
    flex: 0 0 auto;
    align-self: center;
    display: flex;
  }

  .hero-trophy {
    font-size: 3rem;
    transform: none;
  }

  /* Mini chart cards compact */
  .chart-mini-card {
    min-height: 220px;
    padding: 14px 16px;
  }

  .mini-value {
    font-size: 1.2rem;
  }

  .revenue-budget-card {
    min-height: 0;
    grid-template-columns: 1fr;
  }

  .revenue-panel {
    padding: 20px;
  }

  .revenue-card-header {
    flex-direction: column;
    gap: 10px;
  }

  .budget-panel {
    border-left: 0;
    border-top: 1px solid var(--admin-border);
    padding: 20px;
  }

  .dash-col-leads> :deep(.admin-card),
  .dash-col-earning> :deep(.admin-card),
  .dash-col-products> :deep(.admin-card),
  .dash-col-countries> :deep(.admin-card),
  .dash-col-transactions> :deep(.admin-card),
  .dash-col-orders> :deep(.admin-card) {
    min-height: 0;
  }

  .leads-content {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
    gap: 18px;
  }

  .leads-copy {
    justify-items: center;
  }

  /* Earning items compact */
  .earning-item {
    gap: 10px;
  }

  .earning-icon {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  /* Popular products compact */
  .popular-product-row {
    padding: 12px 14px;
    gap: 10px;
  }

  .pp-img {
    width: 36px;
    height: 36px;
  }

  /* Countries compact */
  .country-tabs {
    margin-left: -20px;
    margin-right: -20px;
    padding: 0 20px;
  }

  .country-tabs button {
    font-size: 0.8rem;
  }

  /* Transaction compact */
  .transaction-row {
    gap: 10px;
  }

  .tx-icon {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  /* Recent orders: hide table columns, show compact */
  .dash-col-orders> :deep(.admin-card-header) {
    padding: 18px 18px 0;
  }

  .orders-view-link {
    font-size: 0.8rem;
  }

  .recent-orders-table {
    min-width: 560px;
  }

  .recent-orders-table th:nth-child(3),
  .recent-orders-table td:nth-child(3),
  .recent-orders-table th:nth-child(4),
  .recent-orders-table td:nth-child(4) {
    display: none;
  }

  .recent-orders-table th,
  .recent-orders-table td {
    padding: 10px 12px;
    font-size: 0.82rem;
  }

  .ro-avatar {
    width: 28px;
    height: 28px;
  }

  .dashboard-footer {
    min-height: 0;
    margin-top: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    font-size: 0.82rem;
  }

  .dashboard-footer nav {
    flex-wrap: wrap;
    gap: 10px 16px;
  }

  .dashboard-floating-actions {
    right: 16px;
    bottom: 16px;
    gap: 8px;
  }

  .dashboard-config-button {
    display: none;
  }

  .dashboard-buy-button {
    min-height: 36px;
    padding: 0 14px;
    font-size: 0.78rem;
  }

  .dashboard-top-button {
    width: 38px;
    height: 38px;
  }
}

@media screen and (max-width: 575.98px) {
  .dashboard-container {
    max-width: 100%;
  }

  .statistics-grid {
    grid-template-columns: 1fr;
  }

  .statistics-header span {
    white-space: normal;
  }

  .revenue-legend {
    width: 100%;
  }

  .earning-stat {
    min-width: 72px;
  }

  .pp-stat {
    min-width: 70px;
  }

  .recent-orders-table {
    min-width: 500px;
  }
}

@media (prefers-reduced-motion: reduce) {

  .dash-enter,
  .dash-col>.admin-card-shell,
  .dash-col> :deep(.admin-card),
  .popular-product-row,
  .card-menu-button {
    transition: none;
  }

  .dash-enter,
  .dash-enter.is-visible,
  .dash-col>.admin-card-shell:hover,
  .dash-col> :deep(.admin-card):hover,
  .dashboard-config-button:hover,
  .dashboard-top-button:hover,
  .dashboard-buy-button:hover {
    transform: none;
  }
}
</style>
