<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <!-- Back Button -->
        <NuxtLink :to="localePath('/auth/login')" class="back-btn">
          <ArrowLeft />
          {{ $t("register.backToLogin") }}
        </NuxtLink>

        <!-- Header -->
        <div class="auth-header">
          <h1 class="auth-title">{{ $t("register.forgotPassword.title") }}</h1>
          <p class="auth-description">
            {{ $t("register.forgotPassword.description") }}
          </p>
        </div>

        <!-- Success Message -->
        <div v-if="emailSent" class="success-message">
          <div class="success-icon">
            <SuccessIcon />
          </div>
          <h2 class="success-title">{{ $t("register.email.success.emailSent") }}</h2>
          <p class="success-text">
            {{ $t("register.email.success.text") }} <strong>{{ email }}</strong>. 
            {{ $t("register.email.success.followInstructions") }}
          </p>
          <button class="btn-secondary" @click="resetForm">
            {{ $t("register.email.success.sendAnother") }}
          </button>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleForgotPassword" class="auth-form">
          <!-- Email -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">
                <EmailIcon />
              </span>
              <input type="email" class="form-control" :placeholder="$t('common.emailAddress')" v-model="email" required />
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ $t("register.email.sendResetLink") }}
          </button>
        </form>

        <!-- Help Text -->
        <div class="help-section" v-if="!emailSent">
          <p>{{ $t("register.rememberPassword") }} <NuxtLink :to="localePath('/auth/login')">{{ $t("common.signIn") }}</NuxtLink></p>
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
    // Implement forgot password logic here
    console.log('Reset password for:', email.value)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    emailSent.value = true
  } catch (error) {
    console.error('Forgot password error:', error)
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
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 24px;
  transition: color 0.2s ease;
}

.back-btn:hover {
  color: #1a1a1a;
}

.auth-header {
  margin-bottom: 32px;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.auth-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #999;
  display: flex;
  align-items: center;
}

.form-control {
  width: 100%;
  height: 52px;
  padding: 0 48px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  font-size: 15px;
  color: #1a1a1a;
  background: #f9f9f9;
  transition: all 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #1a1a1a;
  background: #fff;
}

.form-control::placeholder {
  color: #999;
}

.btn-submit {
  width: 100%;
  height: 52px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 26px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-submit:hover {
  background: #333;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  width: 100%;
  height: 48px;
  background: transparent;
  color: #1a1a1a;
  border: 1px solid #e5e5e5;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;
}

.btn-secondary:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.help-section {
  margin-top: 28px;
  text-align: center;
}

.help-section p {
  font-size: 14px;
  color: #666;
}

.help-section a {
  color: #1a1a1a;
  font-weight: 600;
  text-decoration: none;
}

.help-section a:hover {
  text-decoration: underline;
}

/* Success State */
.success-message {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  color: #22c55e;
  margin-bottom: 20px;
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.success-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
}

.success-text strong {
  color: #1a1a1a;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 32px 24px;
  }
  
  .auth-title {
    font-size: 24px;
  }
}
</style>
