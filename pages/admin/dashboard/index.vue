<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="mb-4">
      <h2 class="fw-bold mb-1">{{ $t('dashboard.welcome') }}, Admin 👋</h2>
      <p class="text-muted">{{ $t('dashboard.overview') }}</p>
    </div>

    <!-- Stats Cards -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else class="row g-4 mb-4">
      <div class="col-12 col-sm-6 col-xl-3">
        <StatCard
          :title="$t('dashboard.stats.totalRevenue')"
          :value="stats ? formatRevenue(stats.totalRevenue) : '0'"
          :subtitle="$t('dashboard.stats.vsLastMonth')"
          icon="bi-currency-dollar"
          color="primary"
          :trend="stats && stats.revenueChange > 0 ? 'up' : 'down'"
          :percentage="stats ? Math.abs(stats.revenueChange).toFixed(1) : '0'"
        />
      </div>
      <div class="col-12 col-sm-6 col-xl-3">
        <StatCard
          :title="$t('dashboard.stats.totalOrders')"
          :value="stats ? stats.totalOrders.toLocaleString() : '0'"
          :subtitle="$t('dashboard.stats.vsLastMonth')"
          icon="bi-cart3"
          color="success"
          :trend="stats && stats.ordersChange > 0 ? 'up' : 'down'"
          :percentage="stats ? Math.abs(stats.ordersChange).toFixed(1) : '0'"
        />
      </div>
      <div class="col-12 col-sm-6 col-xl-3">
        <StatCard
          :title="$t('dashboard.stats.totalCustomers')"
          :value="stats ? stats.totalCustomers.toLocaleString() : '0'"
          :subtitle="$t('dashboard.stats.vsLastMonth')"
          icon="bi-people"
          color="info"
          :trend="stats && stats.customersChange > 0 ? 'up' : 'down'"
          :percentage="stats ? Math.abs(stats.customersChange).toFixed(1) : '0'"
        />
      </div>
      <div class="col-12 col-sm-6 col-xl-3">
        <StatCard
          :title="$t('dashboard.stats.totalProducts')"
          :value="stats ? stats.totalProducts.toString() : '0'"
          :subtitle="$t('dashboard.stats.vsLastMonth')"
          icon="bi-box-seam"
          color="warning"
          :trend="stats && stats.productsChange > 0 ? 'up' : 'down'"
          :percentage="stats ? Math.abs(stats.productsChange).toFixed(1) : '0'"
        />
      </div>
    </div>

    <!-- Sales Chart -->
    <div class="row g-4 mb-4">
      <div class="col-12">
        <SalesChart />
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="row g-4 mb-4">
      <div class="col-12">
        <RecentOrders />
      </div>
    </div>

    <!-- Top Products -->
    <div class="row g-4">
      <div class="col-12">
        <TopProducts />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useI18n, useHead } from "#imports";
import { useDashboard } from '~/composables/useDashboard'
import StatCard from '@/components/Dashboard/StatCard.vue'
import SalesChart from '@/components/Dashboard/SalesChart.vue'
import TopProducts from '@/components/Dashboard/TopProducts.vue'
import RecentOrders from '@/components/Dashboard/RecentOrders.vue'

definePageMeta({
  layout: 'admin',
});

const { t } = useI18n();
useHead({ title: computed(() => t('page_titles.dashboard')) });

const { stats, fetchStats, loading } = useDashboard()

onMounted(() => {
  fetchStats()
})

// Format số tiền
const formatRevenue = (revenue: number) => {
  return (revenue / 1000000000).toFixed(1) + ' tỷ'
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
}
</style>
