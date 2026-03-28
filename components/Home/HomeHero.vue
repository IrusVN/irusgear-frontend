<template>
  <div class="hero-bg py-3">
    <div class="container-fluid px-3 mx-auto" style="max-width: 1620px;">
      <div class="hero-layout">

        <!-- LEFT: Category Menu -->
        <div class="bg-white rounded-4 shadow-sm border overflow-hidden flex-shrink-0 d-none d-lg-flex flex-column justify-content-between py-1">
          <a v-for="cat in categories" :key="cat.name" href="#"
            class="d-flex align-items-center gap-2 px-3 text-decoration-none text-dark cat-item border-bottom">
            <i :class="['bi', cat.icon, 'text-center flex-shrink-0']" style="font-size: 1.2rem; width: 22px;"></i>
            <span class="flex-grow-1 fw-semibold" style="font-size: 0.92rem;">{{ cat.name }}</span>
            <i class="bi bi-chevron-right text-secondary" style="font-size:0.7rem"></i>
          </a>
        </div>
        
        <!-- CENTER: Carousel + Mini Banners -->
        <div class="d-flex flex-column gap-2 min-w-0 overflow-hidden">
          <!-- Main carousel -->
          <div id="heroCarousel" class="carousel slide rounded-4 shadow-sm overflow-hidden" data-bs-ride="carousel" data-bs-interval="4000">
            <div class="carousel-indicators">
              <button v-for="(_, i) in heroBanners" :key="i" type="button"
                :data-bs-target="'#heroCarousel'" :data-bs-slide-to="i"
                :class="{ active: i === 0 }"></button>
            </div>
            <div class="carousel-inner">
              <div v-for="(b, i) in heroBanners" :key="i" :class="['carousel-item', { active: i === 0 }]">
                <div class="hero-slide d-flex align-items-center rounded-4" :style="{ background: b.bg }">
                  <div class="p-4 p-md-5 text-white">
                    <div class="badge bg-danger mb-2 px-3 py-2">{{ b.tag }}</div>
                    <h2 class="fw-bold mb-1 headline-text">{{ b.title }}</h2>
                    <p class="mb-3 opacity-75">{{ b.subtitle }}</p>
                    <a href="#" class="btn btn-light rounded-pill px-4 fw-semibold">Mua ngay</a>
                  </div>
                </div>
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          </div>

          <!-- 4 mini promo banners -->
          <div class="row g-2">
            <div v-for="(b, i) in promoBanners" :key="i" class="col-6 col-xxl-3">
              <div class="mini-promo rounded-4 shadow-sm h-100 d-flex align-items-center gap-2 px-3 py-2"
                :style="{ background: b.bg }">
                <i :class="['bi', b.icon, 'text-white fs-4 flex-shrink-0']"></i>
                <div class="text-white overflow-hidden">
                  <div class="fw-bold text-nowrap" style="font-size:0.8rem;">{{ b.title }}</div>
                  <div class="text-nowrap" style="font-size:0.7rem;opacity:0.85;">{{ b.sub }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Account panel (logged in) or Service cards (guest) -->
        <div class="service-panel d-none d-xl-flex flex-column gap-2 flex-shrink-0">

          <!-- LOGGED IN: user info panel -->
          <template v-if="user">
            <div class="bg-white rounded-4 border shadow-sm overflow-hidden pb-2">
              <div class="p-3 border-bottom">
                <div class="fw-bold" style="font-size:0.95rem">{{ user.first_name }} {{ user.last_name }}</div>
                <div class="text-secondary mb-2" style="font-size:0.75rem">{{ user.email }}</div>
                <div class="d-flex gap-1 flex-wrap">
                  <span class="badge bg-dark rounded-pill" style="font-size: 0.68rem;">{{ $t(userRoleKey) }}</span>
                </div>
              </div>

              <div class="px-3 py-2 border-bottom">
                <a href="#" class="d-flex align-items-center justify-content-between text-decoration-none text-dark">
                  <div class="d-flex align-items-center gap-2">
                    <span>🎁</span>
                    <span class="fw-semibold" style="font-size:0.82rem">Xem ưu đãi của bạn</span>
                  </div>
                  <i class="bi bi-chevron-right small text-secondary"></i>
                </a>
              </div>

              <div class="px-3 pt-2">
                <div class="bg-light text-secondary text-center rounded px-2 py-1 mb-1" style="font-size: 0.72rem;">Ưu đãi cho giáo dục</div>
                <a href="#" class="acct-row"><i class="bi bi-mortarboard-fill text-danger me-1"></i> Đăng ký <b>nhận ưu đãi</b></a>
                <a href="#" class="acct-row"><i class="bi bi-mortarboard-fill text-danger me-1"></i> Deal hot <b>học sinh sinh viên</b></a>
                <a href="#" class="acct-row"><i class="bi bi-mortarboard-fill text-danger me-1"></i> Laptop <b>ưu đãi khủng</b></a>
              </div>

              <div class="px-3 pt-1">
                <div class="bg-light text-secondary text-center rounded px-2 py-1 mb-1" style="font-size: 0.72rem;">Thu cũ lên đời giá hời</div>
                <a href="#" class="acct-row"><i class="bi bi-arrow-repeat text-danger me-1"></i> iPhone trợ giá <b>đến 3 triệu</b></a>
                <a href="#" class="acct-row"><i class="bi bi-arrow-repeat text-danger me-1"></i> Samsung trợ giá <b>đến 4 triệu</b></a>
              </div>

              <div class="px-3 pt-1">
                <div class="bg-light text-secondary text-center rounded px-2 py-1 mb-1" style="font-size: 0.72rem;">Khách hàng doanh nghiệp (B2B)</div>
                <a href="#" class="acct-row"><i class="bi bi-briefcase-fill me-1"></i> Đăng ký <b>S-Business</b></a>
                <a href="#" class="acct-row"><i class="bi bi-briefcase-fill me-1"></i> Chính sách <b>ưu đãi</b></a>
              </div>
            </div>
          </template>

          <!-- GUEST: welcome -->
          <template v-else>
            <div class="bg-white rounded-4 border shadow-sm overflow-hidden pb-2">
              <div class="p-3 border-bottom">
                <div class="fw-bold mb-1" style="font-size:0.9rem">Chào mừng bạn đến với IrusGear</div>
                <p class="text-secondary mb-2" style="font-size:0.75rem">Nhập hội thành viên để không bỏ lỡ các ưu đãi hấp dẫn.</p>
                <div class="d-flex gap-2">
                  <NuxtLink :to="localePath('/auth/login')" class="btn btn-dark btn-sm rounded-pill px-3 flex-fill" style="font-size:0.78rem">Đăng nhập</NuxtLink>
                  <NuxtLink :to="localePath('/auth/register')" class="btn btn-outline-dark btn-sm rounded-pill px-3 flex-fill" style="font-size:0.78rem">Đăng ký</NuxtLink>
                </div>
              </div>

              <div class="px-3 py-2 border-bottom">
                <a href="#" class="d-flex align-items-center justify-content-between text-decoration-none text-dark">
                  <div class="d-flex align-items-center gap-2">
                    <span>🎁</span>
                    <span class="fw-semibold" style="font-size:0.82rem">Xem ưu đãi Smember</span>
                  </div>
                  <i class="bi bi-chevron-right small text-secondary"></i>
                </a>
              </div>

              <div class="px-3 pt-2">
                <div class="bg-light text-secondary text-center rounded px-2 py-1 mb-1" style="font-size: 0.72rem;">Ưu đãi cho giáo dục</div>
                <a href="#" class="acct-row"><i class="bi bi-mortarboard-fill text-danger me-1"></i> Đăng ký <b>nhận ưu đãi</b></a>
                <a href="#" class="acct-row"><i class="bi bi-mortarboard-fill text-danger me-1"></i> Deal hot <b>học sinh sinh viên</b></a>
                <a href="#" class="acct-row"><i class="bi bi-mortarboard-fill text-danger me-1"></i> Laptop <b>ưu đãi khủng</b></a>
              </div>

              <div class="px-3 pt-1">
                <div class="bg-light text-secondary text-center rounded px-2 py-1 mb-1" style="font-size: 0.72rem;">Thu cũ lên đời giá hời</div>
                <a href="#" class="acct-row"><i class="bi bi-arrow-repeat text-danger me-1"></i> iPhone trợ giá <b>đến 3 triệu</b></a>
                <a href="#" class="acct-row"><i class="bi bi-arrow-repeat text-danger me-1"></i> Samsung trợ giá <b>đến 4 triệu</b></a>
              </div>

              <div class="px-3 pt-1">
                <div class="bg-light text-secondary text-center rounded px-2 py-1 mb-1" style="font-size: 0.72rem;">Khách hàng doanh nghiệp (B2B)</div>
                <a href="#" class="acct-row"><i class="bi bi-briefcase-fill me-1"></i> Đăng ký <b>S-Business</b></a>
                <a href="#" class="acct-row"><i class="bi bi-briefcase-fill me-1"></i> Chính sách <b>ưu đãi</b></a>
              </div>
            </div>
          </template>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n, useLocalePath } from "#imports";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/authStore';
