<template>
  <div class="analytics-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h2 class="page-title">Analytics</h2>
        <p class="page-sub">Store performance overview and insights</p>
      </div>
      <div class="period-select">
        <select v-model="period" class="admin-control">
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div v-for="kpi in kpis" :key="kpi.label" class="kpi-card admin-card-shell">
        <div class="kpi-icon" :class="`kpi-${kpi.variant}`"><i class="bi" :class="kpi.icon"></i></div>
        <div class="kpi-body">
          <small>{{ kpi.label }}</small>
          <strong>{{ kpi.value }}</strong>
          <span class="kpi-change" :class="kpi.changeVal >= 0 ? 'positive' : 'negative'">
            <i class="bi" :class="kpi.changeVal >= 0 ? 'bi-arrow-up-short' : 'bi-arrow-down-short'"></i>
            {{ Math.abs(kpi.changeVal) }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Charts Row 1 -->
    <div class="charts-row">
      <!-- Revenue Trend -->
      <div class="admin-card-shell chart-card chart-card-wide">
        <h3 class="card-title">Revenue Trend</h3>
        <canvas ref="revenueChart"></canvas>
      </div>
      <!-- Category Split -->
      <div class="admin-card-shell chart-card">
        <h3 class="card-title">Sales by Category</h3>
        <canvas ref="categoryChart"></canvas>
      </div>
    </div>

    <!-- Charts Row 2 -->
    <div class="charts-row">
      <!-- Conversion Funnel -->
      <div class="admin-card-shell chart-card">
        <h3 class="card-title">Conversion Funnel</h3>
        <div class="funnel">
          <div v-for="(step, i) in funnelData" :key="step.label" class="funnel-step">
            <div class="funnel-bar-track">
              <div class="funnel-bar" :style="{ width: step.pct + '%', background: funnelColors[i] }"></div>
            </div>
            <div class="funnel-info">
              <span class="funnel-label">{{ step.label }}</span>
              <strong>{{ step.value.toLocaleString() }}</strong>
              <small>{{ step.pct }}%</small>
            </div>
          </div>
        </div>
      </div>
      <!-- Returning Customer Rate -->
      <div class="admin-card-shell chart-card">
        <h3 class="card-title">Returning Customers</h3>
        <canvas ref="returningChart"></canvas>
        <div class="donut-legend">
          <div class="legend-item"><span class="legend-dot" style="background:#6c63ff"></span> Returning (64%)</div>
          <div class="legend-item"><span class="legend-dot" style="background:#d5d5da"></span> New (36%)</div>
        </div>
      </div>
    </div>

    <!-- Top Products Table -->
    <div class="admin-card-shell section-card">
      <h3 class="card-title">Top Performing Products</h3>
      <div class="mini-table-scroll">
        <table class="mini-table">
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align:center">Units Sold</th>
              <th style="text-align:right">Revenue</th>
              <th style="text-align:center">Conversion</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in topProducts" :key="p.name">
              <td><strong>{{ p.name }}</strong></td>
              <td style="text-align:center">{{ p.sold }}</td>
              <td style="text-align:right">{{ formatCurrency(p.revenue) }}</td>
              <td style="text-align:center">
                <span class="conv-badge" :class="p.conv >= 4 ? 'high' : p.conv >= 2 ? 'mid' : 'low'">{{ p.conv }}%</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '#imports'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Analytics – IrusGear Admin' })

const period = ref('30d')

const revenueChart = ref(null)
const categoryChart = ref(null)
const returningChart = ref(null)

const kpis = [
  { label: 'Total Revenue', value: '₫674.3M', icon: 'bi-cash-stack', variant: 'success', changeVal: 12.4 },
  { label: 'Total Orders', value: '21,000', icon: 'bi-bag-check', variant: 'info', changeVal: 8.2 },
  { label: 'Avg Order Value', value: '₫32.1K', icon: 'bi-receipt', variant: 'warning', changeVal: 3.5 },
  { label: 'Conversion Rate', value: '3.8%', icon: 'bi-funnel', variant: 'neutral', changeVal: -0.4 },
]

const funnelData = [
  { label: 'Visits', value: 58200, pct: 100 },
  { label: 'Product Views', value: 32400, pct: 55.7 },
  { label: 'Add to Cart', value: 8100, pct: 13.9 },
  { label: 'Checkout', value: 3200, pct: 5.5 },
  { label: 'Purchase', value: 2210, pct: 3.8 },
]
const funnelColors = ['#6c63ff', '#7c74ff', '#a09aff', '#c5c1ff', '#e3e0ff']

const topProducts = [
  { name: 'iPhone 15 Pro Max', sold: 342, revenue: 14730000 * 342, conv: 5.2 },
  { name: 'MacBook Pro M3', sold: 128, revenue: 52990000 * 128, conv: 4.1 },
  { name: 'AirPods Pro 2', sold: 876, revenue: 6290000 * 876, conv: 7.8 },
  { name: 'iPad Air M2', sold: 215, revenue: 18990000 * 215, conv: 3.3 },
  { name: 'Apple Watch Ultra 2', sold: 189, revenue: 22490000 * 189, conv: 2.9 },
]

const formatCurrency = (n) => {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B ₫'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M ₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

onMounted(async () => {
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)

  const gridColor = 'rgba(0,0,0,0.04)'
  const fontColor = '#7b7b88'

  // Revenue Trend (Line)
  new Chart(revenueChart.value, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Revenue',
        data: [42, 56, 47, 63, 58, 72, 68, 75, 82, 78, 85, 92],
        borderColor: '#6c63ff',
        backgroundColor: 'rgba(108,99,255,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#6c63ff',
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: fontColor, font: { size: 11 } } },
        y: { grid: { color: gridColor }, ticks: { color: fontColor, font: { size: 11 } }, beginAtZero: true },
      },
    },
  })

  // Category Split (Doughnut)
  new Chart(categoryChart.value, {
    type: 'doughnut',
    data: {
      labels: ['Smartphones', 'Laptops', 'Accessories', 'Tablets', 'Wearables'],
      datasets: [{
        data: [38, 24, 18, 12, 8],
        backgroundColor: ['#6c63ff', '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyle: 'circle', font: { size: 12 }, color: fontColor } },
      },
    },
  })

  // Returning Customers (Doughnut)
  new Chart(returningChart.value, {
    type: 'doughnut',
    data: {
      labels: ['Returning', 'New'],
      datasets: [{
        data: [64, 36],
        backgroundColor: ['#6c63ff', '#d5d5da'],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: { legend: { display: false } },
    },
  })
})
</script>

<style scoped>
.analytics-page { max-width: 1560px; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.page-title { margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--admin-text); }
.page-sub { margin: 4px 0 0; color: var(--admin-muted); font-size: 0.86rem; }
.period-select { min-width: 160px; }

/* KPI */
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 20px; }
.kpi-card { padding: 20px; display: flex; align-items: center; gap: 16px; }
.kpi-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex: 0 0 auto; }
.kpi-success { background: rgba(40,199,111,0.14); color: var(--admin-success); }
.kpi-info { background: rgba(0,207,232,0.14); color: #00a9c0; }
.kpi-warning { background: rgba(255,159,67,0.17); color: #ff8a00; }
.kpi-neutral { background: var(--admin-surface-soft); color: var(--admin-muted); }
.kpi-body { min-width: 0; }
.kpi-body small { display: block; font-size: 0.78rem; color: var(--admin-muted); margin-bottom: 2px; }
.kpi-body strong { font-size: 1.2rem; color: var(--admin-text); }
.kpi-change { font-size: 0.78rem; font-weight: 700; margin-left: 6px; }
.kpi-change.positive { color: var(--admin-success); }
.kpi-change.negative { color: var(--admin-danger); }

/* Charts */
.charts-row { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; margin-bottom: 20px; }
.chart-card { padding: 22px; }
.chart-card canvas { width: 100% !important; height: 260px !important; }
.card-title { margin: 0 0 16px; font-size: 1rem; font-weight: 700; color: var(--admin-text); }

/* Funnel */
.funnel { display: flex; flex-direction: column; gap: 12px; }
.funnel-step { display: flex; align-items: center; gap: 14px; }
.funnel-bar-track { flex: 1; height: 18px; border-radius: 999px; background: var(--admin-surface-soft); overflow: hidden; }
.funnel-bar { height: 100%; border-radius: 999px; transition: width 0.6s ease; }
.funnel-info { display: flex; align-items: center; gap: 8px; min-width: 200px; }
.funnel-label { font-size: 0.84rem; color: var(--admin-muted); min-width: 90px; }
.funnel-info strong { font-size: 0.9rem; color: var(--admin-text); }
.funnel-info small { color: var(--admin-muted); font-size: 0.78rem; }

/* Donut legend */
.donut-legend { display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 14px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.84rem; color: var(--admin-muted); }
.legend-dot { width: 10px; height: 10px; border-radius: 999px; }

/* Top Products */
.section-card { padding: 22px; }
.mini-table-scroll { overflow-x: auto; }
.mini-table { width: 100%; border-collapse: collapse; }
.mini-table th, .mini-table td { padding: 12px 14px; border-bottom: 1px solid var(--admin-border); vertical-align: middle; }
.mini-table th { font-size: 0.76rem; font-weight: 800; text-transform: uppercase; color: #4b4b59; }
.mini-table td { font-size: 0.88rem; color: #696977; }
.mini-table tbody tr:last-child td { border-bottom: 0; }
.conv-badge { padding: 3px 10px; border-radius: 5px; font-size: 0.82rem; font-weight: 700; }
.conv-badge.high { background: rgba(40,199,111,0.14); color: var(--admin-success); }
.conv-badge.mid { background: rgba(255,159,67,0.14); color: #ff8a00; }
.conv-badge.low { background: rgba(255,76,81,0.14); color: var(--admin-danger); }

/* Responsive */
@media screen and (max-width: 1199.98px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } .charts-row { grid-template-columns: 1fr; } }
@media screen and (max-width: 767.98px) {
  .kpi-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  .kpi-card { padding: 14px; gap: 10px; }
  .kpi-icon { width: 40px; height: 40px; font-size: 1.1rem; }
  .kpi-body strong { font-size: 1.05rem; }
  .charts-row { gap: 12px; margin-bottom: 12px; }
  .chart-card { padding: 16px; }
  .chart-card canvas { height: 200px !important; }
  .card-title { font-size: 0.92rem; margin-bottom: 12px; }
  .funnel-info { min-width: 140px; gap: 6px; }
  .funnel-label { min-width: 70px; font-size: 0.78rem; }
  .section-card { padding: 14px; }
  .mini-table th:nth-child(4),
  .mini-table td:nth-child(4) { display: none; }
  .mini-table th, .mini-table td { padding: 10px 10px; font-size: 0.82rem; }
  .page-header { margin-bottom: 16px; }
  .period-select { min-width: 130px; }
}
</style>
