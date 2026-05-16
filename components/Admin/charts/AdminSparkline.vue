<template>
  <div class="admin-sparkline" :style="{ height }">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  color: {
    type: String,
    default: '#00cfe8',
  },
  height: {
    type: String,
    default: '72px',
  },
  fill: {
    type: Boolean,
    default: false,
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
      labels: props.data.map((_, index) => index + 1),
      datasets: [
        {
          data: props.data,
          borderColor: props.color,
          backgroundColor: `${props.color}22`,
          borderWidth: 2,
          tension: 0.45,
          fill: props.fill,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      elements: { line: { borderCapStyle: 'round' } },
    },
  })
}

onMounted(renderChart)
onBeforeUnmount(destroyChart)
watch(() => [props.data, props.color, props.fill], renderChart, { deep: true })
</script>

<style scoped>
.admin-sparkline {
  position: relative;
  width: 100%;
}
</style>
