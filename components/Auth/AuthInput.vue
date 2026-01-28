<template>
  <div class="auth-input-wrapper position-relative">
    <input
      :type="computedType"
      class="auth-input form-control form-control-lg"
      :class="{ 'is-invalid': error, 'pe-5': type === 'password' }"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    />
    <button
      v-if="type === 'password'"
      type="button"
      class="password-toggle btn position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent pe-3"
      @click="toggleShow"
    >
      <ShowEye v-if="!showPassword" />
      <HideEye v-else />
    </button>
    <div v-if="error" class="error-text small mt-1">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ShowEye from '@/components/Icons/ShowEye.vue'
import HideEye from '@/components/Icons/HideEye.vue'

const props = defineProps({
  modelValue: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  error: String
})

defineEmits(['update:modelValue', 'blur'])

const showPassword = ref(false)

const toggleShow = () => {
  showPassword.value = !showPassword.value
}

const computedType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})
</script>

<style scoped>
.auth-input {
  padding: 14px 18px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  background: #fafafa;
  transition: all 0.2s ease;
}

.auth-input:focus {
  background: #fff;
  border-color: #000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.auth-input::placeholder {
  color: #999;
}

.auth-input.is-invalid {
  border-color: #dc3545;
}

.password-toggle {
  color: #666;
  padding: 4px;
}

.password-toggle:hover {
  color: #000;
}

.error-text {
  color: #dc3545;
  padding-left: 4px;
}
</style>
