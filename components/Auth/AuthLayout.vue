<template>
  <div class="auth-layout d-flex min-vh-100">
    <!-- Left Side - Form -->
    <div class="auth-left flex-grow-1 d-flex flex-column p-4 p-lg-5 bg-white">
      <!-- Logo -->
      <div class="mb-4">
        <NuxtLink :to="localePath('/')" class="logo-link text-decoration-none fs-4 fw-bold">
          <span class="text-dark">IRUS</span><span class="text-secondary">Gear</span>
        </NuxtLink>
      </div>

      <!-- Content -->
      <div class="auth-content flex-grow-1 d-flex flex-column justify-content-center">
        <!-- Header -->
        <div class="mb-4">
          <h1 class="auth-title fw-bold mb-2">{{ title }}</h1>
          <p class="text-secondary mb-0">
            {{ subtitle }}
            <NuxtLink v-if="linkText" :to="localePath(linkTo)" class="link-accent text-dark fw-semibold text-decoration-none">
              {{ linkText }}
            </NuxtLink>
          </p>
        </div>

        <!-- Back Link (for forgot password) -->
        <NuxtLink v-if="showBack" :to="localePath('/auth/login')" class="back-link d-inline-flex align-items-center gap-2 mb-4 text-decoration-none text-secondary small">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {{ backText }}
        </NuxtLink>

        <!-- Form Slot -->
        <slot />

        <!-- Divider -->
        <div v-if="showDivider" class="auth-divider d-flex align-items-center my-4">
          <span class="flex-grow-1 border-top"></span>
          <span class="px-3 text-muted small text-uppercase">{{ dividerText }}</span>
          <span class="flex-grow-1 border-top"></span>
        </div>

        <!-- Social Login -->
        <SocialLogin v-if="showSocial" :text="socialText" />

        <!-- Terms -->
        <p v-if="showTerms" class="terms-text text-center text-muted small mt-4 mb-0">
          {{ termsPrefix }}
          <NuxtLink to="#" class="link-accent text-dark text-decoration-none">{{ termsLink }}</NuxtLink>
          {{ termsAnd }}
          <NuxtLink to="#" class="link-accent text-dark text-decoration-none">{{ policyLink }}</NuxtLink>.
        </p>

        <!-- Bottom Text -->
        <p v-if="bottomText" class="text-center text-secondary small mt-4 mb-0">
          {{ bottomText }}
          <NuxtLink :to="localePath(bottomLinkTo)" class="link-accent fw-semibold text-dark text-decoration-none">
            {{ bottomLinkText }}
          </NuxtLink>
        </p>
      </div>

      <!-- Footer -->
      <div class="mt-auto pt-3">
        <p class="text-muted small mb-0">© 2026 IRUSGear. All rights reserved.</p>
      </div>
    </div>

    <!-- Right Side - Visual -->
    <div class="auth-right flex-grow-1 d-none d-lg-flex align-items-center justify-content-center position-relative overflow-hidden">
      <!-- Decorative Elements -->
      <div class="visual-pattern">
        <div class="pattern-circle"></div>
        <div class="pattern-line"></div>
        <div class="pattern-dots">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div class="visual-content text-center p-5 position-relative" style="z-index: 1;">
        <!-- Icon -->
        <div class="visual-icon d-inline-flex align-items-center justify-content-center rounded-4 mb-4">
          <slot name="visual-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </slot>
        </div>
        
        <!-- Text -->
        <h2 class="text-white fw-semibold fs-4 mb-3">{{ visualTitle }}</h2>
        <p class="visual-description text-white-50 mb-0">{{ visualDescription }}</p>
        
        <!-- Stats -->
        <div class="tech-stats d-flex justify-content-center gap-5 mt-5 pt-4">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <span class="stat-number d-block text-white fw-bold fs-5">{{ stat.value }}</span>
            <span class="stat-label text-white-50 text-uppercase small">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLocalePath } from '#imports'
import SocialLogin from '@/components/Auth/SocialLogin.vue'

const localePath = useLocalePath()

defineProps({
  // Header
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  linkText: { type: String, default: '' },
  linkTo: { type: String, default: '' },
  
  // Back link
  showBack: { type: Boolean, default: false },
  backText: { type: String, default: '' },
  
  // Divider
  showDivider: { type: Boolean, default: true },
  dividerText: { type: String, default: 'or' },
  
  // Social
  showSocial: { type: Boolean, default: true },
  socialText: { type: String, default: '' },
  
  // Terms
  showTerms: { type: Boolean, default: true },
  termsPrefix: { type: String, default: '' },
  termsLink: { type: String, default: '' },
  termsAnd: { type: String, default: '' },
  policyLink: { type: String, default: '' },
  
  // Bottom text
  bottomText: { type: String, default: '' },
  bottomLinkText: { type: String, default: '' },
  bottomLinkTo: { type: String, default: '' },
  
  // Visual panel
  visualTitle: { type: String, default: 'Secure & Minimal' },
  visualDescription: { type: String, default: 'Experience seamless authentication with our modern, security-first approach.' },
  stats: {
    type: Array,
    default: () => [
      { value: '256', label: 'bit encryption' },
      { value: '99.9%', label: 'uptime' },
      { value: '24/7', label: 'support' }
    ]
  }
})
</script>

<style scoped>
/* Left Side */
.auth-left {
  max-width: 560px;
}

.auth-content {
  max-width: 400px;
}

.logo-link:hover {
  opacity: 0.8;
}

/* Typography */
.auth-title {
  font-size: 32px;
  letter-spacing: -0.5px;
}

/* Links */
.link-accent:hover,
.back-link:hover {
  opacity: 0.7;
}

.back-link:hover {
  color: #000 !important;
}

/* Right Side */
.auth-right {
  background: #0a0a0a;
}

/* Visual Icon */
.visual-icon {
  width: 80px;
  height: 80px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.visual-description {
  max-width: 350px;
  line-height: 1.7;
}

/* Stats */
.tech-stats {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-number {
  font-family: 'SF Mono', 'Monaco', monospace;
}

.stat-label {
  letter-spacing: 1px;
  font-size: 11px;
}

/* Decorative Pattern */
.visual-pattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.pattern-circle {
  position: absolute;
  top: 10%;
  right: 15%;
  width: 200px;
  height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  animation: pulse 4s ease-in-out infinite;
}

.pattern-line {
  position: absolute;
  bottom: 20%;
  left: 10%;
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
}

.pattern-dots {
  position: absolute;
  top: 50%;
  left: 5%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pattern-dots span {
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.3; }
}

/* Responsive */
@media (max-width: 991.98px) {
  .auth-left {
    max-width: 100%;
  }
  
  .auth-content {
    max-width: 420px;
    margin: 0 auto;
  }
}
</style>
