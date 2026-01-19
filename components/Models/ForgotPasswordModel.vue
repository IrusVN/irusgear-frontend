<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="fp-container w-100">
      <div class="irus-card p-4 fp-card">
        <!-- Back -->
        <NuxtLink :to="localePath('/auth/login')" class="d-flex align-items-center gap-2 mb-4 text-decoration-none text-muted">
          <ArrowLeft />
          {{ $t('register.backToLogin') }}
        </NuxtLink>

        <!-- Header -->
        <div class="mb-4">
          <h1 class="fw-bold fs-3 mb-2">{{ $t('register.forgotPassword.title') }}</h1>
          <p class="text-muted mb-0">{{ $t('register.forgotPassword.description') }}</p>
        </div>

        <!-- Success -->
        <div v-if="emailSent" class="d-flex flex-column align-items-center text-center">
          <div class="mb-3 text-success">
            <SuccessIcon />
          </div>
          <h2 class="fw-bold fs-4 mb-2">{{ $t('register.email.success.emailSent') }}</h2>
          <p class="text-muted mb-3">{{ $t('register.email.success.text') }} <strong>{{ email }}</strong>. {{ $t('register.email.success.followInstructions') }}</p>
          <button class="irus-btn irus-btn--secondary" @click="resetForm" >
            {{ $t('register.email.success.sendAnother') }}
          </button>
        </div>

        <!-- Form -->
        <form v-else class="irus-form" @submit.prevent="handleForgotPassword" >
          <div class="irus-input-wrapper">
            <span class="irus-input-icon">
              <EmailIcon />
            </span>
            <input v-model="email" type="email" class="irus-input" :placeholder="$t('common.emailAddress')" required />
          </div>

          <button type="submit" class="irus-btn irus-btn--primary" :disabled="loading" >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
            {{ $t('register.email.sendResetLink') }}
          </button>
        </form>

        <!-- Help -->
        <div v-if="!emailSent" class="text-center mt-4" >
          <p class="text-muted mb-0">
            {{ $t('register.rememberPassword') }}
            <NuxtLink :to="localePath('/auth/login')" class="fw-semibold text-decoration-none text-dark" >
              {{ $t('common.signIn') }}
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLocalePath } from '#imports'
import ArrowLeft from '@/components/Icons/ArrowLeft.vue'
import SuccessIcon from '@/components/Icons/SuccessIcon.vue'
import EmailIcon from '@/components/Icons/EmailIcon.vue'

const localePath = useLocalePath()

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

<style scoped>
.fp-container {
  max-width: 420px;
}

@media screen and (max-width: 480px) {
  .fp-card {
    padding: 32px 24px;
  }
}
</style>
