<template>
  <div class="profile-page">
  <!-- Notice Banner: S-Business -->
  <div v-if="false" class="profile-notice">
    <div class="profile-notice__icon">
      <i class="bi bi-info-circle-fill"></i>
    </div>
    <p class="profile-notice__text">Đăng ký S-Business để nhận ưu đãi đặc quyền!</p>
    <a href="#" class="profile-notice__btn">Đăng ký ngay</a>
    <button type="button" class="profile-notice__close" aria-label="Đóng">
      <i class="bi bi-x-lg"></i>
    </button>
  </div>

  <!-- Notice Banner: Address -->
  <div class="profile-notice">
    <div class="profile-notice__icon">
      <i class="bi bi-info-circle-fill"></i>
    </div>
    <p class="profile-notice__text">Thêm địa chỉ để đặt đơn hàng nhanh hơn.</p>
    <button type="button" class="profile-notice__btn">Thêm địa chỉ</button>
    <button type="button" class="profile-notice__close" aria-label="Đóng">
      <i class="bi bi-x-lg"></i>
    </button>
  </div>

  <!-- Content Grid -->
  <div class="profile-grid">
    <!-- Recent Orders -->
    <div class="profile-card">
      <div class="profile-card__header">
        <h3 class="profile-card__title">Đơn hàng gần đây</h3>
        <a :href="localePath('/orders')" class="profile-card__link">Xem tất cả <i class="bi bi-chevron-right"></i></a>
      </div>
      <div class="profile-card__body profile-card__body--empty">
        <div class="profile-empty">
          <img
            src="https://cdn-static.smember.com.vn/_next/static/media/empty.f8088c4d.png"
            alt="Không có đơn hàng"
            loading="lazy"
          />
          <p>Bạn chưa có đơn hàng nào gần đây? Hãy bắt đầu mua sắm ngay nào! <a :href="localePath('/')">Mua sắm ngay</a></p>
        </div>
      </div>
    </div>

    <!-- Your Offers -->
    <div class="profile-card">
      <div class="profile-card__header">
        <h3 class="profile-card__title">Ưu đãi của bạn</h3>
        <a href="#" class="profile-card__link">Xem tất cả <i class="bi bi-chevron-right"></i></a>
      </div>
      <div class="profile-card__body profile-card__body--empty">
        <div class="profile-empty">
          <img
            src="https://cdn-static.smember.com.vn/_next/static/media/empty.f8088c4d.png"
            alt="Không có ưu đãi"
            loading="lazy"
          />
          <p>Bạn chưa có ưu đãi nào. <a :href="localePath('/')">Xem sản phẩm</a></p>
        </div>
      </div>
    </div>
  </div>

  <!-- Favorite Products -->
  <div class="profile-card">
    <div class="profile-card__header">
      <h3 class="profile-card__title">Sản phẩm yêu thích</h3>
      <button type="button" class="profile-card__link">Xem tất cả <i class="bi bi-chevron-right"></i></button>
    </div>
    <div class="profile-card__body">
      <div class="profile-favorites">
        <a href="https://cellphones.com.vn/iphone-17-pro-max.html" target="_blank" class="profile-favorite-item">
          <img
            src="https://cdn2.cellphones.com.vn/356x356/media/catalog/product/i/p/iphone-17-pro-max_3.jpg"
            alt="iPhone 17 Pro Max 256GB"
            loading="lazy"
          />
          <div class="profile-favorite-info">
            <div class="profile-favorite-name">iPhone 17 Pro Max 256GB | Chính hãng</div>
            <div class="profile-favorite-price">
              <span class="profile-favorite-price-current">37.590.000đ</span>
              <span class="profile-favorite-price-old">37.990.000đ</span>
            </div>
          </div>
          <i class="bi bi-heart-fill profile-favorite-heart"></i>
        </a>
      </div>
    </div>
  </div>

  <!-- Featured Banners -->
  <div v-if="false" class="profile-card">
    <div class="profile-card__header">
      <h3 class="profile-card__title">Chương trình nổi bật</h3>
    </div>
    <div class="profile-card__body profile-card__body--banners">
      <div class="profile-banner-carousel">
        <a href="#" class="profile-banner-item">
          <img
            src="https://cdn2.cellphones.com.vn/690x300/https://dashboard.cellphones.com.vn/storage/edu-uu-dai-sinh-vien.jpg"
            alt="S-Student & S-Teacher"
            loading="lazy"
          />
        </a>
        <div class="profile-carousel-dots">
          <button type="button" class="profile-carousel-dot profile-carousel-dot--active"></button>
          <button type="button" class="profile-carousel-dot"></button>
          <button type="button" class="profile-carousel-dot"></button>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile App Download -->
  <div class="profile-card profile-card--mobile-app d-md-none">
    <p class="profile-mobile-app-text">Mua sắm dễ dàng - Ưu đãi ngập tràn cùng IrusGear</p>
    <div class="profile-mobile-app-content">
      <div class="profile-qr-wrap">
        <img
          src="https://cdn2.cellphones.com.vn/400x,webp/media/wysiwyg/Web/Logo/QR_appGeneral-v2.png"
          alt="QR Code"
          loading="lazy"
        />
      </div>
      <div class="profile-store-links">
        <a href="#" target="_blank" rel="nofollow">
          <img
            src="https://cdn2.cellphones.com.vn/200x,webp/media/wysiwyg/downloadANDROID.png"
            alt="Tải từ Google Play"
            loading="lazy"
          />
        </a>
        <a href="#" target="_blank" rel="nofollow">
          <img
            src="https://cdn2.cellphones.com.vn/200x,webp/media/wysiwyg/downloadiOS.png"
            alt="Tải từ App Store"
            loading="lazy"
          />
        </a>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { useLocalePath } from '#imports'

