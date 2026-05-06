<template>
  <div class="profile-page">
    <div class="container-xl">
      <!-- Member Info Card -->
      <div class="profile-page__member-card">
        <div class="profile-page__member-left">
          <div class="profile-page__avatar-wrap">
            <div class="profile-page__avatar">
              <img
                :src="avatarUrl"
                alt="Avatar"
                class="profile-page__avatar-img"
                loading="lazy"
              />
            </div>
          </div>

          <div class="profile-page__member-info">
            <h2 class="profile-page__member-name">{{ fullName }}</h2>
            <p class="profile-page__member-phone">
              {{ maskedPhone }}
              <button type="button" class="profile-page__toggle-phone" :title="$t('profile.showPhone')">
                <i class="bi bi-eye-slash"></i>
              </button>
            </p>
            <div class="profile-page__rank-badges">
              <span class="profile-page__rank-badge profile-page__rank-badge--null">S-NULL</span>
              <span class="profile-page__rank-badge profile-page__rank-badge--student">S-Student</span>
            </div>
            <div class="profile-page__renew-hint">
              <i class="bi bi-clock"></i>
              Cập nhật lại sau 01/01/2027
            </div>
          </div>
        </div>

        <div class="profile-page__member-stats">
          <div class="profile-page__stat-group">
            <div class="profile-page__stat-item">
              <div class="profile-page__stat-icon">
                <img
                  src="https://cdn-static.smember.com.vn/_next/static/media/cart-icon.3e4e1d83.svg"
                  alt="Đơn hàng"
                  loading="lazy"
                />
              </div>
              <div class="profile-page__stat-content">
                <div class="profile-page__stat-value">{{ totalOrders }}</div>
                <div class="profile-page__stat-label">Tổng số đơn hàng{{ isDesktop ? ' đã mua' : '' }}</div>
              </div>
            </div>

            <div class="profile-page__stat-divider"></div>

            <div class="profile-page__stat-item">
              <div class="profile-page__stat-icon">
                <img
                  src="https://cdn-static.smember.com.vn/_next/static/media/money-icon.3e6b67af.svg"
                  alt="Tổng tiền"
                  loading="lazy"
                />
              </div>
              <div class="profile-page__stat-content">
                <div class="profile-page__stat-value">{{ totalSpend.formatted }}</div>
                <div class="profile-page__stat-label">
                  Tổng tiền tích lũy
                  <span class="profile-page__stat-dot"></span>
                  Từ 01/01/2025
                </div>
                <div v-if="isDesktop" class="profile-page__rank-progress">
                  Cần chi tiêu thêm <strong>3.000.000</strong> để lên hạng <strong>S-NEW</strong>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!isDesktop" class="profile-page__rank-progress profile-page__rank-progress--mobile">
            Cần chi tiêu thêm <strong>3.000.000đ</strong> để lên hạng <strong>S-NEW</strong>
          </div>

          <div v-if="isDesktop" class="profile-page__channel-note">
            <i class="bi bi-info-circle"></i>
            Tổng tiền và số đơn hàng được tính chung từ IrusGear.
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="profile-page__quick-actions">
        <a href="#" class="profile-page__quick-action">
          <div class="profile-page__quick-action-icon">
            <img
              src="https://cdn-static.smember.com.vn/_next/static/media/rank-icon.d0f44c06.svg"
              alt="Hạng thành viên"
              loading="lazy"
            />
          </div>
          <span>Hạng thành viên</span>
        </a>
        <a href="#" class="profile-page__quick-action">
          <div class="profile-page__quick-action-icon">
            <img
              src="https://cdn-static.smember.com.vn/_next/static/media/promotion-icon.99af272d.svg"
              alt="Mã giảm giá"
              loading="lazy"
            />
          </div>
          <span>Mã giảm giá</span>
        </a>
        <a :href="localePath('/orders')" class="profile-page__quick-action">
          <div class="profile-page__quick-action-icon">
            <img
              src="https://cdn-static.smember.com.vn/_next/static/media/history-icon.2ebe1813.svg"
              alt="Lịch sử mua hàng"
              loading="lazy"
            />
          </div>
          <span>Lịch sử mua hàng</span>
        </a>
        <a href="#" class="profile-page__quick-action">
          <div class="profile-page__quick-action-icon">
            <img
              src="https://cdn-static.smember.com.vn/_next/static/media/address-icon.169a4d95.svg"
              alt="Sổ địa chỉ"
              loading="lazy"
            />
          </div>
          <span>Sổ địa chỉ</span>
        </a>
        <a href="#" class="profile-page__quick-action">
          <div class="profile-page__quick-action-icon">
            <img
              src="https://cdn-static.smember.com.vn/_next/static/media/edu-icon.76bd96ea.svg"
              alt="S-Student & S-Teacher"
              loading="lazy"
            />
          </div>
          <span>S-Student & S-Teacher</span>
        </a>
        <a href="#" class="profile-page__quick-action">
          <div class="profile-page__quick-action-icon">
            <img
              src="https://cdn-static.smember.com.vn/_next/static/media/link-icon.1de266bc.svg"
              alt="Liên kết tài khoản"
              loading="lazy"
            />
          </div>
          <span>Liên kết tài khoản</span>
        </a>
      </div>

      <!-- Main Content Area -->
      <div class="profile-page__body">
        <!-- Left Sidebar -->
        <aside class="profile-page__sidebar d-none d-md-block">
          <nav class="profile-page__sidebar-nav">
            <a href="#" class="profile-page__sidebar-item profile-page__sidebar-item--active">
              <i class="bi bi-person"></i>
              <span>Tổng quan</span>
            </a>
            <a :href="localePath('/orders')" class="profile-page__sidebar-item">
              <i class="bi bi-bag-check"></i>
              <span>Lịch sử mua hàng</span>
            </a>
            <a href="#" class="profile-page__sidebar-item">
              <i class="bi bi-shield-check"></i>
              <span>Tra cứu bảo hành</span>
            </a>
            <a href="#" class="profile-page__sidebar-item">
              <i class="bi bi-arrow-left-right"></i>
              <span>Lịch sử thu cũ</span>
            </a>

            <div class="profile-page__sidebar-divider"></div>

            <a href="#" class="profile-page__sidebar-item">
              <i class="bi bi-star"></i>
              <span>Hạng thành viên và ưu đãi</span>
            </a>
            <a href="#" class="profile-page__sidebar-item">
              <i class="bi bi-briefcase"></i>
              <span>Ưu đãi và đơn hàng S-Business</span>
            </a>
            <a href="#" class="profile-page__sidebar-item">
              <i class="bi bi-mortarboard"></i>
              <span>Ưu đãi S-Student và S-Teacher</span>
            </a>

            <div class="profile-page__sidebar-divider"></div>

            <a href="#" class="profile-page__sidebar-item">
              <i class="bi bi-gear"></i>
              <span>Thông tin tài khoản</span>
            </a>
            <a href="#" class="profile-page__sidebar-item">
              <i class="bi bi-geo-alt"></i>
              <span>Tìm kiếm cửa hàng</span>
            </a>
            <a href="#" class="profile-page__sidebar-item">
              <i class="bi bi-journal-text"></i>
              <span>Chính sách bảo hành</span>
            </a>
            <a href="#" class="profile-page__sidebar-item">
              <i class="bi bi-chat-left-text"></i>
              <span>Góp ý - Phản hồi - Hỗ trợ</span>
            </a>
            <a href="#" class="profile-page__sidebar-item">
              <i class="bi bi-file-earmark-text"></i>
              <span>Điều khoản sử dụng</span>
            </a>

            <div class="profile-page__sidebar-divider"></div>

            <button type="button" class="profile-page__sidebar-item profile-page__sidebar-item--logout" @click="handleLogout">
              <i class="bi bi-box-arrow-right"></i>
              <span>Đăng xuất</span>
            </button>
          </nav>

          <!-- App Download CTA -->
          <div class="profile-page__app-cta">
            <p class="profile-page__app-cta-text">Mua sắm dễ dàng - Ưu đãi ngập tràn cùng IrusGear</p>
            <div class="profile-page__app-cta-content">
              <div class="profile-page__qr-wrap">
                <img
                  src="https://cdn2.cellphones.com.vn/400x,webp/media/wysiwyg/Web/Logo/QR_appGeneral-v2.png"
                  alt="QR Code"
                  loading="lazy"
                />
              </div>
              <div class="profile-page__store-links">
                <a href="https://play.google.com/store/apps/details?id=vn.com.cellphones.android.smember" target="_blank" rel="nofollow">
                  <img
                    src="https://cdn2.cellphones.com.vn/200x,webp/media/wysiwyg/downloadANDROID.png"
                    alt="Tải từ Google Play"
                    loading="lazy"
                  />
                </a>
                <a href="https://apps.apple.com/vn/app/smember/id6502395577?l=vi" target="_blank" rel="nofollow">
                  <img
                    src="https://cdn2.cellphones.com.vn/200x,webp/media/wysiwyg/downloadiOS.png"
                    alt="Tải từ App Store"
                    loading="lazy"
                  />
                </a>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="profile-page__main">
          <!-- Notice Banner: S-Business -->
          <div class="profile-page__notice">
            <div class="profile-page__notice-icon">
              <i class="bi bi-info-circle-fill"></i>
            </div>
            <p class="profile-page__notice-text">
              Đăng ký S-Business để nhận ưu đãi đặc quyền!
            </p>
            <a href="#" class="profile-page__notice-btn">Đăng ký ngay</a>
            <button type="button" class="profile-page__notice-close" aria-label="Đóng">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Notice Banner: Address -->
          <div class="profile-page__notice">
            <div class="profile-page__notice-icon">
              <i class="bi bi-info-circle-fill"></i>
            </div>
            <p class="profile-page__notice-text">
              Thêm địa chỉ để đặt đơn hàng nhanh hơn.
            </p>
            <button type="button" class="profile-page__notice-btn">Thêm địa chỉ</button>
            <button type="button" class="profile-page__notice-close" aria-label="Đóng">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Content Grid -->
          <div class="profile-page__content-grid">
            <!-- Recent Orders -->
            <div class="profile-page__card">
              <div class="profile-page__card-header">
                <h3 class="profile-page__card-title">Đơn hàng gần đây</h3>
                <a href="#" class="profile-page__card-link">Xem tất cả <i class="bi bi-chevron-right"></i></a>
              </div>
              <div class="profile-page__card-body profile-page__card-body--empty">
                <div class="profile-page__empty">
                  <img
                    src="https://cdn-static.smember.com.vn/_next/static/media/empty.f8088c4d.png"
                    alt="Không có đơn hàng"
                    loading="lazy"
                  />
                  <p>Bạn chưa có đơn hàng nào gần đây? Hãy bắt đầu mua sắm ngay nào! <a href="/">Mua sắm ngay</a></p>
                </div>
              </div>
            </div>

            <!-- Your Offers -->
            <div class="profile-page__card">
              <div class="profile-page__card-header">
                <h3 class="profile-page__card-title">Ưu đãi của bạn</h3>
                <a href="#" class="profile-page__card-link">Xem tất cả <i class="bi bi-chevron-right"></i></a>
              </div>
              <div class="profile-page__card-body profile-page__card-body--empty">
                <div class="profile-page__empty">
                  <img
                    src="https://cdn-static.smember.com.vn/_next/static/media/empty.f8088c4d.png"
                    alt="Không có ưu đãi"
                    loading="lazy"
                  />
                  <p>Bạn chưa có ưu đãi nào. <a href="/">Xem sản phẩm</a></p>
                </div>
              </div>
            </div>
          </div>

          <!-- Favorite Products -->
          <div class="profile-page__card">
            <div class="profile-page__card-header">
              <h3 class="profile-page__card-title">Sản phẩm yêu thích</h3>
              <button type="button" class="profile-page__card-link">Xem tất cả <i class="bi bi-chevron-right"></i></button>
            </div>
            <div class="profile-page__card-body">
              <div class="profile-page__favorites-scroll">
                <a href="https://cellphones.com.vn/iphone-17-pro-max.html" target="_blank" class="profile-page__favorite-item">
                  <img
                    src="https://cdn2.cellphones.com.vn/356x356/media/catalog/product/i/p/iphone-17-pro-max_3.jpg"
                    alt="iPhone 17 Pro Max 256GB"
                    loading="lazy"
                  />
                  <div class="profile-page__favorite-info">
                    <div class="profile-page__favorite-name">iPhone 17 Pro Max 256GB | Chính hãng</div>
                    <div class="profile-page__favorite-price">
                      <span class="profile-page__favorite-price-current">37.590.000đ</span>
                      <span class="profile-page__favorite-price-old">37.990.000đ</span>
                    </div>
                  </div>
                  <i class="bi bi-heart-fill profile-page__favorite-heart"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- Featured Banners -->
          <div class="profile-page__card">
            <div class="profile-page__card-header">
              <h3 class="profile-page__card-title">Chương trình nổi bật</h3>
            </div>
            <div class="profile-page__card-body profile-page__card-body--banners">
              <div class="profile-page__banner-carousel">
                <a href="#" class="profile-page__banner-item">
                  <img
                    src="https://cdn2.cellphones.com.vn/690x300/https://dashboard.cellphones.com.vn/storage/edu-uu-dai-sinh-vien.jpg"
                    alt="S-Student & S-Teacher"
                    loading="lazy"
                  />
                </a>
                <div class="profile-page__carousel-dots">
                  <button type="button" class="profile-page__carousel-dot profile-page__carousel-dot--active"></button>
                  <button type="button" class="profile-page__carousel-dot"></button>
                  <button type="button" class="profile-page__carousel-dot"></button>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile App Download -->
          <div class="profile-page__card profile-page__card--mobile-app d-md-none">
            <p class="profile-page__mobile-app-text">Mua sắm dễ dàng - Ưu đãi ngập tràn cùng IrusGear</p>
            <div class="profile-page__mobile-app-content">
              <div class="profile-page__qr-wrap">
                <img
                  src="https://cdn2.cellphones.com.vn/400x,webp/media/wysiwyg/Web/Logo/QR_appGeneral-v2.png"
                  alt="QR Code"
                  loading="lazy"
                />
              </div>
              <div class="profile-page__store-links">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useLocalePath } from '#imports'
