<template>
  <div class="d-flex flex-column flex-lg-row min-vh-100 position-relative overflow-hidden">
    <div class="left-panel d-flex flex-column justify-content-center align-items-center bg-light-subtle p-4 p-lg-5 flex-lg-shrink-0">
      <div class="mb-4 text-center">
        <img src="@/public/favicon-dark.svg" alt="Logo" class="mb-3 logo-img">
      </div>
      <div class="text-center mb-4">
        <h3 class="fw-bold mb-2">
          {{ $t('login.memberTitle') }}
          <img src="@/public/image/logo-irusgear-black.png" alt="" height="32px"
            class="d-inline-block align-text-bottom">
        </h3>
        <p class="text-secondary">{{ $t('login.memberSubtitle') }}</p>
      </div>
      <div class="benefits-list w-100 w-lg-75 p-4 bg-white rounded-4 shadow-sm position-relative">
        <span class="corner corner-tl"></span><span class="corner corner-tr"></span>
        <span class="corner corner-bl"></span><span class="corner corner-br"></span>
        <div class="d-flex flex-column gap-3">
          <div class="d-flex align-items-start gap-3"><i class="bi bi-gift-fill benefit-icon"></i>
            <p class="mb-0">
              <span class="fw-semibold">{{ $t('login.benefitDiscount') }}</span>
              {{ $t('login.benefitDiscountDesc') }}
            </p>
          </div>
          <div class="d-flex align-items-start gap-3"><i class="bi bi-truck benefit-icon"></i>
            <p class="mb-0">
              <span class="fw-semibold">{{ $t('login.benefitShipping') }}</span>
              {{ $t('login.benefitShippingDesc') }}
            </p>
          </div>
          <div class="d-flex align-items-start gap-3"><i class="bi bi-balloon-heart-fill benefit-icon"></i>
            <p class="mb-0">
              <span class="fw-semibold">{{ $t('login.benefitBirthday') }}</span>
              {{ $t('login.benefitBirthdayDesc') }}
              </p>
          </div>
          <div class="d-flex align-items-start gap-3"><i class="bi bi-arrow-repeat benefit-icon"></i>
            <p class="mb-0">
              <span class="fw-semibold">{{ $t('login.benefitTradeIn') }}</span>
              {{ $t('login.benefitTradeInDesc') }}
            </p>
          </div>
          <div class="d-flex align-items-start gap-3"><i class="bi bi-ticket-perforated-fill benefit-icon"></i>
            <p class="mb-0">
              <span class="fw-semibold">{{ $t('login.benefitRankUp') }}</span>
             {{ $t('login.benefitRankUpDesc') }}
            </p>
          </div>
          <div class="d-flex align-items-start gap-3"><i class="bi bi-briefcase-fill benefit-icon"></i>
            <p class="mb-0">
              <span class="fw-semibold">{{ $t('login.benefitBusiness') }}</span>
              {{ $t('login.benefitBusinessDesc') }}
            </p>
          </div>
        </div>
      </div>
      <div class="mt-4 text-center">
        <NuxtLink to="#" class="text-decoration-none fw-semibold benefit-link">
          {{ $t('login.viewMemberPolicy') }} <i class="bi bi-chevron-right small"></i>
        </NuxtLink>
      </div>
      <div class="d-lg-none w-100" style="height: 100px;"></div>
      <div class="mobile-sticky-buttons d-lg-none d-flex gap-3 w-100 p-3 bg-white border-top shadow-lg">
        <NuxtLink :to="localePath('/auth/register')" class="irus-btn irus-btn--secondary d-flex align-items-center justify-content-center text-dark text-decoration-none flex-grow-1">
          {{ $t('common.register') }}
        </NuxtLink>
        <button @click="openMobileLogin" class="irus-btn irus-btn--primary d-flex align-items-center justify-content-center text-decoration-none flex-grow-1 border-0">
          {{ $t('common.login') }}
        </button>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showMobileLogin" class="mobile-backdrop d-lg-none" @click="closeMobileLogin"></div>
    </Transition>

    <div class="right-panel d-lg-flex flex-grow-1 justify-content-center align-items-center p-0 p-lg-4" :class="{ 'mobile-active': showMobileLogin }" :style="drawerStyle">
      <div class="drag-handle-area d-lg-none w-100 d-flex justify-content-center pt-3 pb-1" @touchstart="startDrag" @touchmove="onDrag" @touchend="endDrag">
        <div class="drag-handle bg-secondary opacity-25 rounded-pill"></div>
      </div>
      <div class="p-4 pt-0 pt-lg-4 login-card w-100 h-100 d-flex flex-column justify-content-start justify-content-lg-center position-relative bg-white">
        <div class="mb-4 mt-2 mt-lg-0 text-start">
          <h1 class="fw-bold fs-2 mb-2">{{ $t('common.signIn') }}</h1>
          <p class="text-muted mb-0">
            {{ $t('login.newUser') }}
            <NuxtLink :to="localePath('/auth/register')" class="fw-bold text-decoration-none text-dark">
              {{ $t('login.createAccount') }}
            </NuxtLink>
          </p>
        </div>

        <form class="irus-form" @submit.prevent="handleLogin">
          <div class="irus-input-wrapper mb-3">
            <span class="irus-input-icon">
              <EmailIcon />
            </span>
            <input v-model="email" type="email" class="irus-input" :placeholder="$t('common.emailAddress')" required />
          </div>
          <div class="irus-input-wrapper mb-3">
            <span class="irus-input-icon">
              <LockIcon />
            </span>
            <input v-model="password" :type="showPassword ? 'text' : 'password'" class="irus-input" :placeholder="$t('common.password')" required />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <ShowEye v-if="!showPassword" />
              <HideEye v-else />
            </button>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-2 mb-3">
            <label class="d-flex align-items-center gap-2 small text-muted cursor-pointer">
              <input type="checkbox" v-model="rememberMe" class="form-check-input mt-0" />
              {{ $t('login.rememberMe') }}
            </label>
          </div>
          <Transition name="fade-slide">
            <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center gap-2 mt-2 mb-3 py-2 small" role="alert">
              <i class="bi bi-exclamation-triangle-fill"></i><span class="flex-grow-1">{{ errorMessage }}</span>
            </div>
          </Transition>
          <div class="text-start mb-3">
            <NuxtLink :to="localePath('/auth/forgot-password')" class="text-decoration-none fw-bold text-dark small">
              {{ $t('login.forgotPassword') }}
            </NuxtLink>
          </div>
          <button type="submit" class="irus-btn irus-btn--primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
            {{ $t('common.login') }}
          </button>
        </form>

        <div class="d-flex align-items-center my-4">
          <div class="flex-grow-1 border-top"></div><span class="px-3 text-muted small">{{ $t('common.or') }}</span>
          <div class="flex-grow-1 border-top"></div>
        </div>
        <div class="text-center">
          <p class="text-muted small mb-3">{{ $t('login.joinSocial') }}</p>
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

        <div class="text-center mt-4 pb-5 pb-lg-0">
          <p class="small text-muted mb-0">{{ $t('login.terms') }} <NuxtLink to="#"
              class="fw-bold text-dark text-decoration-underline">{{ $t('login.termsLink') }}</NuxtLink> and <NuxtLink to="#"
              class="fw-bold text-dark text-decoration-underline">{{ $t('login.privacyLink') }}</NuxtLink>.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
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