const localePath = useLocalePath()

definePageMeta({
  layout: 'profile',
})

useHead({
  title: 'Tài khoản - IrusGear',
})
</script>

<style scoped>
/* ── Notice Banner ─────────────────────── */
.profile-notice {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
}

.profile-notice__icon {
  color: #3b82f6;
  font-size: 18px;
  flex-shrink: 0;
  display: flex;
}

.profile-notice__text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
}

.profile-notice__btn {
  flex-shrink: 0;
  padding: 6px 14px;
  border: 1px solid #fff;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: #3b82f6;
  cursor: pointer;
  transition: background 0.15s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.profile-notice__btn:hover {
  background: #f1f5f9;
}

.profile-notice__close {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  font-size: 14px;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.15s ease;
}

.profile-notice__close:hover {
  color: #18181b;
}

/* ── Content Grid ─────────────────────── */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

/* ── Card ─────────────────────────────── */
.profile-card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 16px;
}

.profile-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.profile-card__title {
  font-size: 15px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
}

.profile-card__link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.profile-card__link:hover {
  color: #1d4ed8;
}

.profile-card__link i {
  font-size: 12px;
}

.profile-card__body--empty {
  display: flex;
  justify-content: center;
  padding: 24px 16px;
}

.profile-card__body--banners {
  padding: 0;
}

/* ── Empty State ─────────────────────── */
.profile-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.profile-empty img {
  width: 88px;
  height: auto;
  object-fit: contain;
}

.profile-empty p {
  font-size: 13px;
  color: #a1a1aa;
  margin: 0;
  line-height: 1.6;
}

.profile-empty p a {
  color: #d70018;
  text-decoration: none;
  font-weight: 500;
}

.profile-empty p a:hover {
  text-decoration: underline;
}

/* ── Favorites ───────────────────────── */
.profile-favorites {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.profile-favorites::-webkit-scrollbar {
  height: 4px;
}

.profile-favorites::-webkit-scrollbar-thumb {
  background: #e4e4e7;
  border-radius: 999px;
}

.profile-favorite-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  text-decoration: none;
  flex-shrink: 0;
  min-width: 240px;
  position: relative;
  transition: border-color 0.15s ease;
}

.profile-favorite-item:hover {
  border-color: #d70018;
}

.profile-favorite-item img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
}

.profile-favorite-info {
  flex: 1;
  min-width: 0;
}

.profile-favorite-name {
  font-size: 13px;
  font-weight: 700;
  color: #18181b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.profile-favorite-price {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.profile-favorite-price-current {
  font-size: 13px;
  font-weight: 700;
  color: #d70018;
}

.profile-favorite-price-old {
  font-size: 11px;
  color: #a1a1aa;
  text-decoration: line-through;
}

.profile-favorite-heart {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 14px;
  color: #3b82f6;
}

/* ── Banner Carousel ──────────────────── */
.profile-banner-carousel {
  position: relative;
}

.profile-banner-item {
  display: block;
  border-radius: 12px;
  overflow: hidden;
}

.profile-banner-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
}

.profile-carousel-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
}

.profile-carousel-dot {
  width: 20px;
  height: 4px;
  border-radius: 999px;
  background: #d70018;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: width 0.2s ease;
}

.profile-carousel-dot:not(.profile-carousel-dot--active) {
  width: 8px;
  background: #e4e4e7;
}

/* ── Mobile App ──────────────────────── */
.profile-card--mobile-app {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-mobile-app-text {
  font-size: 13px;
  color: #71717a;
  margin: 0;
}

.profile-mobile-app-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-qr-wrap {
  width: 88px;
  height: 88px;
  background: #f4f4f5;
  border-radius: 10px;
  padding: 6px;
  flex-shrink: 0;
}

.profile-qr-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.profile-store-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-store-links a img {
  height: 36px;
  width: auto;
}

/* ── Responsive ──────────────────────── */
@media (max-width: 575.98px) {
  .profile-notice {
    flex-wrap: wrap;
    gap: 8px;
  }

  .profile-notice__text {
    font-size: 13px;
    width: 100%;
    order: 2;
  }

  .profile-notice__btn {
    order: 3;
  }

  .profile-notice__close {
    order: 1;
    margin-left: auto;
  }

  .profile-card {
    padding: 14px;
    border-radius: 14px;
  }

  .profile-card__body--empty {
    padding: 16px 12px;
  }

  .profile-empty img {
    width: 80px;
  }

  .profile-banner-item img {
    height: 100px;
    border-radius: 10px;
  }

  .profile-favorite-item {
    min-width: 200px;
  }

  .profile-favorite-item img {
    width: 40px;
    height: 40px;
  }

  .profile-favorite-name {
    font-size: 12px;
  }

  .profile-favorite-price-current {
    font-size: 12px;
  }
}

@media (min-width: 992px) {
  .profile-grid {
    grid-template-columns: 1fr 1fr;
  }

  .profile-banner-item img {
    height: 140px;
  }
}

@media (min-width: 1200px) {
  .profile-banner-item img {
    height: 160px;
  }
}

/* ── Bottom Clearance: Mobile Bottom Nav ─── */
@media (max-width: 991.98px) {
  .profile-page {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .profile-page {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .profile-page {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .profile-page {
    padding-bottom: 80px;
  }
}
</style>