import { useAuthStore } from '@/stores/authStore'
import { useDeviceDetection } from '@/composables/useDeviceDetection'

definePageMeta({
  layout: 'default',
})

const localePath = useLocalePath()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
useDeviceDetection()

const isDesktop = ref(false)

const fullName = computed(() => {
  if (!user.value) return 'Khách'
  return `${user.value.first_name || ''} ${user.value.last_name || ''}`.trim() || 'Khách'
})

const maskedPhone = computed(() => {
  if (!user.value?.phone) return '097*****03'
  const phone = String(user.value.phone)
  return phone.slice(0, 3) + '*****' + phone.slice(-2)
})

const avatarUrl = computed(() => {
  if (!user.value) {
    return 'https://ui-avatars.com/api/?name=KH&background=f4f4f5&color=71717a&size=88'
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName.value)}&background=ed0017&color=fff&size=88`
})

// Mock data — replace with store data when API is ready
const totalOrders = ref(0)
const totalSpend = ref({ formatted: '0đ', value: 0 })

const handleLogout = () => {
  authStore.logout()
  navigateTo('/auth/login')
}

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 992
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

useHead({
  title: 'Tài khoản - IrusGear',
})
</script>

<style scoped>
/* ── Page Layout ─────────────────────────────── */
.profile-page {
  padding: 24px 0 60px;
}

/* ── Member Card ─────────────────────────────── */
.profile-page__member-card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 16px;
}

.profile-page__member-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.profile-page__avatar-wrap {
  flex-shrink: 0;
}

.profile-page__avatar {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  overflow: hidden;
  background: #f4f4f5;
}

.profile-page__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-page__member-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.profile-page__member-name {
  font-size: 16px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
  line-height: 1.3;
}

.profile-page__member-phone {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #71717a;
  margin: 0;
}

.profile-page__toggle-phone {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #71717a;
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 1;
}

.profile-page__rank-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.profile-page__rank-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.profile-page__rank-badge--null {
  background: #f4f4f5;
  color: #18181b;
}

.profile-page__rank-badge--student {
  background: #ed0017;
  color: #fff;
}

.profile-page__renew-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: linear-gradient(90deg, #f7f7f8, #fff);
  border-radius: 8px;
  font-size: 12px;
  color: #71717a;
  margin-top: 2px;
}

.profile-page__renew-hint i {
  font-size: 12px;
  color: #71717a;
}

/* ── Stats ─────────────────────────────────────── */
.profile-page__member-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.profile-page__stat-group {
  display: flex;
  align-items: stretch;
  gap: 16px;
}

.profile-page__stat-item {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.profile-page__stat-divider {
  width: 1px;
  background: #ed0017;
  flex-shrink: 0;
  margin: 4px 0;
}

.profile-page__stat-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f4f4f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-page__stat-icon img {
  width: 20px;
  height: 19px;
  object-fit: contain;
}

.profile-page__stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.profile-page__stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #18181b;
  line-height: 1.2;
}

.profile-page__stat-label {
  font-size: 12px;
  color: #71717a;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.profile-page__stat-dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #e4e4e7;
}

.profile-page__rank-progress {
  margin-top: 4px;
  padding: 4px 10px;
  background: linear-gradient(90deg, #f7f7f8, #fff);
  border-radius: 8px;
  font-size: 12px;
  color: #71717a;
}

.profile-page__rank-progress--mobile {
  display: block;
}

.profile-page__rank-progress strong {
  color: #18181b;
}

.profile-page__channel-note {
  display: none;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: linear-gradient(90deg, #f7f7f8, #fff);
  border-radius: 8px;
  font-size: 12px;
  color: #71717a;
}

/* ── Quick Actions ─────────────────────────────── */
.profile-page__quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.profile-page__quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 14px;
  text-decoration: none;
  transition: background 0.15s ease;
}

.profile-page__quick-action:hover {
  background: #fafafa;
}

.profile-page__quick-action-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f4f4f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-page__quick-action-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.profile-page__quick-action span {
  font-size: 11px;
  font-weight: 500;
  color: #18181b;
  text-align: center;
  line-height: 1.3;
}

/* ── Body: Sidebar + Main ─────────────────────── */
.profile-page__body {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

/* ── Sidebar ───────────────────────────────────── */
.profile-page__sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #ececf1;
  display: flex;
  flex-direction: column;
}

.profile-page__sidebar::-webkit-scrollbar {
  width: 4px;
}

.profile-page__sidebar::-webkit-scrollbar-thumb {
  background: #e4e4e7;
  border-radius: 999px;
}

.profile-page__sidebar-nav {
  padding: 8px 0;
  flex: 1;
}

.profile-page__sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #52525b;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  position: relative;
}

.profile-page__sidebar-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: 0 4px 4px 0;
  background: transparent;
  transition: background 0.15s ease;
}

.profile-page__sidebar-item:hover {
  background: #f4f4f5;
  color: #18181b;
}

.profile-page__sidebar-item:hover::before {
  background: #d70018;
}

.profile-page__sidebar-item i {
  font-size: 20px;
  flex-shrink: 0;
}

.profile-page__sidebar-item span {
  flex: 1;
}

.profile-page__sidebar-item--active {
  background: #f4f4f5;
  color: #d70018;
  font-weight: 600;
}

.profile-page__sidebar-item--active::before {
  background: #d70018;
}

.profile-page__sidebar-item--active:hover {
  color: #b80015;
}

.profile-page__sidebar-divider {
  height: 1px;
  background: #f0f0f2;
  margin: 4px 16px;
}

.profile-page__sidebar-item--logout {
  color: #71717a;
}

.profile-page__sidebar-item--logout:hover {
  color: #d70018;
}

.profile-page__sidebar-item--logout::before {
  background: transparent;
}

.profile-page__sidebar-item--logout:hover::before {
  background: #d70018;
}

/* ── App CTA ───────────────────────────────────── */
.profile-page__app-cta {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f2;
}

.profile-page__app-cta-text {
  font-size: 12px;
  color: #71717a;
  margin: 0 0 12px;
  line-height: 1.5;
}

.profile-page__app-cta-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-page__qr-wrap {
  width: 88px;
  height: 88px;
  background: #f4f4f5;
  border-radius: 10px;
  padding: 6px;
  flex-shrink: 0;
}

.profile-page__qr-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.profile-page__store-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-page__store-links a img {
  height: 36px;
  width: auto;
}

/* ── Main Content ──────────────────────────────── */
.profile-page__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Notice Banner ─────────────────────────────── */
.profile-page__notice {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
}

.profile-page__notice-icon {
  color: #3b82f6;
  font-size: 18px;
  flex-shrink: 0;
  display: flex;
}

.profile-page__notice-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
}

.profile-page__notice-btn {
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

.profile-page__notice-btn:hover {
  background: #f1f5f9;
}

.profile-page__notice-close {
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

.profile-page__notice-close:hover {
  color: #18181b;
}

/* ── Card ─────────────────────────────────────── */
.profile-page__card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 16px;
}

.profile-page__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.profile-page__card-title {
  font-size: 15px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
}

.profile-page__card-link {
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

.profile-page__card-link:hover {
  color: #1d4ed8;
}

.profile-page__card-link i {
  font-size: 12px;
}

/* ── Empty State ──────────────────────────────── */
.profile-page__card-body--empty {
  display: flex;
  justify-content: center;
  padding: 24px 16px;
}

.profile-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.profile-page__empty img {
  width: 88px;
  height: auto;
  object-fit: contain;
}

.profile-page__empty p {
  font-size: 13px;
  color: #a1a1aa;
  margin: 0;
  line-height: 1.6;
}

.profile-page__empty p a {
  color: #d70018;
  text-decoration: none;
  font-weight: 500;
}

.profile-page__empty p a:hover {
  text-decoration: underline;
}

/* ── Content Grid ─────────────────────────────── */
.profile-page__content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

/* ── Favorites ─────────────────────────────────── */
.profile-page__favorites-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.profile-page__favorites-scroll::-webkit-scrollbar {
  height: 4px;
}

.profile-page__favorites-scroll::-webkit-scrollbar-thumb {
  background: #e4e4e7;
  border-radius: 999px;
}

.profile-page__favorite-item {
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

.profile-page__favorite-item:hover {
  border-color: #d70018;
}

.profile-page__favorite-item img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
}

.profile-page__favorite-info {
  flex: 1;
  min-width: 0;
}

.profile-page__favorite-name {
  font-size: 13px;
  font-weight: 700;
  color: #18181b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.profile-page__favorite-price {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.profile-page__favorite-price-current {
  font-size: 13px;
  font-weight: 700;
  color: #d70018;
}

.profile-page__favorite-price-old {
  font-size: 11px;
  color: #a1a1aa;
  text-decoration: line-through;
}

.profile-page__favorite-heart {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 14px;
  color: #3b82f6;
}

/* ── Banner Carousel ──────────────────────────── */
.profile-page__card-body--banners {
  padding: 0;
}

.profile-page__banner-carousel {
  position: relative;
}

.profile-page__banner-item {
  display: block;
  border-radius: 12px;
  overflow: hidden;
}

.profile-page__banner-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
}

.profile-page__carousel-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
}

.profile-page__carousel-dot {
  width: 20px;
  height: 4px;
  border-radius: 999px;
  background: #d70018;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: width 0.2s ease;
}

.profile-page__carousel-dot:not(.profile-page__carousel-dot--active) {
  width: 8px;
  background: #e4e4e7;
}

/* ── Mobile App ───────────────────────────────── */
.profile-page__card--mobile-app {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-page__mobile-app-text {
  font-size: 13px;
  color: #71717a;
  margin: 0;
}

.profile-page__mobile-app-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ── Responsive ───────────────────────────────── */
@media (max-width: 991.98px) {
  .profile-page {
    padding: 16px 0 40px;
  }

  .profile-page__member-card {
    padding: 16px;
    border-radius: 14px;
  }

  .profile-page__avatar {
    width: 56px;
    height: 56px;
  }

  .profile-page__member-name {
    font-size: 15px;
  }

  .profile-page__stat-value {
    font-size: 16px;
  }

  .profile-page__stat-icon {
    width: 32px;
    height: 32px;
  }

  .profile-page__stat-icon img {
    width: 18px;
    height: 17px;
  }

  .profile-page__stat-divider {
    display: none;
  }

  .profile-page__stat-group {
    flex-direction: column;
    gap: 12px;
  }

  .profile-page__quick-actions {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }

  .profile-page__quick-action {
    padding: 10px 6px;
    border-radius: 12px;
  }

  .profile-page__quick-action-icon {
    width: 36px;
    height: 36px;
  }

  .profile-page__quick-action-icon img {
    width: 20px;
    height: 20px;
  }

  .profile-page__quick-action span {
    font-size: 10px;
  }

  .profile-page__card {
    padding: 14px;
    border-radius: 14px;
  }

  .profile-page__card-body--empty {
    padding: 16px 12px;
  }

  .profile-page__empty img {
    width: 80px;
  }
}

@media (max-width: 575.98px) {
  .profile-page__quick-actions {
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
  }

  .profile-page__quick-action {
    padding: 8px 4px;
    border-radius: 10px;
  }

  .profile-page__quick-action-icon {
    width: 32px;
    height: 32px;
  }

  .profile-page__quick-action-icon img {
    width: 18px;
    height: 18px;
  }

  .profile-page__quick-action span {
    font-size: 9px;
  }

  .profile-page__notice {
    flex-wrap: wrap;
    gap: 8px;
  }

  .profile-page__notice-text {
    font-size: 13px;
    width: 100%;
    order: 2;
  }

  .profile-page__notice-btn {
    order: 3;
  }

  .profile-page__notice-close {
    order: 1;
    margin-left: auto;
  }

  .profile-page__banner-item img {
    height: 100px;
    border-radius: 10px;
  }

  .profile-page__favorite-item {
    min-width: 200px;
  }

  .profile-page__favorite-item img {
    width: 40px;
    height: 40px;
  }

  .profile-page__favorite-name {
    font-size: 12px;
  }

  .profile-page__favorite-price-current {
    font-size: 12px;
  }
}

/* Desktop ≥992px */
@media (min-width: 992px) {
  .profile-page__member-card {
    flex-direction: row;
    align-items: center;
    padding: 24px;
    gap: 32px;
  }

  .profile-page__member-left {
    flex-shrink: 0;
  }

  .profile-page__avatar {
    width: 72px;
    height: 72px;
  }

  .profile-page__member-name {
    font-size: 18px;
  }

  .profile-page__member-stats {
    flex: 1;
  }

  .profile-page__stat-group {
    gap: 24px;
  }

  .profile-page__stat-icon {
    width: 48px;
    height: 48px;
  }

  .profile-page__stat-icon img {
    width: 26px;
    height: 28px;
  }

  .profile-page__stat-value {
    font-size: 22px;
  }

  .profile-page__stat-label {
    font-size: 13px;
  }

  .profile-page__stat-dot {
    width: 5px;
    height: 5px;
  }

  .profile-page__stat-divider {
    width: 2px;
  }

  .profile-page__rank-progress {
    font-size: 12px;
  }

  .profile-page__channel-note {
    display: flex;
  }

  .profile-page__quick-actions {
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
  }

  .profile-page__quick-action {
    padding: 14px 10px;
  }

  .profile-page__quick-action span {
    font-size: 13px;
  }

  .profile-page__sidebar {
    width: 280px;
  }

  .profile-page__content-grid {
    grid-template-columns: 1fr 1fr;
  }

  .profile-page__banner-item img {
    height: 140px;
  }
}

@media (min-width: 1200px) {
  .profile-page__sidebar {
    width: 300px;
  }

  .profile-page__content-grid {
    grid-template-columns: 1fr 1fr;
  }

  .profile-page__banner-item img {
    height: 160px;
  }
}
</style>
