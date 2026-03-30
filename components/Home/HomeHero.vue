<template>
  <div class="container-xl py-3 px-3 mx-auto">
    <div class="hero-layout">
      <div class="bg-white rounded-3 shadow-sm border overflow-hidden flex-shrink-0 d-none d-lg-flex flex-column justify-content-between py-1">
        <a
          v-for="cat in categories"
          :key="cat.name"
          href="#"
          class="d-flex align-items-center gap-2 px-3 text-decoration-none text-dark cat-item border-bottom"
        >
          <i :class="['bi', cat.icon, 'text-center flex-shrink-0']" style="font-size: 1.2rem; width: 22px;"></i>
          <span class="flex-grow-1 fw-semibold" style="font-size: 0.92rem;">{{ cat.name }}</span>
          <i class="bi bi-chevron-right text-secondary" style="font-size: 0.7rem;"></i>
        </a>
      </div>

      <div class="d-flex flex-column gap-2 min-w-0 overflow-hidden">
        <div
          id="heroCarousel"
          ref="carouselRef"
          class="carousel slide rounded-3 shadow-sm overflow-hidden bg-white"
          data-bs-ride="carousel"
          data-bs-interval="4000"
        >
          <div ref="tabScrollerRef" class="hero-carousel-tabs">
            <button
              v-for="(banner, i) in heroBanners"
              :key="banner.image"
              :ref="setTabButtonRef"
              type="button"
              :data-bs-target="'#heroCarousel'"
              :data-bs-slide-to="i"
              :class="['hero-carousel-tab', { active: activeIndex === i }]"
              @click="activeIndex = i"
            >
              <span v-if="activeIndex === i" class="hero-tab-wing hero-tab-wing-left" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1362" preserveAspectRatio="none">
                  <path d="M 988.750 22.566 C 986.138 23.926, 984 25.262, 984 25.536 C 984 25.982, 993.900 21.306, 994.917 20.380 C 996.155 19.251, 992.901 20.405, 988.750 22.566 M 747.477 195.250 L 739.500 203.500 747.750 195.523 C 752.288 191.136, 756 187.424, 756 187.273 C 756 186.544, 754.885 187.588, 747.477 195.250 M 329.987 1194.750 L 315.500 1209.500 330.250 1195.013 C 343.952 1181.555, 345.453 1180, 344.737 1180 C 344.592 1180, 337.955 1186.638, 329.987 1194.750 M 292.971 1229.750 L 286.500 1236.500 293.250 1230.029 C 299.520 1224.018, 300.457 1223, 299.721 1223 C 299.568 1223, 296.530 1226.037, 292.971 1229.750 M 16.750 1357.743 C 20.738 1357.932, 27.262 1357.932, 31.250 1357.743 C 35.237 1357.553, 31.975 1357.397, 24 1357.397 C 16.025 1357.397, 12.762 1357.553, 16.750 1357.743" fill="transparent"></path>
                  <path d="M 0 678.441 L 0 1355.877 4.698 1356.582 C 11.713 1357.634, 49.378 1356.255, 58.142 1354.625 C 75.112 1351.470, 113.306 1338.882, 134.500 1329.459 C 183.168 1307.823, 221.770 1285.436, 260.997 1256.099 C 280.057 1241.844, 298.425 1225.449, 328.826 1195.554 C 362.127 1162.808, 385.286 1133.566, 407.670 1096 C 427.019 1063.527, 430.431 1056.966, 447.458 1019.500 C 460.942 989.828, 464.472 978.257, 483.609 901 C 498.035 842.766, 549.729 636.436, 554.012 620 C 572.473 549.145, 592.445 478.080, 606.847 432 C 622.391 382.262, 630.945 362.446, 654.762 321 C 689.890 259.869, 708.840 234.684, 755.500 187.112 C 804.088 137.573, 860.800 92.593, 909.500 64.967 C 927.984 54.482, 991.312 21.173, 1017.500 8.161 L 1023.500 5.180 1024.001 680.340 L 1024.502 1355.500 1024.751 678 L 1025 0.500 512.500 0.752 L 0 1.004 0 678.441 M 0.497 678.500 C 0.497 1051.400, 0.611 1204.100, 0.750 1017.832 C 0.889 831.565, 0.889 526.465, 0.750 339.832 C 0.611 153.200, 0.497 305.600, 0.497 678.500" fill="#f2f2f3"></path>
                </svg>
              </span>

              <span class="hero-tab-label">
                <b>{{ banner.title }}</b><br />
                {{ banner.subtitle }}
              </span>

              <span v-if="activeIndex === i" class="hero-tab-wing hero-tab-wing-right" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1362" preserveAspectRatio="none">
                  <path d="M 988.750 22.566 C 986.138 23.926, 984 25.262, 984 25.536 C 984 25.982, 993.900 21.306, 994.917 20.380 C 996.155 19.251, 992.901 20.405, 988.750 22.566 M 747.477 195.250 L 739.500 203.500 747.750 195.523 C 752.288 191.136, 756 187.424, 756 187.273 C 756 186.544, 754.885 187.588, 747.477 195.250 M 329.987 1194.750 L 315.500 1209.500 330.250 1195.013 C 343.952 1181.555, 345.453 1180, 344.737 1180 C 344.592 1180, 337.955 1186.638, 329.987 1194.750 M 292.971 1229.750 L 286.500 1236.500 293.250 1230.029 C 299.520 1224.018, 300.457 1223, 299.721 1223 C 299.568 1223, 296.530 1226.037, 292.971 1229.750 M 16.750 1357.743 C 20.738 1357.932, 27.262 1357.932, 31.250 1357.743 C 35.237 1357.553, 31.975 1357.397, 24 1357.397 C 16.025 1357.397, 12.762 1357.553, 16.750 1357.743" fill="transparent"></path>
                  <path d="M 0 678.441 L 0 1355.877 4.698 1356.582 C 11.713 1357.634, 49.378 1356.255, 58.142 1354.625 C 75.112 1351.470, 113.306 1338.882, 134.500 1329.459 C 183.168 1307.823, 221.770 1285.436, 260.997 1256.099 C 280.057 1241.844, 298.425 1225.449, 328.826 1195.554 C 362.127 1162.808, 385.286 1133.566, 407.670 1096 C 427.019 1063.527, 430.431 1056.966, 447.458 1019.500 C 460.942 989.828, 464.472 978.257, 483.609 901 C 498.035 842.766, 549.729 636.436, 554.012 620 C 572.473 549.145, 592.445 478.080, 606.847 432 C 622.391 382.262, 630.945 362.446, 654.762 321 C 689.890 259.869, 708.840 234.684, 755.500 187.112 C 804.088 137.573, 860.800 92.593, 909.500 64.967 C 927.984 54.482, 991.312 21.173, 1017.500 8.161 L 1023.500 5.180 1024.001 680.340 L 1024.502 1355.500 1024.751 678 L 1025 0.500 512.500 0.752 L 0 1.004 0 678.441 M 0.497 678.500 C 0.497 1051.400, 0.611 1204.100, 0.750 1017.832 C 0.889 831.565, 0.889 526.465, 0.750 339.832 C 0.611 153.200, 0.497 305.600, 0.497 678.500" fill="#f2f2f3"></path>
                </svg>
              </span>
            </button>
          </div>

          <div class="carousel-inner">
            <div
              v-for="(banner, i) in heroBanners"
              :key="banner.image"
              :class="['carousel-item', { active: i === 0 }]"
            >
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
import { computed, nextTick, onBeforeUpdate, onMounted, onUnmounted, ref } from "vue";
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
const carouselRef = ref(null);
const tabScrollerRef = ref(null);
const tabButtons = ref([]);
const activeIndex = ref(0);