import { getUserRoleKey } from '@/utils/roleHelper';

const { t } = useI18n();
const localePath = useLocalePath();
const auth = useAuthStore();
const { user } = storeToRefs(auth);
const userRoleKey = computed(() => user.value ? getUserRoleKey(user.value.role_id) : '');

const categories = [
  { name: 'Điện thoại', icon: 'bi-phone' },
  { name: 'Laptop', icon: 'bi-laptop' },
  { name: 'Tablet', icon: 'bi-tablet' },
  { name: 'Âm thanh', icon: 'bi-headphones' },
  { name: 'Đồng hồ', icon: 'bi-smartwatch' },
  { name: 'Nhà thông minh', icon: 'bi-house' },
  { name: 'Phụ kiện', icon: 'bi-bag' },
  { name: 'PC, Máy in', icon: 'bi-pc-display' },
  { name: 'Máy cũ', icon: 'bi-arrow-repeat' },
  { name: 'Sim, Thẻ', icon: 'bi-sim' },
];

const heroBanners = [
  { tag: 'GIẢM SỐC', title: 'iPhone 16 Pro Max', subtitle: 'Giảm đến 3.000.000đ — Trả góp 0%', bg: 'linear-gradient(120deg,#1a1a1a 60%,#2d2d2d)' },
  { tag: 'MỚI RA MẮT', title: 'Samsung Galaxy S25 Ultra', subtitle: 'AI mạnh mẽ — Snapdragon 8 Gen 3', bg: 'linear-gradient(120deg,#0d0d0d 60%,#1a1a2e)' },
  { tag: 'HOT DEAL', title: 'MacBook Air M4', subtitle: 'Siêu mỏng nhẹ — Pin 18 giờ', bg: 'linear-gradient(120deg,#111 60%,#1a1a1a)' },
];

