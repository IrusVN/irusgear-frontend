<template>
  <div class="d-flex flex-column flex-lg-row min-vh-100">
    <!-- Left Panel -->
    <div class="left-panel d-flex flex-column justify-content-center align-items-center bg-light-subtle p-4 p-lg-5 flex-lg-shrink-0">
      <!-- Logo -->
      <div class="mb-4 text-center">
        <img src="@/public/favicon-dark.svg" alt="Logo" class="mb-3 logo-img">
      </div>

      <!-- Title -->
      <div class="text-center mb-4">
        <h3 class="fw-bold mb-2">
          {{ $t('login.memberTitle') }}
          <img src="@/public/image/logo-irusgear-black.png" alt="" height="32px">
        </h3>
        <p class="text-secondary">{{ $t('login.memberSubtitle') }}</p>
      </div>

      <!-- Benefits List -->
      <div class="benefits-list w-50 p-4 bg-white rounded-4 shadow-sm">
        <span class="corner corner-tl"></span>
        <span class="corner corner-tr"></span>
        <span class="corner corner-bl"></span>
        <span class="corner corner-br"></span>
        <div class="d-flex align-items-start gap-3 mb-3">
          <i class="bi bi-gift-fill benefit-icon"></i>
          <p class="mb-0"><span class="fw-semibold">{{ $t('login.benefitDiscount') }}</span> {{ $t('login.benefitDiscountDesc') }}</p>
        </div>
        <div class="d-flex align-items-start gap-3 mb-3">
          <i class="bi bi-truck benefit-icon"></i>
          <p class="mb-0"><span class="fw-semibold">{{ $t('login.benefitShipping') }}</span> {{ $t('login.benefitShippingDesc') }}</p>
        </div>
        <div class="d-flex align-items-start gap-3 mb-3">
          <i class="bi bi-balloon-heart-fill benefit-icon"></i>
          <p class="mb-0"><span class="fw-semibold">{{ $t('login.benefitBirthday') }}</span> {{ $t('login.benefitBirthdayDesc') }}</p>
        </div>
        <div class="d-flex align-items-start gap-3 mb-3">
          <i class="bi bi-arrow-repeat benefit-icon"></i>
          <p class="mb-0"><span class="fw-semibold">{{ $t('login.benefitTradeIn') }}</span> {{ $t('login.benefitTradeInDesc') }}</p>
        </div>
        <div class="d-flex align-items-start gap-3 mb-3">
          <i class="bi bi-ticket-perforated-fill benefit-icon"></i>
          <p class="mb-0"><span class="fw-semibold">{{ $t('login.benefitRankUp') }}</span> {{ $t('login.benefitRankUpDesc') }}</p>
        </div>
        <div class="d-flex align-items-start gap-3">
          <i class="bi bi-briefcase-fill benefit-icon"></i>
          <p class="mb-0"><span class="fw-semibold">{{ $t('login.benefitBusiness') }}</span> {{ $t('login.benefitBusinessDesc') }}</p>
        </div>
      </div>

      <!-- CTA Link -->
      <div class="mt-4">
        <NuxtLink to="#" class="text-decoration-none fw-semibold benefit-link">
          {{ $t('login.viewMemberPolicy') }} <i class="bi bi-chevron-right"></i>
        </NuxtLink>
      </div>

      <!-- Mobile Sticky Buttons -->
      <div class="mobile-sticky-buttons d-lg-none d-flex gap-3 w-100 p-3 bg-white shadow-lg">
        <NuxtLink :to="localePath('/auth/register')" class="btn irus-btn irus-btn--secondary flex-grow-1">
          {{ $t('common.register') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/auth/login')" class="btn irus-btn irus-btn--primary flex-grow-1">
          {{ $t('common.login') }}
        </NuxtLink>
      </div>
    </div>
    <!-- Right Panel -->
    <div class="right-panel d-none d-lg-flex flex-grow-1 justify-content-center align-items-center p-4">
      <div class="p-4 login-card">
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
      toast.success("login successful!");
      return navigateTo('/');
    }
  } catch (e) { 
     errorMessage.value = e.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.left-panel {
  flex-basis: 65%;
  background-image: url('@/public/image/background-image.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-color: #f8f9fa;
}

.right-panel {
  flex-basis: 35%;
}

.logo-img {
  height: 80px;
}

.text-primary-custom {
  color: #1a1a1a;
}

.benefit-icon {
  color: #1a1a1a;
  font-size: 1.1rem;
  min-width: 20px;
}

.benefits-list {
  position: relative;
}

.corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border-color: #1a1a1a;
  border-style: solid;
  border-width: 0;
  pointer-events: none;
}

.corner-tl {
  top: 0;
  left: 0;
  border-top-width: 3px;
  border-left-width: 3px;
  border-top-left-radius: 12px;
}

.corner-tr {
  top: 0;
  right: 0;
  border-top-width: 3px;
  border-right-width: 3px;
  border-top-right-radius: 12px;
}

.corner-bl {
  bottom: 0;
  left: 0;
  border-bottom-width: 3px;
  border-left-width: 3px;
  border-bottom-left-radius: 12px;
}

.corner-br {
  bottom: 0;
  right: 0;
  border-bottom-width: 3px;
  border-right-width: 3px;
  border-bottom-right-radius: 12px;
}

.benefits-list p {
  font-size: 0.9rem;
  color: #555;
  text-align: left;
}

.benefit-link {
  color: #1a1a1a;
  transition: opacity 0.2s ease;
}

.benefit-link:hover {
  opacity: 0.7;
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
  background-color: #1a1a1a;
  border-color: #1a1a1a;
}

@media screen and (max-width: 992px) {
  .left-panel {
    min-width: 100%;
    max-width: 100%;
    min-height: 100vh;
    padding-bottom: 100px;
  }

  .benefits-list {
    width: 100% !important;
  }
}

.mobile-sticky-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-top: 1px solid #e5e5e5;
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
