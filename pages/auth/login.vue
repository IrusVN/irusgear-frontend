<template>
  <AuthLayout
    :title="$t('common.signIn')"
    :subtitle="$t('login.newUser')"
    :link-text="$t('login.createAccount')"
    link-to="/auth/register"
    :divider-text="$t('common.or')"
    :social-text="$t('login.joinSocial')"
    :terms-prefix="$t('login.terms')"
    :terms-link="$t('login.termsLink')"
    :terms-and="$t('common.and')"
    :policy-link="$t('login.privacyLink')"
    :visual-title="$t('login.visualTitle') || 'Secure & Minimal'"
    :visual-description="$t('login.visualDesc') || 'Experience seamless authentication with our modern, security-first approach.'"
  >
    <AuthForm :loading="loading" :submit-text="$t('common.login')" @submit="handleLogin">
      <AuthInput v-model="email" type="email" :placeholder="$t('common.emailAddress')" />
      <AuthInput v-model="password" type="password" :placeholder="$t('common.password')" />
      
      <div class="d-flex justify-content-between align-items-center">
        <AuthCheckbox v-model="rememberMe">{{ $t('login.rememberMe') }}</AuthCheckbox>
        <NuxtLink :to="localePath('/auth/forgot-password')" class="small text-dark text-decoration-none fw-medium">
          {{ $t('login.forgotPassword') }}
        </NuxtLink>
      </div>
      
      <AuthError :message="errorMessage" />
    </AuthForm>
  </AuthLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useLocalePath, navigateTo } from '#imports'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from '#imports'
import { useGlobalToast } from '@/composables/useGlobalToast.js'
import AuthLayout from '@/components/Auth/AuthLayout.vue'
import AuthForm from '@/components/Auth/AuthForm.vue'
import AuthInput from '@/components/Auth/AuthInput.vue'
import AuthCheckbox from '@/components/Auth/AuthCheckbox.vue'
import AuthError from '@/components/Auth/AuthError.vue'

const { t } = useI18n()
const toast = useGlobalToast()
const auth = useAuthStore()
const localePath = useLocalePath()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')

useHead({ title: t('page_titles.login') })
definePageMeta({ layout: false })

watch([email, password], () => { errorMessage.value = '' })

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await auth.login({
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value ? 1 : 0
    })
    if (response.status === true) {
      toast.success('Login successful!')
      return navigateTo('/')
    }
  } catch (e) {
    errorMessage.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
