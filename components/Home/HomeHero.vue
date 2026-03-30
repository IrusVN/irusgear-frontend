<template>
  <div class="container-xl py-3 px-3 mx-auto">
    <div class="hero-layout">
      <div class="bg-white rounded-3 shadow-sm border overflow-hidden flex-shrink-0 d-none d-lg-flex flex-column justify-content-between py-1">
        <a v-for="cat in categories" :key="cat.name" href="#" class="d-flex align-items-center gap-2 px-3 text-decoration-none text-dark cat-item border-bottom" >
          <i :class="['bi', cat.icon, 'text-center flex-shrink-0']" style="font-size: 1.2rem; width: 22px;"></i>
          <span class="flex-grow-1 fw-semibold" style="font-size: 0.92rem;">{{ cat.name }}</span>
          <i class="bi bi-chevron-right text-secondary" style="font-size: 0.7rem;"></i>
        </a>
      </div>

      <div class="d-flex flex-column gap-2 min-w-0 overflow-hidden">
        <div id="heroCarousel" class="carousel slide rounded-3 shadow-sm overflow-hidden" data-bs-ride="carousel" data-bs-interval="4000" >
          <div class="carousel-indicators">
            <button v-for="(_, i) in heroBanners" :key="i" type="button" :data-bs-target="'#heroCarousel'" :data-bs-slide-to="i" :class="{ active: i === 0 }" ></button>
          </div>

          <div class="carousel-inner">
            <div v-for="(banner, i) in heroBanners" :key="banner.image" :class="['carousel-item', { active: i === 0 }]" >
              <img :src="banner.image" :alt="banner.alt" class="hero-slide-image" />
            </div>
          </div>
        </div>

        <div class="d-flex promo-banner-list">
          <div class="promo-banner-item">
            <img src="/image/dashboard/homehero/muauaumungay.png" alt="Mua uu dai mua nay" class="promo-banner-image" />
          </div>
          <div class="promo-banner-item">
            <img src="/image/dashboard/homehero/a-17.png" alt="Samsung Galaxy A17 5G" class="promo-banner-image" />
          </div>
          <div class="promo-banner-item">
            <img src="/image/dashboard/homehero/macbook-giao-xa-2026.png" alt="Mua laptop online" class="promo-banner-image" />
          </div>
        </div>
      </div>

      <div class="service-panel d-none d-xl-flex flex-column gap-2 flex-shrink-0">
        <template v-if="user">
          <div class="bg-white rounded-3 border shadow-sm overflow-hidden pb-2">
            <div class="p-3 border-bottom">
              <div class="fw-bold" style="font-size: 0.95rem;">{{ user.first_name }} {{ user.last_name }}</div>
              <div class="text-secondary mb-2" style="font-size: 0.75rem;">{{ user.email }}</div>
              <div class="d-flex gap-1 flex-wrap">
                <span class="badge bg-dark rounded-pill" style="font-size: 0.68rem;">{{ $t(userRoleKey) }}</span>
              </div>
            </div>

            <div class="px-3 py-2 border-bottom">
              <a href="#" class="d-flex align-items-center justify-content-between text-decoration-none text-dark">
                <div class="d-flex align-items-center gap-2">
                  <span>🎁</span>
                  <span class="fw-semibold" style="font-size: 0.82rem;">Xem ưu đãi của bạn</span>
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

        <template v-else>
          <div class="bg-white rounded-3 border shadow-sm overflow-hidden pb-2">
            <div class="p-3 border-bottom">
              <div class="fw-bold mb-1" style="font-size: 0.9rem;">Chào mừng bạn đến với IrusGear</div>
              <p class="text-secondary mb-2" style="font-size: 0.75rem;">Nhập hội thành viên để không bỏ lỡ các ưu đãi hấp dẫn.</p>
              <div class="d-flex gap-2">
                <NuxtLink :to="localePath('/auth/login')" class="btn btn-dark btn-sm rounded-pill px-3 flex-fill" style="font-size: 0.78rem;">Đăng nhập</NuxtLink>
                <NuxtLink :to="localePath('/auth/register')" class="btn btn-outline-dark btn-sm rounded-pill px-3 flex-fill" style="font-size: 0.78rem;">Đăng ký</NuxtLink>
              </div>
            </div>

            <div class="px-3 py-2 border-bottom">
              <a href="#" class="d-flex align-items-center justify-content-between text-decoration-none text-dark">
                <div class="d-flex align-items-center gap-2">
                  <span>🎁</span>
                  <span class="fw-semibold" style="font-size: 0.82rem;">Xem ưu đãi Smember</span>
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
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n, useLocalePath } from "#imports";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/authStore";
import { getUserRoleKey } from "@/utils/roleHelper";
import { useFeGlobalStore } from "@/stores/feGlobalStore";

