<template>
  <div class="social-login text-center">
    <p class="text-secondary small mb-3">{{ text }}</p>
    <div class="d-flex justify-content-center gap-3">
      <button 
        v-for="provider in providers" 
        :key="provider.name"
        class="social-btn btn rounded-3 d-flex align-items-center justify-content-center"
        :aria-label="provider.name"
        @click="$emit('social-login', provider.name)"
      >
        <component :is="provider.icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import GoogleLogo from '@/components/Icons/Logo/GoogleLogo.vue'
import FacebookLogo from '@/components/Icons/Logo/FacebookLogo.vue'

defineProps({
  text: {
    type: String,
    default: 'Or continue with'
  }
})

defineEmits(['social-login'])

const providers = [
  { name: 'Google', icon: GoogleLogo },
  { name: 'Facebook', icon: FacebookLogo }
]
</script>

<style scoped>
.social-btn {
  width: 52px;
  height: 52px;
  border: 1px solid #e0e0e0;
  background: #fff;
  transition: all 0.2s ease;
}

.social-btn:hover {
  border-color: #000;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
