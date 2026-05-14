<template>
  <div class="register-page d-flex align-items-center justify-content-center py-5 min-vh-100">
    <div class="register-container irus-card overflow-hidden">
      <div class="d-flex flex-column flex-lg-row">
        <div class="p-4 d-flex flex-column justify-content-center align-items-center text-center position-relative" style="min-width: 350px;">
        <NuxtLink to="/" class="btn btn-light position-fixed top-0 start-0 m-3 d-lg-none rounded-circle shadow d-flex align-items-center justify-content-center btn-back-mobile" >
          <i class="bi bi-arrow-left text-dark"></i>
        </NuxtLink>
          <div class="mb-4">
            <img src="/favicon-dark.svg" alt="Logo" class="mb-3" style="height: 80px;">
            <h3 class="text-dark fw-bold text-uppercase mb-2">{{ $t('register.title') }}</h3>
            <p class="text-secondary small">{{ $t('register.subtitle') }}</p>
          </div>
          <div class="w-100">
            <p class="text-secondary small fw-bold mb-3">{{ $t('register.quickRegister') }}</p>
            <div class="d-flex flex-column gap-3 w-100 px-lg-4">
              <button class="btn bg-white border rounded-3 py-2 px-4 d-flex align-items-center justify-content-center gap-2 shadow-sm w-100 social-hover">
                <GoogleLogo /> <span class="fw-semibold">Google</span>
              </button>
              <button class="btn bg-white border rounded-3 py-2 px-4 d-flex align-items-center justify-content-center gap-2 shadow-sm w-100 social-hover">
                <FacebookLogo /> <span class="fw-semibold">Facebook</span>
              </button>
            </div>
          </div>
          <div class="d-lg-none w-100" style="height: 80px;"></div>
          <div class="mobile-sticky-buttons d-lg-none d-flex gap-3 w-100 p-3 bg-white border-top shadow-lg">
            <NuxtLink :to="localePath('/auth/login')" class="irus-btn irus-btn--secondary d-flex align-items-center justify-content-center text-dark text-decoration-none flex-grow-1">
              {{ $t('common.login') }}
            </NuxtLink>
            <button @click="openMobileRegister" class="irus-btn irus-btn--primary d-flex align-items-center justify-content-center text-decoration-none flex-grow-1 border-0">
              {{ $t('common.register') }}
            </button>
          </div>
        </div>

        <div class="d-none d-lg-block border-end opacity-25 my-4"></div>

        <div class="p-4 flex-grow-1 bg-white d-none d-lg-block">
          <div v-if="authStore.registerStep === 1" class="h-100 d-flex flex-column">
            <div class="d-flex align-items-center mb-4">
              <div class="flex-grow-1 border-top"></div>
              <span class="fw-bold text-nowrap ms-3 me-3">{{ $t('register.orInfo') }}</span>
              <div class="flex-grow-1 border-top"></div>
            </div>
            <RegisterForm ref="desktopFormRef" />
          </div>
          <div v-else-if="authStore.registerStep === 2" class="h-100 d-flex align-items-center justify-content-center flex-column">
            <OtpInput />
          </div>
        </div>
      </div>
    </div>

    <BottomSheet ref="mobileSheetRef">
      <div class="p-4 pt-0 h-100 d-flex flex-column bg-white">
        <div v-if="authStore.registerStep === 1" class="h-100 d-flex flex-column">
          <div class="text-center mb-4 mt-2">
            <h4 class="fw-bold">{{ $t('register.title') }}</h4>
          </div>
          <RegisterForm ref="mobileFormRef" />
        </div>
        <div v-else-if="authStore.registerStep === 2" class="h-100 d-flex align-items-center justify-content-center flex-column pt-5">
          <OtpInput />
        </div>
      </div>
    </BottomSheet>
  </div>
</template>

<script setup>
import { ref, onUnmounted, provide } from 'vue'
import { useLocalePath } from '#imports'
import GoogleLogo from '@/components/Icons/Logo/GoogleLogo.vue'
import FacebookLogo from '@/components/Icons/Logo/FacebookLogo.vue'
import OtpInput from '@/components/Models/OtpInput.vue'
import BottomSheet from '@/components/Common/BottomSheet.vue'
import RegisterForm from '@/components/Models/RegisterForm.vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useMobileSheet } from '@/composables/useMobileSheet'

const localePath = useLocalePath()
const authStore = useAuthStore()

const mobileSheetRef = ref(null)

useMobileSheet(mobileSheetRef, () => {
  const isRegister = authStore.registerStep === 2;
  const isForgot = authStore.restoreStep === 2;
  return isRegister || isForgot;
});

const openMobileRegister = () => {
  mobileSheetRef.value?.open()
}

const closeSheet = () => {
  mobileSheetRef.value?.close()
}
provide('closeSheet', closeSheet)

onUnmounted(() => {
  authStore.resetToRegister();
})

onMounted(() => {
  if (authStore.registerStep === 2 && window.innerWidth < 992) {
    setTimeout(() => {
      mobileSheetRef.value?.open();
    }, 100);
  }
});
</script>

<style scoped>
.register-container {
  max-width: 950px;
  width: 950px;
}

.social-hover:hover {
  background-color: #f8f9fa !important;
  border-color: #000 !important;
}

.mobile-sticky-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
}

@media screen and (max-width: 991px) {
  .register-container {
    max-width: 100%;
    width: 100%;
    margin: 0 1rem;
  }
}

@media screen and (max-width: 767px) {
  .register-container {
    margin: 0 0.5rem;
  }
}

@media screen and (max-width: 480px) {
  .register-page {
    padding: 1rem 0 !important;
  }

  .register-container {
    margin: 0;
    border-radius: 0 !important;
  }
  .irus-card {
    background: none !important;
    box-shadow: none !important;
  }
}

.btn-back-mobile {
  width: 40px;
  height: 40px;
  z-index: 1050; 
  padding: 0;
}
</style>
