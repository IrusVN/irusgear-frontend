<template>
  <div>
    <div class="d-flex flex-column min-vh-100">
      <ClientOnly>
        <CustomerSidebar />
        <template #fallback>
          <div class="customer-sidebar-ssr-placeholder"></div>
        </template>
      </ClientOnly>

      <main class="flex-grow-1 main-with-customer-sidebar">
        <Breadcrumb />
        <div class="profile-layout">
          <div class="container-xl">
            <!-- Member Info Card -->
            <div class="profile-layout__member-card">
              <div class="profile-layout__member-left">
                <div class="profile-layout__avatar-wrap">
                  <div class="profile-layout__avatar">
                    <img :src="avatarUrl" alt="Avatar" class="profile-layout__avatar-img" loading="lazy" />
                  </div>
                </div>
                <div class="profile-layout__member-info">
                  <h2 class="profile-layout__member-name">{{ fullName }}</h2>
                  <p class="profile-layout__member-phone">
                    {{ maskedPhone }}
                    <button type="button" class="profile-layout__toggle-phone">
                      <i class="bi bi-eye-slash"></i>
                    </button>
                  </p>
                  <div class="profile-layout__rank-badges">
                    <span class="profile-layout__rank-badge profile-layout__rank-badge--null">S-NULL</span>
                    <span class="profile-layout__rank-badge profile-layout__rank-badge--student">S-Student</span>
                  </div>
                  <div class="profile-layout__renew-hint">
                    <i class="bi bi-clock"></i>
                    Cập nhật lại sau 01/01/2027
                  </div>
                </div>
              </div>
              <div class="profile-layout__member-stats">
                <div class="profile-layout__stat-group">
                  <div class="profile-layout__stat-item">
                    <div class="profile-layout__stat-icon">
                      <img src="https://cdn-static.smember.com.vn/_next/static/media/cart-icon.3e4e1d83.svg" alt="Đơn hàng" loading="lazy" />
                    </div>
                    <div class="profile-layout__stat-content">
                      <div class="profile-layout__stat-value">{{ totalOrders }}</div>
                      <div class="profile-layout__stat-label">Tổng số đơn hàng{{ isDesktop ? ' đã mua' : '' }}</div>
                    </div>
                  </div>
                  <div class="profile-layout__stat-divider"></div>
                  <div class="profile-layout__stat-item">
                    <div class="profile-layout__stat-icon">
                      <img src="https://cdn-static.smember.com.vn/_next/static/media/money-icon.3e6b67af.svg" alt="Tổng tiền" loading="lazy" />
                    </div>
                    <div class="profile-layout__stat-content">
                      <div class="profile-layout__stat-value">{{ totalSpend.formatted }}</div>
                      <div class="profile-layout__stat-label">
                        Tổng tiền tích lũy
                        <span class="profile-layout__stat-dot"></span>
                        Từ 01/01/2025
                      </div>
                      <div v-if="isDesktop" class="profile-layout__rank-progress">
                        Cần chi tiêu thêm <strong>3.000.000</strong> để lên hạng <strong>S-NEW</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="!isDesktop" class="profile-layout__rank-progress profile-layout__rank-progress--mobile">
                  Cần chi tiêu thêm <strong>3.000.000đ</strong> để lên hạng <strong>S-NEW</strong>
                </div>
                <div v-if="isDesktop" class="profile-layout__channel-note">
                  <i class="bi bi-info-circle"></i>
                  Tổng tiền và số đơn hàng được tính chung từ IrusGear.
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="profile-layout__quick-actions">
              <a href="#" class="profile-layout__quick-action">
                <div class="profile-layout__quick-action-icon">
                  <img src="https://cdn-static.smember.com.vn/_next/static/media/rank-icon.d0f44c06.svg" alt="Hạng thành viên" loading="lazy" />
                </div>
                <span>Hạng thành viên</span>
              </a>
              <a href="#" class="profile-layout__quick-action">
                <div class="profile-layout__quick-action-icon">
                  <img src="https://cdn-static.smember.com.vn/_next/static/media/promotion-icon.99af272d.svg" alt="Mã giảm giá" loading="lazy" />
                </div>
                <span>Mã giảm giá</span>
              </a>
              <a :href="localePath('/orders')" class="profile-layout__quick-action">
                <div class="profile-layout__quick-action-icon">
                  <img src="https://cdn-static.smember.com.vn/_next/static/media/history-icon.2ebe1813.svg" alt="Lịch sử mua hàng" loading="lazy" />
                </div>
                <span>Lịch sử mua hàng</span>
              </a>
              <a href="#" class="profile-layout__quick-action">
                <div class="profile-layout__quick-action-icon">
                  <img src="https://cdn-static.smember.com.vn/_next/static/media/address-icon.169a4d95.svg" alt="Sổ địa chỉ" loading="lazy" />
                </div>
                <span>Sổ địa chỉ</span>
              </a>
              <a href="#" class="profile-layout__quick-action">
                <div class="profile-layout__quick-action-icon">
                  <img src="https://cdn-static.smember.com.vn/_next/static/media/edu-icon.76bd96ea.svg" alt="S-Student & S-Teacher" loading="lazy" />
                </div>
                <span>S-Student & S-Teacher</span>
              </a>
              <a href="#" class="profile-layout__quick-action">
                <div class="profile-layout__quick-action-icon">
                  <img src="https://cdn-static.smember.com.vn/_next/static/media/link-icon.1de266bc.svg" alt="Liên kết tài khoản" loading="lazy" />
                </div>
                <span>Liên kết tài khoản</span>
              </a>
            </div>

            <!-- Body: Sidebar + Main -->
            <div class="profile-layout__body">
              <!-- Left Sidebar -->
              <aside class="profile-layout__sidebar d-none d-md-block">
                <nav class="profile-layout__sidebar-nav">
                  <a :href="localePath('/profile')" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'overview' }">
                    <i class="bi bi-person"></i>
                    <span>Tổng quan</span>
                  </a>
                  <a :href="localePath('/orders')" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'orders' }">
                    <i class="bi bi-bag-check"></i>
                    <span>Lịch sử mua hàng</span>
                  </a>
                  <a :href="localePath('/warranty')" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'warranty' }">
                    <i class="bi bi-shield-check"></i>
                    <span>Tra cứu bảo hành</span>
                  </a>
                  <a :href="localePath('/tradein')" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'tradein' }">
                    <i class="bi bi-arrow-left-right"></i>
                    <span>Lịch sử thu cũ</span>
                  </a>

                  <div class="profile-layout__sidebar-divider"></div>

                  <a :href="localePath('/promotion')" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'rank' }">
                    <i class="bi bi-star"></i>
                    <span>Hạng thành viên và ưu đãi</span>
                  </a>
                  <a v-if="false" href="#" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'sbusiness' }">
                    <i class="bi bi-briefcase"></i>
                    <span>Ưu đãi và đơn hàng S-Business</span>
                  </a>
                  <a v-if="false" href="#" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'student' }">
                    <i class="bi bi-mortarboard"></i>
                    <span>Ưu đãi S-Student và S-Teacher</span>
                  </a>

                  <div class="profile-layout__sidebar-divider"></div>

                  <a href="/user-info" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'user-info' }">
                    <i class="bi bi-gear"></i>
                    <span>Thông tin tài khoản</span>
                  </a>
                  <a v-if="false" href="#" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'store' }">
                    <i class="bi bi-geo-alt"></i>
                    <span>Tìm kiếm cửa hàng</span>
                  </a>
                  <a href="/policy" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'policy' }">
                    <i class="bi bi-journal-text"></i>
                    <span>Chính sách bảo hành</span>
                  </a>
                  <a v-if="false" href="#" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'feedback' }">
                    <i class="bi bi-chat-left-text"></i>
                    <span>Góp ý - Phản hồi - Hỗ trợ</span>
                  </a>
                  <a href="/tos" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'tos' }">
                    <i class="bi bi-file-earmark-text"></i>
                    <span>Điều khoản sử dụng</span>
                  </a>

                  <div class="profile-layout__sidebar-divider"></div>

                  <button type="button" class="profile-layout__sidebar-item profile-layout__sidebar-item--logout" @click="handleLogout">
                    <i class="bi bi-box-arrow-right"></i>
                    <span>Đăng xuất</span>
                  </button>
                </nav>

                <div class="profile-layout__app-cta">
                  <p class="profile-layout__app-cta-text">Mua sắm dễ dàng - Ưu đãi ngập tràn cùng IrusGear</p>
                  <div class="profile-layout__app-cta-content">
                    <div class="profile-layout__qr-wrap">
                      <img src="https://cdn2.cellphones.com.vn/400x,webp/media/wysiwyg/Web/Logo/QR_appGeneral-v2.png" alt="QR Code" loading="lazy" />
                    </div>
                    <div class="profile-layout__store-links">
                      <a href="#" target="_blank" rel="nofollow">
                        <img src="https://cdn2.cellphones.com.vn/200x,webp/media/wysiwyg/downloadANDROID.png" alt="Tải từ Google Play" loading="lazy" />
                      </a>
                      <a href="#" target="_blank" rel="nofollow">
                        <img src="https://cdn2.cellphones.com.vn/200x,webp/media/wysiwyg/downloadiOS.png" alt="Tải từ App Store" loading="lazy" />
                      </a>
                    </div>
                  </div>
                </div>
              </aside>

              <!-- Main Content Slot -->
              <div class="profile-layout__main">
                <slot />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AddToCartSheet />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useLocalePath, useRoute } from '#imports'