const setTabButtonRef = (el) => {
  if (el) tabButtons.value.push(el);
};

onBeforeUpdate(() => {
  tabButtons.value = [];
});

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
  { image: "/image/dashboard/homehero/swiperslide/Home(3).png", alt: "Galaxy S26 Series banner", title: "GALAXY S26 ULTRA", subtitle: "Mở bán ưu đãi khủng" },
  { image: "/image/dashboard/homehero/swiperslide/690x300_ROI_MacBookNeo.png", alt: "MacBook Neo banner", title: "MACBOOK NEO", subtitle: "Đăng ký nhận tin" },
  { image: "/image/dashboard/homehero/swiperslide/oppofingn6.png", alt: "OPPO Find N6 banner", title: "OPPO FIND N6", subtitle: "Mở bán tặng quà 15 triệu" },
  { image: "/image/dashboard/homehero/swiperslide/690x300_open_iPhone 17e.png", alt: "iPhone 17e banner", title: "IPHONE 17e", subtitle: "Mở bán ưu đãi đến 2.65 triệu" },
  { image: "/image/dashboard/homehero/swiperslide/Home_WF-1000XM6-final.png", alt: "Sony WF-1000XM6 banner", title: "SONY WF-1000XM6", subtitle: "Tinh xảo chất âm. Chống ồn độc nhất." },
  { image: "/image/dashboard/homehero/swiperslide/a37-new-home.png", alt: "Galaxy A57 A37 5G banner", title: "GALAXY A37 | A57 5G", subtitle: "Giá chỉ từ 10.79 triệu" },
  { image: "/image/dashboard/homehero/swiperslide/690x300_PRE_AiPodsMax2.png", alt: "AirPods Max 2 banner", title: "AIRPODS MAX 2", subtitle: "Đặt trước ngay" },
  { image: "/image/dashboard/homehero/swiperslide/mbam5homepae.png", alt: "MacBook Air M5 banner", title: "MACBOOK AIR M5", subtitle: "Đăng ký nhận tin" },
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

