<template>
  <div class="mb-3">
    <div class="input-group">
      <span class="input-group-text bg-light border-end-0">
        <slot name="icon" />
      </span>
      <input
        :type="computedType"
        class="form-control bg-light border-start-0 py-3"
        :placeholder="placeholder"
        :value="modelValue"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button
        v-if="type === 'password'"
        type="button"
        class="btn btn-light border border-start-0"
        @click="togglePassword"
      >
        <!-- Eye Open -->
        <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <!-- Eye Closed -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
          <line x1="2" x2="22" y1="2" y2="22"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])

const showPassword = ref(false)
const computedType = computed(() => props.type === 'password' ? (showPassword.value ? 'text' : 'password') : props.type)
const togglePassword = () => { showPassword.value = !showPassword.value }
</script>

<style scoped>
.input-group-text { color: #999; }
.form-control:focus { box-shadow: none; border-color: #1a1a1a; }
</style>
