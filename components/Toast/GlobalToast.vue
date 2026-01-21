<template>
  <div class="notification" :class="`notification--${type}`">
    <div class="notification__body">
      <img :src="icon" :alt="type" class="notification__icon" aria-hidden="true" />
      <span class="notification__message">{{ message }}</span>
    </div>
    <div class="notification__progress"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'info',
  },
})

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return '/image/toast/check-circle.svg'
    case 'error':
      return '/image/toast/cross-circle.svg'
    case 'warning':
      return '/image/toast/warning-triangle.svg'
    default:
      return '/image/toast/info-circle.svg'
  }
})
</script>
