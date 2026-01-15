<template>
  <AuthCard>
    <!-- Header -->
    <AuthHeader
      :title="$t('auth.login.title')"
      :subtitle="$t('auth.login.new_user')"
      :link-text="$t('auth.login.create_account')"
      link-to="/auth/register"
    />

    <!-- Form -->
    <form @submit.prevent="handleLogin">
      <AuthInput v-model="email" type="email" :placeholder="$t('form.email')" required>
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
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

      <div class="mb-3 text-start">
        <NuxtLink to="/auth/forgot-password" class="text-dark small text-decoration-none">
          {{ $t('auth.login.forgot_password') }}
        </NuxtLink>
      </div>

      <AuthButton type="submit" :loading="loading">{{ $t('buttons.login') }}</AuthButton>
    </form>

    <SocialLogin @social-login="handleSocialLogin" />
    <AuthTerms :text="$t('auth.login.terms_text')" />
  </AuthCard>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    console.log('Login with:', email.value, password.value)
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

const handleSocialLogin = (provider) => {
  console.log('Social login with:', provider)
}
</script>
