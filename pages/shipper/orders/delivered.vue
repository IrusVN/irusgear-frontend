<template>
  <div class="shipper-orders">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('shipper.delivered.title') }}</h1>
        <p class="page-sub">{{ t('shipper.delivered.subtitle', { count: orders.length }) }}</p>
      </div>
      <div class="filter-group">
        <select class="admin-control" v-model="filterRange">
          <option value="7">{{ t('shipper.delivered.last7') }}</option>
          <option value="30">{{ t('shipper.delivered.last30') }}</option>
          <option value="90">{{ t('shipper.delivered.last90') }}</option>
        </select>
      </div>
    </div>

    <div class="metric-strip">
      <AdminMetricCard :label="t('shipper.metrics.delivered')" :value="String(orders.length)"
        icon="bi-check2-circle" variant="success" />
      <AdminMetricCard :label="t('shipper.metrics.totalFee')" :value="formatMoney(totalFee)"
        icon="bi-cash-coin" variant="success" />
      <AdminMetricCard :label="t('shipper.metrics.successRate')" value="98.4%"
        icon="bi-graph-up" variant="info" />
    </div>

    <div class="admin-card-shell table-card">
      <table class="recent-orders-table">
        <thead>
          <tr>
            <th>{{ t('shipper.dashboard.table.order') }}</th>
            <th>{{ t('shipper.dashboard.table.customer') }}</th>
            <th>{{ t('shipper.dashboard.table.address') }}</th>
            <th>{{ t('shipper.delivered.deliveredAt') }}</th>
            <th class="text-end">{{ t('shipper.dashboard.table.fee') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td><strong>{{ order.orderCode }}</strong></td>
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
            <td>{{ formatDate(order.deliveredAt) }}</td>
            <td class="text-end"><strong>{{ formatMoney(order.shippingFee) }}</strong></td>
          </tr>
          <tr v-if="!orders.length">
            <td colspan="5" class="empty-row">{{ t('shipper.delivered.empty') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n, useHead } from '#imports'
import AdminMetricCard from '@/components/Admin/ui/AdminMetricCard.vue'

definePageMeta({ layout: 'shipper' })
const { t } = useI18n()
useHead({ title: () => `${t('shipper.delivered.title')} – IrusGear Shipper` })

const filterRange = ref('7')

const orders = ref([
  {
    id: 101,
    orderCode: '#ORD2300',
    customer: { name: 'Vũ Thị E', phone: '0945 678 901' },
    address: '12 Hai Bà Trưng, Quận 1, TP HCM',
    deliveredAt: '2026-05-16T14:32:00',
    shippingFee: 35000,
  },
  {
    id: 102,
    orderCode: '#ORD2301',
    customer: { name: 'Hoàng Văn F', phone: '0967 890 123' },
    address: '88 Lý Thường Kiệt, Quận 10, TP HCM',
    deliveredAt: '2026-05-16T11:10:00',
    shippingFee: 40000,
  },
  {
    id: 103,
    orderCode: '#ORD2302',
    customer: { name: 'Đỗ Minh G', phone: '0978 901 234' },
    address: '301 Điện Biên Phủ, Bình Thạnh, TP HCM',
    deliveredAt: '2026-05-15T16:45:00',
    shippingFee: 30000,
  },
])

const totalFee = computed(() => orders.value.reduce((s, o) => s + (o.shippingFee || 0), 0))

const formatMoney = (n) => `${new Intl.NumberFormat('vi-VN').format(n || 0)}đ`

const initials = (name) =>
  (name || '?').split(' ').filter(Boolean).slice(-2).map((p) => p.charAt(0).toUpperCase()).join('')

const formatDate = (d) => {
  const dt = new Date(d)
  return dt.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.shipper-orders {
  width: 100%;
  max-width: 1540px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 22px;
}

.page-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--admin-text);
}

.page-sub {
  margin: 4px 0 0;
  color: var(--admin-muted);
  font-size: 0.9rem;
}

.filter-group .admin-control { min-width: 160px; }

.metric-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--admin-dashboard-gap);
  margin-bottom: var(--admin-dashboard-gap);
}

.table-card {
  overflow-x: auto;
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

.recent-orders-table tbody tr:hover { background: var(--admin-surface-soft); }
.recent-orders-table tbody tr:last-child td { border-bottom: 0; }

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

@media screen and (max-width: 991.98px) {
  .metric-strip { grid-template-columns: 1fr 1fr; }
}

@media screen and (max-width: 767.98px) {
  .shipper-orders { padding-bottom: 80px; }
  .page-title { font-size: 1.18rem; }
  .metric-strip { grid-template-columns: 1fr 1fr; gap: 12px; }
  .recent-orders-table th:nth-child(3),
  .recent-orders-table td:nth-child(3),
  .recent-orders-table th:nth-child(4),
  .recent-orders-table td:nth-child(4) {
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