import CustomerSidebar from '@/components/Sidebar/CustomerSidebar.vue'
import Footer from '@/components/Footer/Footer.vue'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import AddToCartSheet from '@/components/Cart/AddToCartSheet.vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useDeviceDetection } from '@/composables/useDeviceDetection'

const localePath = useLocalePath()
const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const { user } = storeToRefs(authStore)
useDeviceDetection()

const isDesktop = ref(false)

const activeSidebarItem = computed(() => {
  const path = route.path
  if (path.includes('/orders')) return 'orders'
  if (path.includes('/warranty')) return 'warranty'
  if (path.includes('/tradein')) return 'tradein'
  if (path.includes('/profile')) return 'overview'
  if (path.includes('/promotion')) return 'rank'
  if (path.includes('/user-info')) return 'user-info'
  if (path.includes('/policy')) return 'policy'
  if (path.includes('/tos')) return 'tos'
  return 'overview'
})

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

  if (!authStore.sessionResolved && !authStore.sessionLoading) {
    authStore.fetchUser().catch(() => {})
  }
  cartStore.fetchCart({ silent: true }).catch(() => {})
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* ── Layout Wrapper ─────────────────────── */
.profile-layout {
  padding: 156px 0 60px;
}

/* ── Member Card ───────────────────────── */
.profile-layout__member-card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 16px;
}

