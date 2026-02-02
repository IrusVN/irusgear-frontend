<template>
  <div class="d-flex flex-column flex-lg-row min-vh-100 position-relative overflow-hidden">
    <NuxtLink to="/auth/login" class="btn btn-light position-fixed top-0 start-0 m-3 d-lg-none rounded-circle shadow d-flex align-items-center justify-content-center btn-back-mobile" >
      <i class="bi bi-arrow-left text-dark"></i>
    </NuxtLink>
    <div class="left-panel d-flex flex-column justify-content-center align-items-center bg-light-subtle p-4 p-lg-5 flex-lg-shrink-0">
      <div class="mb-4 text-center">
        <img src="@/public/favicon-dark.svg" alt="Logo" class="mb-3 logo-img">
      </div>

      <div class="text-center mb-4">
        <h3 class="fw-bold mb-2">{{ $t('restorePassword.recoverTitle') }}</h3>
        <p class="text-secondary">{{ $t('restorePassword.recoverSubtitle') }}</p>
      </div>

      <div class="benefits-list w-100 w-lg-75 p-4 bg-white rounded-4 shadow-sm position-relative">
        <span class="corner corner-tl"></span><span class="corner corner-tr"></span>
        <span class="corner corner-bl"></span><span class="corner corner-br"></span>

        <div class="d-flex flex-column gap-4">
          <div class="d-flex align-items-start gap-3">
            <div class="info-icon bg-primary-subtle text-primary">
              <i class="bi bi-envelope-paper"></i>
            </div>
            <div>
              <p class="fw-bold mb-1 small text-dark">{{ $t('restorePassword.checkSpam') }}</p>
              <p class="mb-0 x-small text-secondary">{{ $t('restorePassword.checkSpamDesc') }}</p>
            </div>
          </div>

          <div class="d-flex align-items-start gap-3">
            <div class="info-icon bg-success-subtle text-success">
              <i class="bi bi-shield-check"></i>
            </div>
            <div>
              <p class="fw-bold mb-1 small text-dark">{{ $t('restorePassword.secureTip') }}</p>
              <p class="mb-0 x-small text-secondary">{{ $t('restorePassword.secureTipDesc') }}</p>
            </div>
          </div>

          <div class="d-flex align-items-start gap-3">
            <div class="info-icon bg-warning-subtle text-warning">
              <i class="bi bi-headset"></i>
            </div>
            <div>
              <p class="fw-bold mb-1 small text-dark">{{ $t('restorePassword.needHelp') }}</p>
              <p class="mb-0 x-small text-secondary">{{ $t('restorePassword.needHelpDesc') }}</p>
            </div>
          </div>

        </div>
      </div>

      <div class="d-lg-none w-100" style="height: 100px;"></div>
      <div class="mobile-sticky-buttons d-lg-none d-flex gap-3 w-100 p-3 bg-white border-top shadow-lg">
        <NuxtLink :to="localePath('/auth/login')"
          class="irus-btn irus-btn--secondary d-flex align-items-center justify-content-center text-dark text-decoration-none flex-grow-1">
          {{ $t('common.login') }}
        </NuxtLink>
        <button @click="openMobileRestore" class="irus-btn irus-btn--primary d-flex align-items-center justify-content-center text-decoration-none flex-grow-1 border-0">
          {{ $t('restorePassword.recover') }}
        </button>
      </div>
    </div>

    <div class="right-panel d-none d-lg-flex flex-grow-1 justify-content-center align-items-center p-4">
      <div class="p-4 login-card w-100 h-100 d-flex flex-column justify-content-center position-relative">
        <div class="w-100">
          <div class="mb-4 text-start">
            <h1 class="fw-bold fs-2 mb-2">{{ currentTitle }}</h1>
            <p class="text-muted mb-0">{{ currentSubtitle }}</p>
          </div>
          <div v-if="authStore.restoreStep === 1">
            <SendEmailForm ref="desktopEmailRef" />
          </div>
          <div v-else-if="authStore.restoreStep === 2" class="d-flex flex-column align-items-center justify-content-center py-4"> <OtpInput mode="reset" />
          </div>
          <div v-else-if="authStore.restoreStep === 3">
            <NewPasswordForm ref="desktopPassRef" />
          </div>
        </div>
      </div>
    </div>

    <BottomSheet ref="mobileSheetRef">
      <div class="p-4 pt-0 login-card h-100 d-flex flex-column justify-content-start bg-white">
        <div class="mb-4 mt-2 text-start">
          <h1 class="fw-bold fs-2 mb-2">{{ currentTitle }}</h1>
          <p class="text-muted mb-0">{{ currentSubtitle }}</p>
        </div>
        <div v-if="authStore.restoreStep === 1" class="flex-grow-1">
          <SendEmailForm ref="mobileEmailRef" />
        </div>
        <div v-else-if="authStore.restoreStep === 2" class="flex-grow-1 d-flex flex-column justify-content-center pt-5">
          <OtpInput mode="reset" />
        </div>
        <div v-else-if="authStore.restoreStep === 3" class="flex-grow-1">
          <NewPasswordForm ref="mobilePassRef" />
        </div>
      </div>
    </BottomSheet>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, provide } from 'vue'
