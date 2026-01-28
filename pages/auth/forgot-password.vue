<template>
  <AuthLayout
    :title="$t('register.forgotPassword.title')"
    :subtitle="$t('register.forgotPassword.description')"
    :show-divider="false"
    :show-social="false"
    :show-terms="false"
    :show-back="!emailSent"
    :back-text="$t('register.backToLogin')"
    :bottom-text="emailSent ? '' : $t('register.rememberPassword')"
    :bottom-link-text="$t('common.signIn')"
    bottom-link-to="/auth/login"
    visual-title="Password Recovery"
    visual-description="Don't worry! We'll help you reset your password and get back to your account in no time."
    :stats="[
      { value: '2min', label: 'reset time' },
      { value: '100%', label: 'secure' },
      { value: '24/7', label: 'support' }
    ]"
  >
    <template #visual-icon>
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    </template>

    <!-- Success State -->
    <AuthSuccess 
      :show="emailSent" 
      :title="$t('register.email.success.emailSent')"
      :button-text="$t('register.email.success.sendAnother')"
      @reset="resetForm"
    >
      {{ $t('register.email.success.text') }} <strong>{{ email }}</strong>. {{ $t('register.email.success.followInstructions') }}
    </AuthSuccess>

    <!-- Form -->
    <AuthForm v-if="!emailSent" :loading="loading" :submit-text="$t('register.email.sendResetLink')" @submit="handleForgotPassword">
      <AuthInput v-model="email" type="email" :placeholder="$t('common.emailAddress')" />
    </AuthForm>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useLocalePath } from '#imports'
import { useI18n } from '#imports'
import AuthLayout from '@/components/Auth/AuthLayout.vue'
import AuthForm from '@/components/Auth/AuthForm.vue'
import AuthInput from '@/components/Auth/AuthInput.vue'
import AuthSuccess from '@/components/Auth/AuthSuccess.vue'

const { t } = useI18n()
const localePath = useLocalePath()

useHead({ title: t('page_titles.forgotPassword') })
definePageMeta({ layout: false })

const email = ref('')
const loading = ref(false)
const emailSent = ref(false)

const handleForgotPassword = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    emailSent.value = true
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  email.value = ''
  emailSent.value = false
}
</script>
