<template>
  <div class="shipper-earnings">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('shipper.earnings.title') }}</h1>
        <p class="page-sub">{{ t('shipper.earnings.subtitle') }}</p>
      </div>
      <select class="admin-control" v-model="range">
        <option value="7">{{ t('shipper.dashboard.earningsChart.last7Days') }}</option>
        <option value="30">{{ t('shipper.dashboard.earningsChart.last30Days') }}</option>
      </select>
    </div>

    <div class="metric-strip">
      <AdminMetricCard :label="t('shipper.earnings.totalLifetime')"
        :value="formatMoney(stats.lifetime)" icon="bi-wallet2" variant="success" />
      <AdminMetricCard :label="t('shipper.earnings.thisMonth')"
        :value="formatMoney(stats.thisMonth)" icon="bi-calendar-month" variant="info" />
      <AdminMetricCard :label="t('shipper.earnings.today')"
        :value="formatMoney(stats.today)" icon="bi-cash-coin" variant="warning" />
    </div>

    <AdminCard :title="t('shipper.earnings.chartTitle')" :subtitle="t('shipper.earnings.chartSubtitle')">
      <ClientOnly>
        <AdminLineChart :labels="chart.labels" :data="chart.data"
          :label="t('shipper.earnings.title')" color="#28c76f" height="320px" />
      </ClientOnly>
    </AdminCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n, useHead } from '#imports'
import AdminCard from '@/components/Admin/ui/AdminCard.vue'
import AdminMetricCard from '@/components/Admin/ui/AdminMetricCard.vue'
import AdminLineChart from '@/components/Admin/charts/AdminLineChart.vue'

definePageMeta({ layout: 'shipper' })
const { t } = useI18n()
useHead({ title: () => `${t('shipper.earnings.title')} – IrusGear Shipper` })

const range = ref('7')

const stats = ref({
  lifetime: 18450000,
  thisMonth: 4280000,
  today: 540000,
})

const chart = ref({
  labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  data: [320000, 480000, 410000, 680000, 540000, 720000, 540000],
})

const formatMoney = (n) => `${new Intl.NumberFormat('vi-VN').format(n || 0)}đ`
</script>

<style scoped>
.shipper-earnings {
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

.metric-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--admin-dashboard-gap);
  margin-bottom: var(--admin-dashboard-gap);
}

@media screen and (max-width: 991.98px) {
  .metric-strip { grid-template-columns: 1fr 1fr; }
}

@media screen and (max-width: 767.98px) {
  .shipper-earnings { padding-bottom: 80px; }
  .page-title { font-size: 1.18rem; }
  .metric-strip { grid-template-columns: 1fr 1fr; gap: 12px; }
  .page-header { flex-direction: column; align-items: stretch; }
  .page-header .admin-control { width: 100%; }
}

@media screen and (max-width: 480px) {
  .metric-strip { grid-template-columns: 1fr; }
}
</style>