const centerActiveTab = (index) => {
  const container = tabScrollerRef.value;
  const button = tabButtons.value[index];
  if (!container || !button) return;

  const targetLeft = button.offsetLeft - (container.clientWidth - button.clientWidth) / 2;
  const maxLeft = Math.max(container.scrollWidth - container.clientWidth, 0);
  const nextLeft = Math.min(Math.max(targetLeft, 0), maxLeft);

  container.scrollTo({ left: nextLeft, behavior: "smooth" });
};

const handleCarouselSlid = (event) => {
  activeIndex.value = event?.to ?? 0;
  nextTick(() => centerActiveTab(activeIndex.value));
};

onMounted(() => {
  const carouselEl = carouselRef.value;
  if (!carouselEl) return;

  carouselEl.addEventListener("slid.bs.carousel", handleCarouselSlid);
  nextTick(() => centerActiveTab(activeIndex.value));
});

onUnmounted(() => {
  const carouselEl = carouselRef.value;
  if (!carouselEl) return;

  carouselEl.removeEventListener("slid.bs.carousel", handleCarouselSlid);
});
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

.hero-carousel-tabs {
  display: flex;
  align-items: stretch;
  overflow-x: auto;
  scrollbar-width: none;
  background: #fff;
  border-bottom: 1px solid #ececec;
}

.hero-carousel-tabs::-webkit-scrollbar {
  display: none;
}

.hero-carousel-tab {
  position: relative;
  flex: 0 0 auto;
  padding: 0.55rem 1.8rem;
  border: 0;
  background: #fff;
  color: #6b7280;
  white-space: nowrap;
  z-index: 0;
}

.hero-tab-label {
  display: block;
  text-align: center;
  font-size: 0.78rem;
  line-height: 1.2;
}

.hero-tab-label b {
  color: #5c6474;
  font-size: 0.88rem;
  font-weight: 700;
}

.hero-carousel-tab.active {
  background: #f2f2f3;
  z-index: 1;
}

.hero-carousel-tab.active .hero-tab-label b {
  color: black;
}

.hero-carousel-tab.active .hero-tab-label {
  color: #6b7280;
}

.hero-tab-wing {
  position: absolute;
  top: 0;
  width: 36px;
  height: 100%;
  pointer-events: none;
}

.hero-tab-wing svg {
  display: block;
  width: 100%;
  height: 100%;
}

.hero-tab-wing-left {
  left: -35px;
  transform: scaleX(-1);
}

.hero-tab-wing-right {
  right: -35px;
}

.hero-slide-image {
  display: block;
  width: 100%;
  height: 360px;
  object-fit: cover;
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
