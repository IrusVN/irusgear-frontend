<template>
  <label class="auth-checkbox d-flex align-items-center gap-2 small text-secondary">
    <input 
      type="checkbox" 
      class="form-check-input m-0"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    >
    <slot />
  </label>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.auth-checkbox {
  cursor: pointer;
}

.form-check-input:checked {
  background-color: #000;
  border-color: #000;
}
</style>
