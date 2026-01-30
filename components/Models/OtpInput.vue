<template>
  <div class="w-100 otp-container">
    <div class="text-center mb-4">
      <div class="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
        <i class="bi bi-shield-check fs-2 text-dark"></i>
      </div>
      <h4 class="fw-bold text-dark mb-2">Xác thực tài khoản</h4>
      <p class="text-secondary small">
        Mã xác thực đã được gửi đến email
        <span class="text-dark fw-bold">{{ authStore.verifyEmail }}</span>
      </p>
    </div>

    <div class="irus-form">
      <div class="mb-3">
        <label class="fw-bold text-dark small mb-3 d-block text-center">
          Nhập mã xác thực
        </label>
        
        <div class="d-flex justify-content-center gap-2 otp-wrapper">
          <input
            v-for="(digit, index) in 6"
            :key="index"
            :ref="el => otpFields[index] = el"
            v-model="digits[index]"
            type="text"
            maxlength="1"
            inputmode="numeric"
            class="irus-otp-square text-center fw-bold fs-3"
            @input="handleInput($event, index)"
            @keydown.delete="handleDelete($event, index)"
            @paste="handlePaste"
            @keyup.enter="handleVerify"
          />
        </div>
        
        <div v-if="localError || authStore.error" class="text-danger small mt-3 text-center fw-medium animate-fade">
          <i class="bi bi-exclamation-circle me-1"></i> {{ localError || authStore.error }}
        </div>
      </div>

      <button 
        @click="handleVerify"
        class="irus-btn irus-btn--primary mt-2 d-flex align-items-center justify-content-center gap-2"
        :class="{ 'opacity-50': isOtpIncomplete || authStore.loading }"
        :disabled="isOtpIncomplete || authStore.loading"
      >
        <span v-if="authStore.loading" class="spinner-border spinner-border-sm text-white"></span>
        <span>Xác nhận</span>
      </button>

      <div class="text-center mt-3 d-flex flex-column gap-2">
        <p class="small text-secondary mb-0">
          Bạn chưa nhận được mã? 
          <button v-if="timer === 0" @click="handleResend" class="btn btn-link p-0 text-dark fw-bold text-decoration-none small">Gửi lại</button>
          <span v-else class="text-dark fw-bold">{{ formatTime(timer) }}</span>
        </p>
        
        <button @click="authStore.resetToRegister()" class="btn btn-link text-secondary text-decoration-none small">
           Quay lại đăng ký
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useLocalePath, navigateTo } from '#imports'

const authStore = useAuthStore()
const localePath = useLocalePath()
const digits = reactive(['', '', '', '', '', ''])
const otpFields = ref([])
const localError = ref('')
const timer = ref(60)
let intervalId = null

const isOtpIncomplete = computed(() => digits.some(d => d === ''))

const handleInput = (e, index) => {
  const val = e.target.value.replace(/[^0-9]/g, '')
  digits[index] = val.charAt(val.length - 1)

  if (digits[index] && index < 5) {
    otpFields.value[index + 1].focus()
  }
  authStore.otpCode = digits.join('')
}

const handleDelete = (e, index) => {
  if (!digits[index] && index > 0) {
    otpFields.value[index - 1].focus()
  }
  digits[index] = ''
  authStore.otpCode = digits.join('')
}

const handlePaste = (e) => {
  const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6)
  if (pasteData) {
    pasteData.split('').forEach((char, i) => {
      digits[i] = char
    })
    otpFields.value[Math.min(pasteData.length, 5)].focus()
    authStore.otpCode = digits.join('')
  }
}

const handleVerify = async () => { debugger
  localError.value = ''
  if (authStore.otpCode.length < 6) {
    localError.value = 'Vui lòng nhập đủ 6 số.'
    return
  }
  const result = await authStore.verifyOtp();
  
  if (!result.status === true) {
    localError.value = result.message
    return
  }
  navigateTo(localePath('/auth/login'));
}

const handleResend = async () => { debugger
  localError.value = ''
  const response = await authStore.resendOtp()
  if (!response === true) {
    localError.value = response.message
    startTimer()
    return
  }
  localError.value = response.message
  startTimer()
}

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const startTimer = () => {
  timer.value = 60
  clearInterval(intervalId)
  intervalId = setInterval(() => {
    if (timer.value > 0) timer.value--
    else clearInterval(intervalId)
  }, 1000)
}

onMounted(() => {
  if (!authStore.verifyEmail) {
    authStore.registerStep = 1;
  } else {
    startTimer();
  }
})

onUnmounted(() => {
  clearInterval(intervalId)
  authStore.error = null
})
</script>

<style scoped>
.otp-wrapper {
  perspective: 1000px;
}

.irus-otp-square {
  width: 50px;
  height: 60px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background: #f9f9f9;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  font-family: 'Public Sans', sans-serif;
}

.irus-otp-square:focus {
  border-color: #1a1a1a;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

/* Hiệu ứng khi đã nhập số */
.irus-otp-square:not(:placeholder-shown) {
  border-color: #1a1a1a;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.irus-btn {
  width: 100%;
  height: 52px;
  border-radius: 26px;
  font-weight: 600;
  border: none;
}

.irus-btn--primary {
  background: #1a1a1a;
  color: #fff;
}
</style>
