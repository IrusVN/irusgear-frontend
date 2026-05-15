<template>
  <div class="admin-chart" :style="{ height }">
    <canvas ref="canvas"></canvas>
    <div v-if="$slots.center" class="chart-center">
      <slot name="center" />
    </div>
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
  colors: {
    type: Array,
    default: () => ['#28c76f', '#dff7ea', '#00cfe8', '#ff9f43'],
  },
  cutout: {
    type: String,
    default: '72%',
  },
  height: {
    type: String,
    default: '220px',
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
    type: 'doughnut',
    data: {
      labels: props.labels,
      datasets: [
        {
          data: props.data,
          backgroundColor: props.colors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: props.cutout,
      plugins: { legend: { display: false } },
      ...props.options,
    },
  })
}

onMounted(renderChart)
onBeforeUnmount(destroyChart)
watch(() => [props.labels, props.data, props.colors, props.options], renderChart, { deep: true })
</script>

<style scoped>
.admin-chart {
  position: relative;
  width: 100%;
}

.chart-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  text-align: center;
}
</style>
