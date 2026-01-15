<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3 auth-page" >
    <div class="w-100 auth-container">
      <div class="bg-white shadow auth-card d-flex flex-column" >
        <!-- Header -->
        <div class="mb-4">
          <h1 class="fw-bold mb-2 auth-title">{{ $t('common.signIn') }}</h1>
          <p class="text-muted mb-0">
            {{ $t('login.newUser') }}
            <NuxtLink to="/auth/register" class="fw-semibold text-dark text-decoration-none">
              {{ $t('login.createAccount') }}
            </NuxtLink>
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="d-flex flex-column gap-3">
          <!-- Email -->
          <div class="position-relative d-flex align-items-center">
            <span class="position-absolute start-0 ms-3 text-muted">
              <EmailIcon />
            </span>
            <input type="email" class="form-control ps-5" placeholder="Email Address" v-model="email" required />
          </div>

          <!-- Password -->
          <div class="position-relative d-flex align-items-center">
            <span class="position-absolute start-0 ms-3 text-muted">
              <LockIcon />
            </span>
            <input :type="showPassword ? 'text' : 'password'" class="form-control ps-5 pe-5" placeholder="Password" v-model="password" required />
            <button type="button" class="btn position-absolute end-0 me-3 p-0 border-0 bg-transparent text-muted" @click="showPassword = !showPassword" >
              <ShowEye v-if="!showPassword" />
              <HideEye v-else />
            </button>
          </div>

          <!-- Forgot password -->
          <div class="text-start">
            <NuxtLink to="/auth/forgot-password" class="text-dark text-decoration-none small">
              {{ $t('login.forgotPassword') }}
            </NuxtLink>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn btn-dark rounded-pill py-2 fw-semibold mt-2" :disabled="loading" >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" ></span>
            {{ $t('common.login') }}
          </button>
        </form>

        <!-- Divider -->
        <div class="d-flex align-items-center my-4">
          <div class="flex-grow-1 border-top"></div>
          <span class="px-3 text-muted small">{{ $t('common.or') }}</span>
          <div class="flex-grow-1 border-top"></div>
        </div>

        <!-- Social -->
        <div class="text-center">
          <p class="small text-muted mb-3"> {{ $t('login.joinSocial') }} </p>
          <div class="d-flex justify-content-center gap-3">
            <button class="btn rounded-circle border p-3">
              <GoogleLogo />
            </button>
            <button class="btn rounded-circle border p-3">
              <FacebookLogo />
            </button>
            <button class="btn rounded-circle border p-3">
              <TwitterLogo />
            </button>
            <button class="btn rounded-circle border p-3">
              <AppleLogo />
            </button>
          </div>
        </div>

        <!-- Terms -->
        <div class="text-center mt-4">
          <p class="fs-6 mb-0">
            {{ $t('login.terms') }}
            <NuxtLink to="#" class="text-dark text-decoration-underline fw-semibold">
              {{ $t('login.termsLink') }}
            </NuxtLink>
            {{ $t('common.and') }}
            <NuxtLink to="#" class="text-dark text-decoration-underline fw-semibold">
              {{ $t('login.privacyLink') }}
            </NuxtLink>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import GoogleLogo from '@/components/Icons/GoogleLogo.vue'
import FacebookLogo from '@/components/Icons/FacebookLogo.vue'
import TwitterLogo from '@/components/Icons/TwitterLogo.vue'
import AppleLogo from '@/components/Icons/AppleLogo.vue'
import EmailIcon from '@/components/Icons/EmailIcon.vue'
import LockIcon from '@/components/Icons/LockIcon.vue'
import ShowEye from '@/components/Icons/ShowEye.vue'
import HideEye from '@/components/Icons/HideEye.vue'

const { t } = useI18n();
useHead({ title: t('page_titles.login') });
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    console.log('Login with:', email.value, password.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 420px;
}

.auth-card {
  border-radius: 24px;
  padding: 50px 32px;
}

/* Responsive mobile */
@media screen and (max-width: 480px) {
  .auth-card {
    padding: 32px 24px;
  }

  .auth-title {
    font-size: 24px;
  }
}
</style>
