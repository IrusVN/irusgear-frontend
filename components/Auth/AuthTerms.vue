<template>
  <div class="text-center mt-4">
    <p class="small text-muted">
      {{ text }}
      <NuxtLink to="/support" class="text-dark">{{ $t('auth.login.terms_of_service') }}</NuxtLink> 
      {{ $t('auth.login.and') }} 
      <NuxtLink to="/support" class="text-dark">{{ $t('auth.login.privacy_policy') }}</NuxtLink>.
    </p>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, default: '' }
})
</script>
