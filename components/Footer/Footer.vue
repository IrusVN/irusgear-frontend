<template>
  <footer class="glass-footer mt-auto pt-5 pb-4 position-relative overflow-hidden">
    <div class="container position-relative z-1">
      <div class="d-flex flex-wrap justify-content-between gap-5 footer-main" >
        <!-- BRAND -->
        <div class="footer-brand">
          <NuxtLink to="/" class="d-inline-flex align-items-center gap-2 mb-3 text-decoration-none">
            <img src="@/public/image/logo-irusgear-black.png" alt="IrusGear" class="navbar-logo" />
          </NuxtLink>

          <p class="text-secondary small mb-4 pe-lg-4">
            {{ $t('footer.description') }}
          </p>

          <div class="d-flex gap-2">
            <a href="https://www.facebook.com/hoang.mai.190636" target="_blank" rel="noopener noreferrer" class="social-btn"><i class="bi bi-facebook"></i></a>
            <a href="https://www.instagram.com/hoanqmaj/" target="_blank" rel="noopener noreferrer" class="social-btn"><i class="bi bi-instagram"></i></a>
            <a class="social-btn"><i class="bi bi-tiktok"></i></a>
            <a class="social-btn"><i class="bi bi-youtube"></i></a>
          </div>
        </div>

        <!-- PRODUCTS -->
        <div class="">
          <h6 class="footer-title">{{ $t('sidebar.menu.products') }}</h6>
          <ul class="footer-list">
            <li><NuxtLink :to="localePath('/products?category=laptop')">{{ $t('footerNav.laptopPc') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/products?category=dien-thoai')">{{ $t('footerNav.smartphone') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/products?category=am-thanh')">{{ $t('footerNav.audioDevice') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/khuyen-mai')" class="text-danger">{{ $t('footerNav.getOffers') }}</NuxtLink></li>
          </ul>
        </div>

        <!-- SUPPORT -->
        <div class="">
          <h6 class="footer-title">{{ $t('common.support') }}</h6>
          <ul class="footer-list">
            <li><NuxtLink :to="localePath('/orders')">{{ $t('footerNav.orderLookup') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/warranty')">{{ $t('footerNav.warrantyPolicy') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/policy')">{{ $t('footerNav.faq') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/lien-he')">{{ $t('footerNav.contactFooter') }}</NuxtLink></li>
          </ul>
        </div>

        <!-- NEWSLETTER -->
        <div class="footer-newsletter">
          <h6 class="footer-title">{{ $t('home.newsletterTitle') }}</h6>
          <p class="text-secondary small mb-3">
            {{ $t('home.newsletterDesc') }}
            <strong>500.000đ</strong> {{ $t('home.firstOrderVoucher') }}
          </p>

          <div class="newsletter">
            <input type="email" class="form-control" :placeholder="$t('home.emailPlaceholder')" />
            <button type="button" class="newsletter-btn">
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>

          <div class="d-flex gap-3 mt-4 text-secondary opacity-75 fs-4">
            <i class="bi bi-credit-card"></i>
            <i class="bi bi-paypal"></i>
            <i class="bi bi-qr-code-scan"></i>
            <i class="bi bi-cash-coin"></i>
          </div>
        </div>
      </div>

      <!-- BOTTOM -->
      <div class="footer-bottom d-flex flex-wrap justify-content-between align-items-center gap-3 mt-5 pt-4" >
        <span class="text-secondary small">
          © 2026 <strong>IrusGear</strong>. All rights reserved.
        </span>

        <div class="d-flex gap-4">
          <NuxtLink :to="localePath('/tos')" class="footer-link-sm">{{ $t('footerNav.terms') }}</NuxtLink>
          <NuxtLink :to="localePath('/policy')" class="footer-link-sm">{{ $t('footerNav.privacy') }}</NuxtLink>
          <NuxtLink :to="localePath('/policy')" class="footer-link-sm">{{ $t('footerNav.cookies') }}</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useLocalePath } from '#imports'

const localePath = useLocalePath()
</script>

<style scoped>
.navbar-logo {
  height: 32px;
}

.glass-footer {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(18px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.footer-brand {
  max-width: 340px;
}
.footer-newsletter {
  max-width: 360px;
}

.footer-title {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-list a {
  display: inline-block;
  font-size: 0.9rem;
  color: #6c757d;
  text-decoration: none;
  transition: transform 0.2s ease, color 0.2s ease;
}

.footer-list a:hover {
  color: #000;
  transform: translateX(4px);
}

.social-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background: #000;
  color: #fff;
  transform: translateY(-3px);
}

.newsletter {
  position: relative;
}

.newsletter input {
  border-radius: 999px;
  padding-right: 48px;
}

.newsletter-btn {
  position: absolute;
  top: 2px;
  right: 4px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: #000;
  color: #fff;
  transition: transform 0.2s ease;
}

.newsletter-btn:hover {
  transform: scale(1.05);
}

.footer-bottom {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.footer-link-sm {
  font-size: 0.8rem;
  color: #6c757d;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link-sm:hover {
  color: #000;
}
</style>