const showMobileLogin = ref(false)
const startY = ref(0)
const currentY = ref(0)
const isDragging = ref(false)

watch([email, password], () => { errorMessage.value = ''; });

const openMobileLogin = () => {
  showMobileLogin.value = true;
  if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
}
const closeMobileLogin = () => {
  showMobileLogin.value = false;
  currentY.value = 0;
  if (typeof document !== 'undefined') document.body.style.overflow = '';
}
const startDrag = (e) => { startY.value = e.touches[0].clientY; isDragging.value = true; }
const onDrag = (e) => {
  if (!isDragging.value) return;
  const diff = e.touches[0].clientY - startY.value;
  if (diff > 0) currentY.value = diff;
}
const endDrag = () => {
  isDragging.value = false;
  if (currentY.value > 100) closeMobileLogin();
  else currentY.value = 0;
}
const drawerStyle = computed(() => {
  if (!isDragging.value && currentY.value === 0) return {};
  return { transform: isDragging.value ? `translateY(${currentY.value}px)` : '' };
})
const handleLogin = async () => {
  loading.value = true; errorMessage.value = '';
  try {
    const response = await auth.login({ email: email.value, password: password.value, rememberMe: rememberMe.value });
    if (response.status === true) {
      toast.success("Login successful!");
      closeMobileLogin();
      return navigateTo('/');
    }
  } catch (e) { errorMessage.value = e.message; } finally { loading.value = false; }
};
</script>

<style scoped>
.left-panel {
  flex-basis: 60%;
  background-image: url('/image/background-image.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-color: #f8f9fa;
}

.right-panel {
  flex-basis: 40%;
}

@media screen and (max-width: 992px) {
  .mobile-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1999;
    backdrop-filter: blur(2px);
  }

  .right-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    max-height: 90vh;
    z-index: 2000;
    background: white;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    display: flex !important;
    flex-direction: column;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
  }

  .right-panel.mobile-active {
    transform: translateY(0);
  }

  .right-panel[style*="translateY"] {
    transition: none;
  }

  .login-card {
    border-radius: 0;
    padding-bottom: 2rem;
    overflow-y: auto;
  }
}

.drag-handle-area {
  cursor: grab;
}

.drag-handle {
  width: 48px;
  height: 6px;
  background-color: #e0e0e0;
}

.benefit-icon {
  color: #1a1a1a;
  font-size: 1.1rem;
  min-width: 24px;
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

.irus-input-wrapper {
  position: relative;
}

.irus-input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
}

.social-btn {
  transition: all 0.2s ease;
  background: #fff;
}

.social-btn:hover {
  border-color: #ccc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.benefit-link {
  color: #1a1a1a;
  transition: opacity 0.2s;
}

.benefit-link:hover {
  opacity: 0.7;
}

.mobile-sticky-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
}

.logo-img {
  height: 80px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
