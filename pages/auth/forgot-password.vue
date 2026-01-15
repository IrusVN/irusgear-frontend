<template>
  <AuthCard>
    <!-- Back Button -->
    <NuxtLink to="/auth/login" class="d-inline-flex align-items-center gap-2 text-muted text-decoration-none mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
      </svg>
      {{ $t('auth.forgot_password.back_to_login') }}
    </NuxtLink>

    <AuthHeader
      :title="$t('auth.forgot_password.title')"
      :description="$t('auth.forgot_password.description')"
    />

    <!-- Success Message -->
    <div v-if="emailSent" class="text-center py-4">
      <div class="text-success mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <h2 class="h4 fw-bold mb-2">{{ $t('auth.forgot_password.success.title') }}</h2>
      <p class="text-muted small mb-3">
        {{ $t('auth.forgot_password.success.message_start') }} <strong class="text-dark">{{ email }}</strong>. 
        {{ $t('auth.forgot_password.success.message_end') }}
      </p>
      <AuthButton variant="secondary" @click="resetForm">{{ $t('auth.forgot_password.send_different_email') }}</AuthButton>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleForgotPassword">
      <AuthInput v-model="email" type="email" :placeholder="$t('form.email')" required>
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </template>
      </AuthInput>

      <AuthButton type="submit" :loading="loading">{{ $t('buttons.send_reset_link') }}</AuthButton>
    </form>

    <div v-if="!emailSent" class="text-center mt-4">
      <p class="text-muted small">
        {{ $t('auth.forgot_password.remember_password') }} 
        <NuxtLink to="/auth/login" class="text-dark fw-semibold text-decoration-none">{{ $t('auth.forgot_password.sign_in') }}</NuxtLink>
      </p>
    </div>
  </AuthCard>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const loading = ref(false)
const emailSent = ref(false)

const handleForgotPassword = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    emailSent.value = true
  } catch (error) {
    console.error('Forgot password error:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  email.value = ''
  emailSent.value = false
}
</script>
