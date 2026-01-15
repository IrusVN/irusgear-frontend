<template>
  <div class="register-page d-flex align-items-center justify-content-center">
    <div class="register-container d-flex justify-content-center w-100">
      <div class="irus-card p-4 register-card w-100">
        <!-- Header -->
        <div class="mb-4">
          <h1 class="fs-3">{{ $t('common.createAccount') }}</h1>
          <p class="register-subtitle mb-0">
            {{ $t('common.alreadyHaveAccount') }}
            <NuxtLink :to="localePath('/register/login')" class="fw-semibold text-dark text-decoration-none" >
              {{ $t('common.signIn') }}
            </NuxtLink>
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleRegister" class="irus-form d-flex flex-column" >
          <!-- Full name -->
          <div class="irus-input-wrapper">
            <span class="irus-input-icon">
              <UserIcon />
            </span>
            <input type="text" class="irus-input" placeholder="Full Name" v-model="fullName" required />
          </div>

          <!-- Email -->
          <div class="irus-input-wrapper">
            <span class="irus-input-icon">
              <EmailIcon />
            </span>
            <input type="email" class="irus-input" :placeholder="$t('common.emailAddress')" v-model="email" required />
          </div>

          <!-- Phone -->
          <div class="irus-input-wrapper">
            <span class="irus-input-icon">
              <PhoneIcon />
            </span>
            <input type="tel" class="irus-input" :placeholder="$t('common.phoneNumber')" v-model="phone" required />
          </div>

          <!-- Password -->
          <div class="irus-input-wrapper">
            <span class="irus-input-icon">
              <LockIcon />
            </span>
            <input :type="showPassword ? 'text' : 'password'" class="irus-input" placeholder="Password" v-model="password" required />
            <button type="button" class="btn position-absolute end-0 me-3 p-0 border-0 bg-transparent" @click="showPassword = !showPassword" >
              <ShowEye v-if="!showPassword" />
              <HideEye v-else />
            </button>
          </div>

          <!-- Confirm Password -->
          <div class="irus-input-wrapper">
            <span class="irus-input-icon">
              <LockIcon />
            </span>
            <input :type="showConfirmPassword ? 'text' : 'password'" class="irus-input" placeholder="Confirm Password" v-model="confirmPassword" required />
            <button type="button" class="btn position-absolute end-0 me-3 p-0 border-0 bg-transparent" @click="showConfirmPassword = !showConfirmPassword" >
              <ShowEye v-if="!showConfirmPassword" />
              <HideEye v-else />
            </button>
          </div>

          <!-- Error -->
          <p v-if="passwordError" class="text-danger small mt-n2 mb-1" > {{ $t('validate.passwordsNotMatch') }} </p>
          <!-- Submit -->
          <button type="submit" class="irus-btn irus-btn--primary mt-2" :disabled="loading" >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
            {{ $t('common.createAccount') }}
          </button>
        </form>

        <!-- Divider -->
        <div class="d-flex align-items-center my-4">
          <div class="flex-grow-1 border-top"></div>
          <span class="px-3 text-muted small">
            {{ $t('common.or') }}
          </span>
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
        <p class="text-center text-muted small mt-4 mb-0">
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
</template>
<script setup>
import { ref, computed } from 'vue'
import { useLocalePath } from '#imports'
import UserIcon from '@/components/Icons/UserIcon.vue'
import EmailIcon from '@/components/Icons/EmailIcon.vue'
import PhoneIcon from '@/components/Icons/PhoneIcon.vue'
import LockIcon from '@/components/Icons/LockIcon.vue'
import ShowEye from '@/components/Icons/ShowEye.vue'
import HideEye from '@/components/Icons/HideEye.vue'
import GoogleLogo from '@/components/Icons/Logo/GoogleLogo.vue'
import FacebookLogo from '@/components/Icons/Logo/FacebookLogo.vue'
import TwitterLogo from '@/components/Icons/Logo/TwitterLogo.vue'
import AppleLogo from '@/components/Icons/Logo/AppleLogo.vue'

const localePath = useLocalePath()
const fullName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

const passwordError = computed(() => {
  return password.value && confirmPassword.value && password.value !== confirmPassword.value
})

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    return
  }
  
  loading.value = true
  try {
    // Implement register logic here
    console.log('Register with:', {
      fullName: fullName.value,
      email: email.value,
      phone: phone.value,
      password: password.value
    })
    // Navigate to login after successful registration
    // navigateTo('/register/login')
  } catch (error) {
    console.error('Register error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  max-width: 420px;
}
.social-btn {
  transition: all 0.2s ease;
}

.social-btn:hover {
  border-color: #ccc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
@media screen and (max-width: 480px) {
  .register-card {
    padding: 32px 24px;
  }
}
</style>

