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
  datasets: {
    type: Array,
    default: () => [],
  },
  height: {
    type: String,
    default: '320px',
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})

const canvas = ref(null)
let chart = null

const defaultDatasets = () => [
  {
    label: 'Value',
    data: [],
    backgroundColor: '#000',
    borderRadius: 8,
    barThickness: 10,
  },
]

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
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: props.datasets.length ? props.datasets : defaultDatasets(),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true, labels: { usePointStyle: true, boxWidth: 8 } } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' } },
      },
      ...props.options,
    },
  })
}

onMounted(renderChart)
onBeforeUnmount(destroyChart)
watch(() => [props.labels, props.datasets, props.options], renderChart, { deep: true })
</script>

<style scoped>
.admin-chart {
  position: relative;
  width: 100%;
}
</style>
