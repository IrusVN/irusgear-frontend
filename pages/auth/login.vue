<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <!-- Header -->
        <div class="auth-header">
          <h1 class="auth-title">Sign in</h1>
          <p class="auth-subtitle">
            New user? <NuxtLink to="/auth/register" class="auth-link">Create an account</NuxtLink>
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="auth-form">
          <!-- Email -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input 
                type="email" 
                class="form-control" 
                placeholder="Email Address"
                v-model="email"
                required
              />
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                class="form-control" 
                placeholder="Password"
                v-model="password"
                required
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                  <line x1="2" x2="22" y1="2" y2="22"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Forgot Password -->
          <div class="forgot-password-link">
            <NuxtLink to="/auth/forgot-password">Forgot password?</NuxtLink>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Login
          </button>
        </form>

        <!-- Divider -->
        <div class="divider">
          <span>or</span>
        </div>

        <!-- Social Login -->
        <div class="social-section">
          <p class="social-title">Join With Your Favourite Social Media Account</p>
          <div class="social-buttons">
            <button class="social-btn google">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button class="social-btn facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button class="social-btn twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
            <button class="social-btn apple">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Terms -->
        <div class="terms-text">
          <p>
            By signing in with an account, you agree to SO's
            <NuxtLink to="/support">Terms of Service</NuxtLink> and <NuxtLink to="/support">Privacy Policy</NuxtLink>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    // Implement login logic here
    console.log('Login with:', email.value, password.value)
    // Navigate to dashboard after successful login
    // navigateTo('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
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

.auth-header {
  margin-bottom: 32px;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.auth-subtitle {
  font-size: 14px;
  color: #666;
}

.auth-link {
  color: #1a1a1a;
  font-weight: 600;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.toggle-password {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
}

.toggle-password:hover {
  color: #666;
}

.forgot-password-link {
  text-align: left;
}

.forgot-password-link a {
  font-size: 14px;
  color: #1a1a1a;
  text-decoration: none;
}

.forgot-password-link a:hover {
  text-decoration: underline;
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
  margin-top: 8px;
}

.btn-submit:hover {
  background: #333;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  margin: 28px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e5e5;
}

.divider span {
  padding: 0 16px;
  color: #999;
  font-size: 14px;
}

.social-section {
  text-align: center;
}

.social-title {
  font-size: 13px;
  color: #666;
  margin-bottom: 20px;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid #e5e5e5;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-btn:hover {
  border-color: #ccc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.terms-text {
  margin-top: 32px;
  text-align: center;
}

.terms-text p {
  font-size: 12px;
  color: #999;
  line-height: 1.6;
}

.terms-text a {
  color: #1a1a1a;
  text-decoration: underline;
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
