<template>
  <div class="sales-chart bg-white rounded-3 p-4 border">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="fw-bold mb-0">{{ $t('dashboard.salesChart.title') }}</h5>
      <div class="btn-group btn-group-sm" role="group">
        <button type="button" class="btn btn-outline-secondary" :class="{ active: period === '7d' }" @click="period = '7d'">7 ngày</button>
        <button type="button" class="btn btn-outline-secondary" :class="{ active: period === '30d' }" @click="period = '30d'">30 ngày</button>
        <button type="button" class="btn btn-outline-secondary" :class="{ active: period === '12m' }" @click="period = '12m'">12 tháng</button>
      </div>
    </div>

    <div class="chart-container" style="height: 300px;">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useDashboard } from '~/composables/useDashboard'

const chartCanvas = ref<HTMLCanvasElement | null>(null)
const period = ref<'7d' | '30d' | '12m'>('12m')
let chartInstance: any = null

const { salesData, fetchSalesData, loading } = useDashboard()

onMounted(async () => {
  await fetchSalesData()
  initChart()
})

const initChart = async () => {
  if (typeof window === 'undefined' || !salesData.value || !chartCanvas.value) return
  
  const Chart = (await import('chart.js/auto')).default
  
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return
  
  const currentData = salesData.value[period.value]

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: currentData.labels,
      datasets: [{
        label: 'Doanh thu (triệu VNĐ)',
        data: currentData.data,
        borderColor: 'rgb(13, 110, 253)',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(13, 110, 253)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function(context: any) {
              return context.parsed.y + ' triệu VNĐ'
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            callback: function(value: any) {
              return value + 'M'
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
}

watch(period, () => {
  initChart()
})
</script>

<style scoped>
.chart-container {
  position: relative;
}

.btn-group .btn.active {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}
</style>
