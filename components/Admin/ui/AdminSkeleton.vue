<template>
  <div class="admin-skeleton" :class="variantClass" :style="skeletonStyle" aria-hidden="true"></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  width: {
    type: [String, Number],
    default: '100%',
  },
  height: {
    type: [String, Number],
    default: 16,
  },
  radius: {
    type: [String, Number],
    default: 6,
  },
  variant: {
    type: String,
    default: 'block',
    validator: (value) => ['block', 'circle'].includes(value),
  },
})

const formatSize = (value) => (typeof value === 'number' ? `${value}px` : value)

const skeletonStyle = computed(() => ({
  width: formatSize(props.width),
  height: formatSize(props.height),
  borderRadius: props.variant === 'circle' ? '999px' : formatSize(props.radius),
}))

const variantClass = computed(() => `is-${props.variant}`)
</script>

<style scoped>
.admin-skeleton {
  background: linear-gradient(90deg, #eeeeef 25%, #f7f7f8 37%, #eeeeef 63%);
  background-size: 400% 100%;
  animation: admin-skeleton-loading 1.2s ease infinite;
}

@keyframes admin-skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