import { useLocalePath, useI18n } from '#imports'
import BottomSheet from '@/components/Common/BottomSheet.vue'
import SendEmailForm from '@/components/Models/RestoreForms/SendEmailForm.vue'
import NewPasswordForm from '@/components/Models/RestoreForms/NewPasswordForm.vue'
import OtpInput from '@/components/Models/OtpInput.vue'
import { useAuthStore } from '@/stores/authStore.js'

const { t } = useI18n()
const localePath = useLocalePath()
const authStore = useAuthStore()

const mobileSheetRef = ref(null)
const desktopEmailRef = ref(null)
const mobileEmailRef = ref(null)
const desktopPassRef = ref(null)
const mobilePassRef = ref(null)

const currentTitle = computed(() => {
  switch (authStore.restoreStep) {
    case 1: return t('restorePassword.forgotPassword');
    case 2: return t('restorePassword.verification');
    case 3: return t('restorePassword.resetPassword');
    default: return t('restorePassword.forgotPassword');
  }
})

const currentSubtitle = computed(() => {
  switch (authStore.restoreStep) {
    case 1: return t('restorePassword.forgotPasswordSubtitle');
    case 2: return t('restorePassword.otpSubtitle');
    case 3: return t('restorePassword.newPasswordSubtitle');
    default: return '';
  }
})

const openMobileRestore = () => { mobileSheetRef.value?.open() }
const closeSheet = () => { mobileSheetRef.value?.close() }
provide('closeSheet', closeSheet)

onUnmounted(() => { authStore.resetRestoreProcess() })
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
  .left-panel {
    min-width: 100%;
    max-width: 100%;
    min-height: 100vh;
  }
}

.logo-img {
  height: 80px;
}

.benefit-icon {
  color: #1a1a1a;
  font-size: 1.1rem;
  min-width: 24px;
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

/* Thêm vào phần style scoped hiện có */
.x-small {
  font-size: 0.8rem;
  line-height: 1.4;
}

.bg-primary-subtle {
  background-color: #cfe2ff;
}

.bg-success-subtle {
  background-color: #d1e7dd;
}

.bg-warning-subtle {
  background-color: #fff3cd;
}

.text-primary {
  color: #0d6efd !important;
}

.text-success {
  color: #198754 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.btn-back-mobile {
  width: 40px;
  height: 40px;
  z-index: 1050; 
  padding: 0;
}

.info-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
  font-size: 1.1rem;
}

.x-small {
  font-size: 0.8rem;
  line-height: 1.4;
}
</style>
