<template>
  <Transition name="fade-slide">
    <div v-if="show" class="auth-success text-center py-4">
      <div class="success-icon d-inline-flex align-items-center justify-content-center rounded-circle mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <h2 class="fw-bold fs-5 mb-2">{{ title }}</h2>
      <p class="text-secondary mb-3">
        <slot />
      </p>
      <button class="btn btn-outline-dark rounded-3 px-4" @click="$emit('reset')">
        {{ buttonText }}
      </button>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' },
  buttonText: { type: String, default: '' }
})

defineEmits(['reset'])
</script>

<style scoped>
.success-icon {
  width: 64px;
  height: 64px;
  background: rgba(25, 135, 84, 0.1);
  color: #198754;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
