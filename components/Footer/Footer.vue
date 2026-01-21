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
            <a class="social-btn"><i class="bi bi-facebook"></i></a>
            <a class="social-btn"><i class="bi bi-instagram"></i></a>
            <a class="social-btn"><i class="bi bi-tiktok"></i></a>
            <a class="social-btn"><i class="bi bi-youtube"></i></a>
          </div>
        </div>

        <!-- PRODUCTS -->
        <div class="">
          <h6 class="footer-title">{{ $t('sidebar.menu.products') }}</h6>
          <ul class="footer-list">
            <li><NuxtLink to="#">Laptop & PC</NuxtLink></li>
            <li><NuxtLink to="#">Smart Phone</NuxtLink></li>
            <li><NuxtLink to="#">Thiết bị âm thanh</NuxtLink></li>
            <li><NuxtLink to="#" class="text-danger">Khuyến mãi</NuxtLink></li>
          </ul>
        </div>

        <!-- SUPPORT -->
        <div class="">
          <h6 class="footer-title">{{ $t('common.support') }}</h6>
          <ul class="footer-list">
            <li><NuxtLink to="#">Tra cứu đơn hàng</NuxtLink></li>
            <li><NuxtLink to="#">Chính sách bảo hành</NuxtLink></li>
            <li><NuxtLink to="#">FAQ</NuxtLink></li>
            <li><NuxtLink to="#">Liên hệ</NuxtLink></li>
          </ul>
        </div>

        <!-- NEWSLETTER -->
        <div class="footer-newsletter">
          <h6 class="footer-title">Nhận ưu đãi</h6>
          <p class="text-secondary small mb-3">
            Đăng ký email để nhận voucher
            <strong>500.000đ</strong> cho đơn đầu tiên
          </p>

          <div class="newsletter">
            <input type="email" class="form-control" placeholder="Email của bạn" />
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
          <a class="footer-link-sm">Điều khoản</a>
          <a class="footer-link-sm">Bảo mật</a>
          <a class="footer-link-sm">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup></script>

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