.profile-layout__member-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.profile-layout__avatar-wrap {
  flex-shrink: 0;
}

.profile-layout__avatar {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  overflow: hidden;
  background: #f4f4f5;
}

.profile-layout__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-layout__member-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.profile-layout__member-name {
  font-size: 16px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
  line-height: 1.3;
}

.profile-layout__member-phone {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #71717a;
  margin: 0;
}

.profile-layout__toggle-phone {
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

.profile-layout__rank-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.profile-layout__rank-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.profile-layout__rank-badge--null {
  background: #f4f4f5;
  color: #18181b;
}

.profile-layout__rank-badge--student {
  background: #ed0017;
  color: #fff;
}

.profile-layout__renew-hint {
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

.profile-layout__renew-hint i {
  font-size: 12px;
  color: #71717a;
}

/* ── Stats ─────────────────────────────── */
.profile-layout__member-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.profile-layout__stat-group {
  display: flex;
  align-items: stretch;
  gap: 16px;
}

.profile-layout__stat-item {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.profile-layout__stat-divider {
  width: 1px;
  background: #ed0017;
  flex-shrink: 0;
  margin: 4px 0;
}

.profile-layout__stat-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f4f4f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-layout__stat-icon img {
  width: 20px;
  height: 19px;
  object-fit: contain;
}

.profile-layout__stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.profile-layout__stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #18181b;
  line-height: 1.2;
}

.profile-layout__stat-label {
  font-size: 12px;
  color: #71717a;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.profile-layout__stat-dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #e4e4e7;
}

.profile-layout__rank-progress {
  margin-top: 4px;
  padding: 4px 10px;
  background: linear-gradient(90deg, #f7f7f8, #fff);
  border-radius: 8px;
  font-size: 12px;
  color: #71717a;
}

.profile-layout__rank-progress--mobile {
  display: block;
}

.profile-layout__rank-progress strong {
  color: #18181b;
}

.profile-layout__channel-note {
  display: none;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: linear-gradient(90deg, #f7f7f8, #fff);
  border-radius: 8px;
  font-size: 12px;
  color: #71717a;
}

/* ── Quick Actions ─────────────────────── */
.profile-layout__quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.profile-layout__quick-action {
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

.profile-layout__quick-action:hover {
  background: #fafafa;
}

.profile-layout__quick-action-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f4f4f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-layout__quick-action-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.profile-layout__quick-action span {
  font-size: 11px;
  font-weight: 500;
  color: #18181b;
  text-align: center;
  line-height: 1.3;
}

/* ── Body: Sidebar + Main ─────────────── */
.profile-layout__body {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

/* ── Sidebar ───────────────────────────── */
.profile-layout__sidebar {
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

.profile-layout__sidebar::-webkit-scrollbar {
  width: 4px;
}

.profile-layout__sidebar::-webkit-scrollbar-thumb {
  background: #e4e4e7;
  border-radius: 999px;
}

.profile-layout__sidebar-nav {
  padding: 8px 0;
  flex: 1;
}

.profile-layout__sidebar-item {
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

.profile-layout__sidebar-item::before {
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

.profile-layout__sidebar-item:hover {
  background: #f4f4f5;
  color: #18181b;
}

.profile-layout__sidebar-item:hover::before {
  background: #d70018;
}

.profile-layout__sidebar-item i {
  font-size: 20px;
  flex-shrink: 0;
}

.profile-layout__sidebar-item span {
  flex: 1;
}

.profile-layout__sidebar-item--active {
  background: #f4f4f5;
  color: #d70018;
  font-weight: 600;
}

.profile-layout__sidebar-item--active::before {
  background: #d70018;
}

.profile-layout__sidebar-item--active:hover {
  color: #b80015;
}

.profile-layout__sidebar-divider {
  height: 1px;
  background: #f0f0f2;
  margin: 4px 16px;
}

.profile-layout__sidebar-item--logout {
  color: #71717a;
}

.profile-layout__sidebar-item--logout:hover {
  color: #d70018;
}

.profile-layout__sidebar-item--logout::before {
  background: transparent;
}

.profile-layout__sidebar-item--logout:hover::before {
  background: #d70018;
}

/* ── App CTA ───────────────────────────── */
.profile-layout__app-cta {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f2;
}

.profile-layout__app-cta-text {
  font-size: 12px;
  color: #71717a;
  margin: 0 0 12px;
  line-height: 1.5;
}

.profile-layout__app-cta-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-layout__qr-wrap {
  width: 88px;
  height: 88px;
  background: #f4f4f5;
  border-radius: 10px;
  padding: 6px;
  flex-shrink: 0;
}

.profile-layout__qr-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.profile-layout__store-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-layout__store-links a img {
  height: 36px;
  width: auto;
}

/* ── Main Content ──────────────────────── */
.profile-layout__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Responsive ───────────────────────── */
@media (max-width: 991.98px) {
  .profile-layout {
    padding: 16px 0 40px;
  }

  .profile-layout__member-card {
    padding: 16px;
    border-radius: 14px;
  }

  .profile-layout__avatar {
    width: 56px;
    height: 56px;
  }

  .profile-layout__member-name {
    font-size: 15px;
  }

  .profile-layout__stat-value {
    font-size: 16px;
  }

  .profile-layout__stat-icon {
    width: 32px;
    height: 32px;
  }

  .profile-layout__stat-icon img {
    width: 18px;
    height: 17px;
  }

  .profile-layout__stat-divider {
    display: none;
  }

  .profile-layout__stat-group {
    flex-direction: column;
    gap: 12px;
  }

  .profile-layout__quick-actions {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }

  .profile-layout__quick-action {
    padding: 10px 6px;
    border-radius: 12px;
  }

  .profile-layout__quick-action-icon {
    width: 36px;
    height: 36px;
  }

  .profile-layout__quick-action-icon img {
    width: 20px;
    height: 20px;
  }

  .profile-layout__quick-action span {
    font-size: 10px;
  }
}

@media (max-width: 575.98px) {
  .profile-layout__quick-actions {
    gap: 4px;
  }

  .profile-layout__quick-action {
    padding: 8px 4px;
    border-radius: 10px;
  }

  .profile-layout__quick-action-icon {
    width: 32px;
    height: 32px;
  }

  .profile-layout__quick-action-icon img {
    width: 18px;
    height: 18px;
  }

  .profile-layout__quick-action span {
    font-size: 9px;
  }
}

/* Desktop ≥992px */
@media (min-width: 992px) {
  .profile-layout__member-card {
    flex-direction: row;
    align-items: center;
    padding: 24px;
    gap: 32px;
  }

  .profile-layout__member-left {
    flex-shrink: 0;
  }

  .profile-layout__avatar {
    width: 72px;
    height: 72px;
  }

  .profile-layout__member-name {
    font-size: 18px;
  }

  .profile-layout__member-stats {
    flex: 1;
  }

  .profile-layout__stat-group {
    gap: 24px;
  }

  .profile-layout__stat-icon {
    width: 48px;
    height: 48px;
  }

  .profile-layout__stat-icon img {
    width: 26px;
    height: 28px;
  }

  .profile-layout__stat-value {
    font-size: 22px;
  }

  .profile-layout__stat-label {
    font-size: 13px;
  }

  .profile-layout__stat-dot {
    width: 5px;
    height: 5px;
  }

  .profile-layout__stat-divider {
    width: 2px;
  }

  .profile-layout__rank-progress {
    font-size: 12px;
  }

  .profile-layout__channel-note {
    display: flex;
  }

  .profile-layout__quick-actions {
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
  }

  .profile-layout__quick-action {
    padding: 14px 10px;
  }

  .profile-layout__quick-action span {
    font-size: 13px;
  }

  .profile-layout__sidebar {
    width: 280px;
  }

  .profile-layout__main {
    min-width: 0;
  }
}

@media (min-width: 1200px) {
  .profile-layout__sidebar {
    width: 300px;
  }
}
</style>
