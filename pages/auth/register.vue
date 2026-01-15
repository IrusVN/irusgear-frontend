<template>
  <AuthCard>
    <AuthHeader
      :title="$t('auth.register.title')"
      :subtitle="$t('auth.register.already_have_account')"
      :link-text="$t('auth.register.sign_in')"
      link-to="/auth/login"
    />

    <form @submit.prevent="handleRegister">
      <AuthInput v-model="fullName" type="text" :placeholder="$t('form.full_name')" required>
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/>
          </svg>
        </template>
      </AuthInput>

      <AuthInput v-model="email" type="email" :placeholder="$t('form.email')" required>
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </template>
      </AuthInput>

      <AuthInput v-model="phone" type="tel" :placeholder="$t('form.phone')">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </template>
      </AuthInput>

      <AuthInput v-model="password" type="password" :placeholder="$t('form.password')" required>
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </template>
      </AuthInput>

      <AuthInput v-model="confirmPassword" type="password" :placeholder="$t('form.confirm_password')" required>
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </template>
      </AuthInput>

      <p v-if="passwordError" class="text-danger small mt-n2">{{ $t('auth.register.password_mismatch') }}</p>

      <AuthButton type="submit" :loading="loading">{{ $t('buttons.create_account') }}</AuthButton>
    </form>

    <SocialLogin @social-login="handleSocialLogin" />
    <AuthTerms :text="$t('auth.register.terms_text')" />
  </AuthCard>
</template>

<script setup>
import { ref, computed } from 'vue'

const fullName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const passwordError = computed(() => password.value && confirmPassword.value && password.value !== confirmPassword.value)

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) return
  loading.value = true
  try {
    console.log('Register:', { fullName: fullName.value, email: email.value, phone: phone.value })
  } catch (error) {
    console.error('Register error:', error)
  } finally {
    loading.value = false
  }
}

const handleSocialLogin = (provider) => {
  console.log('Social login with:', provider)
}
</script>