const promoBanners = [
  { title: 'Thu cũ đổi mới', sub: 'Trợ giá đến 5 triệu', icon: 'bi-arrow-repeat', bg: '#1a1a1a' },
  { title: 'Trả góp 0%', sub: 'Duyệt nhanh 5 phút', icon: 'bi-credit-card', bg: '#222' },
  { title: 'Bảo hiểm rơi vỡ', sub: 'Chỉ từ 99.000đ', icon: 'bi-shield-check', bg: '#1a1a1a' },
  { title: 'Giao trong 2 giờ', sub: 'Nội thành HCM & HN', icon: 'bi-truck', bg: '#222' },
];
</script>

<style scoped>
.hero-bg {
  background: linear-gradient(180deg, #f7f7f8 0%, #f0f0f0 100%);
}

.hero-layout {
  display: grid;
  grid-template-columns: 258px minmax(0, 1fr);
  gap: 12px;
  align-items: stretch;
}

@media (min-width: 1200px) {
  .hero-layout { grid-template-columns: 258px minmax(0, 1fr) 270px; }
  .service-panel { width: 270px; }
}

@media (min-width: 1400px) {
  .hero-layout { grid-template-columns: 268px minmax(0, 1fr) 286px; gap: 14px; }
  .service-panel { width: 286px; }
}

.cat-item {
  min-height: 47px;
  transition: background 0.15s, color 0.15s, transform 0.15s;
}

.cat-item:last-child {
  border-bottom: none !important;
}

.cat-item:hover {
  background: #fff5f5;
  color: #d70018 !important;
  transform: translateX(3px);
}

.hero-slide {
  height: 360px;
}

.headline-text {
  font-size: clamp(2rem, 2.5vw, 3rem);
  line-height: 1.08;
  max-width: 12ch;
}

.mini-promo {
  height: 92px;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s, box-shadow 0.2s;
}

.mini-promo:hover {
  opacity: 0.94;
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.12) !important;
}

.min-w-0 {
  min-width: 0;
}

.acct-row {
  display: flex; align-items: center;
  font-size: 0.78rem; color: #222;
  text-decoration: none; padding: 5px 0;
  transition: color 0.15s;
}

.acct-row:hover {
  color: #e53935;
}

@media (max-width: 1399.98px) {
  .cat-item { min-height: 45px; font-size: 0.9rem; padding-inline: 14px !important; }
  .hero-slide { height: 340px; }
  .mini-promo { height: 88px; }
}

@media (max-width: 991.98px) {
  .hero-slide { height: 320px; }
}
</style>
