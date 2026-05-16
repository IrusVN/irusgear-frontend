<template>
  <div class="admin-chart" :style="{ height }">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  labels: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '#00cfe8',
  },
  height: {
    type: String,
    default: '280px',
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})

const canvas = ref(null)
let chart = null

const destroyChart = () => {
  if (chart) {
    chart.destroy()
    chart = null
  }
}

const renderChart = async () => {
  if (!import.meta.client || !canvas.value) return
  const Chart = (await import('chart.js/auto')).default
  destroyChart()
  chart = new Chart(canvas.value, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: props.label,
          data: props.data,
          borderColor: props.color,
          backgroundColor: `${props.color}22`,
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      },
      ...props.options,
    },
  })
}

onMounted(renderChart)
onBeforeUnmount(destroyChart)
watch(() => [props.labels, props.data, props.options], renderChart, { deep: true })
</script>

<style scoped>
.admin-chart {
  position: relative;
  width: 100%;
}
</style>