const { t } = useI18n();
const localePath = useLocalePath();
const auth = useAuthStore();
const { user } = storeToRefs(auth);
const userRoleKey = computed(() => (user.value ? getUserRoleKey(user.value.role_id) : ""));

const isLoading = ref(false);
const feGlobalStore = useFeGlobalStore();

const categories = ref([
  { name: "Điện thoại, Tablet", icon: "bi-phone" },
  { name: "Laptop", icon: "bi-laptop" },
  { name: "Âm thanh, Mic thu âm", icon: "bi-headphones" },
  { name: "Đồng hồ, Camera", icon: "bi-smartwatch" },
  { name: "Đồ gia dụng, Làm đẹp", icon: "bi-house" },
  { name: "PC, Màn hình, Máy in", icon: "bi-pc-display" },
  { name: "Tivi, Điện máy", icon: "bi-display" },
  { name: "Thu cũ đổi mới", icon: "bi-repeat" },
  { name: "Hàng cũ", icon: "bi-box-seam" },
  { name: "Khuyến mãi", icon: "bi-patch-check" },
  { name: "Tin công nghệ", icon: "bi-card-text" },
]);

const heroBanners = [
  { image: "/image/dashboard/homehero/swiperslide/690x300_open_iPhone 17e.png", alt: "iPhone 17e banner" },
  { image: "/image/dashboard/homehero/swiperslide/690x300_PRE_AiPodsMax2.png", alt: "AirPods Max 2 banner" },
  { image: "/image/dashboard/homehero/swiperslide/690x300_ROI_MacBookNeo.png", alt: "MacBook Neo banner" },
  { image: "/image/dashboard/homehero/swiperslide/a37-new-home.png", alt: "Galaxy A57 A37 5G banner" },
  { image: "/image/dashboard/homehero/swiperslide/Home(3).png", alt: "Galaxy S26 Series banner" },
  { image: "/image/dashboard/homehero/swiperslide/Home_WF-1000XM6-final.png", alt: "Sony WF-1000XM6 banner" },
  { image: "/image/dashboard/homehero/swiperslide/mbam5homepae.png", alt: "MacBook Air M5 banner" },
  { image: "/image/dashboard/homehero/swiperslide/oppofingn6.png", alt: "OPPO Find N6 banner" },
];

const fetchCategoriesTree = async () => {
  isLoading.value = true;
  feGlobalStore.setApiUrl("/categories/tree");
  try {
    const res = await feGlobalStore.fetchItems();
    if (res && res.data) {
      categories.value = res.data.map((cat) => ({
        name: cat.name,
        icon: cat.icon || "bi-tags",
      }));
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.hero-layout {
  display: grid;
  grid-template-columns: 258px minmax(0, 1fr);
  gap: 12px;
  align-items: stretch;
}

@media (min-width: 1200px) {
  .hero-layout {
    grid-template-columns: 258px minmax(0, 1fr) 270px;
  }

  .service-panel {
    width: 270px;
  }
}

@media (min-width: 1400px) {
  .hero-layout {
    grid-template-columns: 268px minmax(0, 1fr) 286px;
    gap: 14px;
  }

  .service-panel {
    width: 286px;
  }
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

.hero-slide-image {
  display: block;
  width: 100%;
  height: 360px;
  object-fit: cover;
}

:deep(.carousel-indicators button) {
  background-color: #bfbfbf;
  opacity: 1;
  transition: width 0.28s ease, transform 0.28s ease, background-color 0.28s ease, box-shadow 0.28s ease;
}

.promo-banner-list {
  gap: 0.5rem;
  flex-wrap: nowrap;
}

.promo-banner-item {
  flex: 1 1 0;
  min-width: 0;
}

.promo-banner-image {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0.9rem;
  object-fit: cover;
}

.min-w-0 {
  min-width: 0;
}

.acct-row {
  display: flex;
  align-items: center;
  font-size: 0.78rem;
  color: #222;
  text-decoration: none;
  padding: 5px 0;
  transition: color 0.15s;
}

.acct-row:hover {
  color: #e53935;
}

:deep(.carousel-indicators .active) {
  background-color: #000;
}

@media (max-width: 1399.98px) {
  .cat-item {
    min-height: 45px;
    font-size: 0.9rem;
    padding-inline: 14px !important;
  }

  .hero-slide-image {
    height: 340px;
  }
}

@media (max-width: 991.98px) {
  .hero-slide-image {
    height: 320px;
  }
}
</style>
