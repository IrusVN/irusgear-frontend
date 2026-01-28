<template>
  <form class="auth-form d-flex flex-column gap-3" @submit.prevent="$emit('submit')">
    <slot />
    
    <!-- Submit Button -->
    <button type="submit" class="btn-submit btn btn-lg rounded-3 fw-semibold" :disabled="loading">
      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
      {{ submitText }}
    </button>
  </form>
</template>

<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  submitText: { type: String, default: 'Submit' }
})

defineEmits(['submit'])
</script>

<style scoped>
.btn-submit {
  background: #000;
  color: #fff;
  border: none;
  padding: 14px;
  margin-top: 8px;
  transition: all 0.2s ease;
}

.btn-submit:hover:not(:disabled) {
  background: #222;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-submit:disabled {
  opacity: 0.7;
  background: #000;
}
</style>
