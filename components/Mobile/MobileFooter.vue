<template>
  <footer class="mobile-footer">
    <!-- Block 1: Quick Links -->
    <div class="mobile-footer-block">
      <div class="mobile-footer-links-grid">
        <div class="mobile-footer-link-col">
          <NuxtLink v-for="link in quickLinksLeft" :key="link.label" :to="link.to" class="mobile-footer-link">
            {{ link.label }}
          </NuxtLink>
        </div>
        <div class="mobile-footer-link-col">
          <NuxtLink v-for="link in quickLinksRight" :key="link.label" :to="link.to" class="mobile-footer-link">
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Block 2: Info Links -->
    <div class="mobile-footer-block">
      <div class="mobile-footer-links-grid">
        <div class="mobile-footer-link-col">
          <NuxtLink v-for="link in infoLinksLeft" :key="link.label" :to="link.to" class="mobile-footer-link">
            {{ link.label }}
          </NuxtLink>
        </div>
        <div class="mobile-footer-link-col">
          <NuxtLink v-for="link in infoLinksRight" :key="link.label" :to="link.to" class="mobile-footer-link">
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Block 3: Company Info -->
    <div class="mobile-footer-company">
      <img src="/image/logo-irusgear-black.png" alt="IrusGear" class="mobile-footer-logo" />

      <p class="mobile-footer-desc">
        {{ $t('mobile.footer.companyDesc') }}
      </p>

      <div class="mobile-footer-contact">
        <span><i class="bi bi-geo-alt-fill"></i> {{ $t('mobile.footer.address') }}</span>
        <span><i class="bi bi-telephone-fill"></i> {{ $t('mobile.footer.phone') }}</span>
      </div>

      <div class="mobile-footer-socials">
        <a href="#" class="mobile-social-btn" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
        <a href="#" class="mobile-social-btn" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
        <a href="#" class="mobile-social-btn" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
        <a href="#" class="mobile-social-btn" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
      </div>
    </div>

    <!-- Block 4: Legal -->
    <div class="mobile-footer-legal">
      <span class="mobile-footer-copyright">{{ $t('mobile.footer.copyright') }}</span>
      <div class="mobile-footer-legal-links">
        <a href="#">{{ $t('mobile.footer.terms') }}</a>
        <span class="mobile-footer-legal-sep">|</span>
        <a href="#">{{ $t('mobile.footer.privacy') }}</a>
        <span class="mobile-footer-legal-sep">|</span>
        <a href="#">{{ $t('mobile.footer.cookies') }}</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
const quickLinksLeft = [
  { label: 'iPhone Air', to: '/products?q=iphone+air' },
  { label: 'iPhone 17', to: '/products?q=iphone+17' },
  { label: 'iPhone 17 Pro', to: '/products?q=iphone+17+pro' },
  { label: 'iPhone 17 Pro Max', to: '/products?q=iphone+17+pro+max' },
  { label: 'iPhone 16 Pro Max', to: '/products?q=iphone+16+pro+max' },
  { label: 'iPhone 16', to: '/products?q=iphone+16' },
  { label: 'Macbook Neo', to: '/products?q=macbook+neo' },
]

const quickLinksRight = [
  { label: 'Laptop', to: '/products?category=laptop' },
  { label: 'Laptop Acer', to: '/products?q=laptop+acer' },
  { label: 'Laptop Dell', to: '/products?q=laptop+dell' },
  { label: 'Laptop HP', to: '/products?q=laptop+hp' },
  { label: 'Tivi', to: '/products?category=tivi' },
  { label: 'Tivi Samsung', to: '/products?q=tivi+samsung' },
  { label: 'Tivi Sony', to: '/products?q=tivi+sony' },
]

const infoLinksLeft = [
  { label: 'Điện thoại', to: '/products?category=dien-thoai' },
  { label: 'Điện thoại iPhone', to: '/products?q=iphone' },
  { label: 'Xiaomi', to: '/products?q=xiaomi' },
  { label: 'Samsung Galaxy', to: '/products?q=samsung+galaxy' },
  { label: 'OPPO', to: '/products?q=oppo' },
]

const infoLinksRight = [
  { label: 'Đồ gia dụng', to: '/products?category=do-gia-dung' },
  { label: 'Máy hút bụi', to: '/products?q=may+hut+bui' },
  { label: 'Camera', to: '/products?q=camera' },
  { label: 'Trả góp', to: '/products?installment=true' },
]
</script>

<style scoped>
.mobile-footer {
  background: #f2f3f7;
  padding-bottom: 8px;
}

/* ─── Blocks ─── */
.mobile-footer-block {
  padding: 16px 16px 10px;
  border-bottom: 1px solid #e5e7eb;
}

.mobile-footer-links-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 24px;
}

.mobile-footer-link-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mobile-footer-link {
  font-size: 0.75rem;
  color: #6b7280;
  text-decoration: none;
  line-height: 1.4;
  transition: color 0.12s;
}

.mobile-footer-link:active,
.mobile-footer-link:hover {
  color: #1f2937;
}

/* ─── Company ─── */
.mobile-footer-company {
  padding: 20px 16px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.mobile-footer-logo {
  height: 26px;
  width: auto;
  margin-bottom: 10px;
}

.mobile-footer-desc {
  font-size: 0.72rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 12px;
}

.mobile-footer-contact {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 14px;
}

.mobile-footer-contact span {
  font-size: 0.7rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
}

.mobile-footer-contact .bi {
  font-size: 0.75rem;
  color: #9ca3af;
}

.mobile-footer-socials {
  display: flex;
  gap: 8px;
}

.mobile-social-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid #d1d5db;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  font-size: 0.95rem;
  text-decoration: none;
  transition: background 0.12s, color 0.12s;
}

.mobile-social-btn:active {
  background: #1f2937;
  color: #fff;
  border-color: #1f2937;
}

/* ─── Legal ─── */
.mobile-footer-legal {
  padding: 14px 16px;
  text-align: center;
}

.mobile-footer-copyright {
  display: block;
  font-size: 0.68rem;
  color: #6b7280;
  margin-bottom: 6px;
}

.mobile-footer-legal-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.mobile-footer-legal-links a {
  font-size: 0.68rem;
  color: #6b7280;
  text-decoration: none;
}

.mobile-footer-legal-links a:hover {
  color: #1f2937;
}

.mobile-footer-legal-sep {
  font-size: 0.62rem;
  color: #d1d5db;
}
</style>
