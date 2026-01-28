<template>
  <div class="verify-page d-flex align-items-center justify-content-center py-5">
    <div class="verify-container irus-card overflow-hidden">
      <div class="d-flex flex-column flex-lg-row" style="min-height: 500px;">
        
        <div class="p-4 d-flex flex-column justify-content-center align-items-center text-center bg-light-subtle" 
             style="min-width: 380px;"> 
          <div class="mb-4">
            <img src="@/public/favicon-dark.svg" alt="Logo" class="mb-3" style="height: 80px;">
            <h3 class="text-dark fw-bold text-uppercase mb-2">{{ $t('verify.title') }}</h3>
            <p class="text-secondary small">{{ $t('verify.subtitle') }}</p>
          </div>
        </div>

        <div class="d-none d-lg-block border-end opacity-25 my-4"></div>
        <div class="d-block d-lg-none border-top w-100 opacity-25"></div>

        <div class="p-4 p-lg-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center bg-white">
          <OtpInput />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import OtpInput from '@/components/Models/OtpInput.vue' 
import { useRoute } from '#imports'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const authStore = useAuthStore()

onMounted(() => {
  const emailFromUrl = route.query.email || ''
  authStore.setVerifyEmail(emailFromUrl)
})

definePageMeta({
  layout: false,
});
</script>

<style scoped>
.verify-container {
  max-width: 950px;
  width: 950px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

@media screen and (max-width: 991px) {
  .verify-container {
    max-width: 100%;
    margin: 0 1rem;
  }
}
</style>
