<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="login-container w-100">
      <div class="irus-card p-4 login-card">
        <!-- Header -->
        <div class="mb-4">
          <h1 class="fw-bold fs-3 mb-2">{{ $t('common.signIn') }}</h1>
          <p class="text-muted mb-0">
            {{ $t("login.newUser") }}
            <NuxtLink :to="localePath('/auth/register')" class="fw-semibold text-decoration-none text-dark">
              {{ $t('login.createAccount') }}
            </NuxtLink>
          </p>
        </div>

        <!-- Form -->
        <form class="irus-form" @submit.prevent="handleLogin" >
          <!-- Email -->
          <div class="irus-input-wrapper">
            <span class="irus-input-icon">
              <EmailIcon />
            </span>
            <input v-model="email" type="email" class="irus-input" :placeholder="$t('common.emailAddress')" required />
          </div>

          <!-- Password -->
          <div class="irus-input-wrapper">
            <span class="irus-input-icon">
              <LockIcon />
            </span>
            <input v-model="password" :type="showPassword ? 'text' : 'password'" class="irus-input" :placeholder="$t('common.password')" required />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword" >
              <ShowEye v-if="!showPassword" />
              <HideEye v-else />
            </button>
          </div>

          <!-- Remember me -->
          <div class="d-flex justify-content-between align-items-center mt-2 mb-3">
            <label class="d-flex align-items-center gap-2 small text-muted">
              <input type="checkbox" v-model="rememberMe" class="form-check-input mt-0" />
              {{ $t('login.rememberMe') }}
            </label>
          </div>

          <Transition name="fade-slide">
            <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center gap-2 mt-2 mb-0" role="alert" >
              <i class="bi bi-exclamation-triangle-fill"></i>
              <span class="flex-grow-1">{{ errorMessage }}</span>
            </div>
          </Transition>

          <!-- Forgot -->
          <div class="text-start">
            <NuxtLink :to="localePath('/auth/forgot-password')" class="text-decoration-none fw-semibold text-dark">
              {{ $t('login.forgotPassword') }}
            </NuxtLink>
          </div>

          <!-- Submit -->
          <button type="submit" class="irus-btn irus-btn--primary" :disabled="loading" >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
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
          <p class="text-muted small mb-3">
            {{ $t('login.joinSocial') }}
          </p>
          <div class="d-flex justify-content-center gap-3">
            <button class="social-btn btn rounded-circle border p-3">
              <GoogleLogo />
            </button>
            <button class="social-btn btn rounded-circle border p-3">
              <FacebookLogo />
            </button>
            <button class="social-btn btn rounded-circle border p-3">
              <TwitterLogo />
            </button>
            <button class="social-btn btn rounded-circle border p-3">
              <AppleLogo />
            </button>
          </div>
        </div>

        <!-- Terms -->
        <div class="text-center mt-4">
          <p class="small text-muted mb-0">
            {{ $t('login.terms') }}
            <NuxtLink to="#" class="fw-semibold text-dark">
              {{ $t('login.termsLink') }}
            </NuxtLink>
            {{ $t('common.and') }}
            <NuxtLink to="#" class="fw-semibold text-dark">
              {{ $t('login.privacyLink') }}
            </NuxtLink>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import GoogleLogo from '@/components/Icons/Logo/GoogleLogo.vue'
import FacebookLogo from '@/components/Icons/Logo/FacebookLogo.vue'
import TwitterLogo from '@/components/Icons/Logo/TwitterLogo.vue'
import AppleLogo from '@/components/Icons/Logo/AppleLogo.vue'
import EmailIcon from '@/components/Icons/EmailIcon.vue'
import LockIcon from '@/components/Icons/LockIcon.vue'
import ShowEye from '@/components/Icons/ShowEye.vue'
import HideEye from '@/components/Icons/HideEye.vue'
import { useLocalePath } from '#imports'
import { useAuthStore } from "@/stores/authStore";
import { useI18n } from '#imports'
import { useGlobalToast } from '@/composables/useGlobalToast.js'

const { t } = useI18n();
const toast = useGlobalToast()
const auth = useAuthStore();
const localePath = useLocalePath()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('');
const rememberMe = ref(false)

watch([email, password], () => {
  errorMessage.value = '';
});

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await auth.login({
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value
    });
    if (response.status === true) {
      toast.success("login successful !");
      navigateTo('/dashboard'); 
      await auth.fetchUser();
    }
  } catch (e) { 
     errorMessage.value = e.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 420px;
}

.password-toggle {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
}

.social-btn {
  transition: all 0.2s ease;
}

.social-btn:hover {
  border-color: #ccc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-check-input:checked {
  background-color: #000;
  border-color: #000;
}

@media screen and (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
  }
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
