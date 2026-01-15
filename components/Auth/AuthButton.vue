<template>
  <button
    :type="type"
    :class="['btn w-100 py-3 rounded-pill fw-semibold', variantClass]"
    :disabled="loading || disabled"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const variantClass = computed(() => props.variant === 'secondary' ? 'btn-outline-dark' : 'btn-dark')
</script>
