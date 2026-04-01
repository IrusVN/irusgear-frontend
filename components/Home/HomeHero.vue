<template>
  <div class="container-xl py-3 px-3 mx-auto">
    <div class="hero-layout">
      <div
        class="hero-category-wrap d-none d-lg-flex flex-shrink-0"
        @mouseenter="openMegaMenu"
        @mouseleave="closeMegaMenu"
      >
        <div class="bg-white rounded-3 shadow-sm border overflow-hidden d-flex flex-column justify-content-between py-1 hero-category-sidebar">
        <a
          v-for="cat in categories"
          :key="cat.key"
          href="#"
          class="d-flex align-items-center gap-2 px-3 text-decoration-none text-dark cat-item border-bottom"
          :class="{ 'cat-item-active': activeSectionKey === cat.key }"
          @mouseenter="activateMegaMenu(cat.key)"
          @focus="activateMegaMenu(cat.key)"
          @click.prevent
        >
          <span class="hero-category-icon">
            <i :class="['bi', cat.icon, 'text-center flex-shrink-0']" style="font-size: 1.2rem; width: 22px;"></i>
          </span>
          <span class="flex-grow-1 fw-semibold" style="font-size: 0.92rem;">{{ cat.name }}</span>
          <i class="bi bi-chevron-right" style="font-size: 0.7rem;"></i>
        </a>

          <div
            v-if="isMegaMenuOpen && activeSection"
            class="hero-mega-menu-panel bg-white rounded-3 shadow-sm border"
            @mouseenter="keepMegaMenuOpen"
            @mouseleave="closeMegaMenu"
          >
            <div class="hero-mega-menu-columns">
              <section
                v-for="group in activeGroups"
                :key="group.key || group.title"
                class="hero-mega-menu-group"
              >
                <h3 class="hero-mega-menu-group-title">{{ group.title }}</h3>

                <div class="hero-mega-menu-group-items">
                  <component
                    :is="resolveHref(item) ? 'a' : 'div'"
                    v-for="item in resolveGroupItems(group)"
                    :key="`${group.key || group.title}-${item.slug || item.title}`"
                    :href="resolveHref(item) || undefined"
                    :aria-label="item.title || undefined"
                    class="hero-mega-menu-chip"
                    :class="{ 'has-badge': !!item.badge, 'has-image': !!item.image }"
                  >
                    <img
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.title"
                      class="hero-mega-menu-chip-image"
                      loading="lazy"
                    />
                    <span v-if="!shouldHideItemTitle(group, item)" class="hero-mega-menu-chip-title">{{ item.title }}</span>
                    <span v-if="item.badge" class="hero-mega-menu-chip-badge">{{ item.badge }}</span>
                  </component>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex flex-column gap-2 min-w-0 overflow-hidden">
        <div
          id="heroCarousel"
          ref="carouselRef"
          class="carousel slide rounded-3 shadow-sm overflow-hidden bg-white"
          data-bs-ride="carousel"
          data-bs-interval="4000"
        >
          <div
            ref="tabScrollerRef"
            :class="[
              'hero-carousel-tabs',
              {
                'hero-carousel-tabs-left-wing': activeIndex === 0,
                'hero-carousel-tabs-right-wing': activeIndex === heroBanners.length - 1,
              },
            ]"
          >
            <button
              v-for="(banner, i) in heroBanners"
              :key="banner.image"
              :ref="setTabButtonRef"
              type="button"
              :data-bs-target="'#heroCarousel'"
              :data-bs-slide-to="i"
              :class="[
                'hero-carousel-tab',
                {
                  active: activeIndex === i,
                  'hero-carousel-tab-first-active': activeIndex === i && i === 0,
                  'hero-carousel-tab-last-active': activeIndex === i && i === heroBanners.length - 1,
                },
              ]"
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
        <div class="service-welcome-card">
          <template v-if="user">
            <div class="service-welcome-head">
              <div class="service-avatar service-avatar-user">
                <i class="bi bi-person-fill"></i>
              </div>
              <div class="flex-grow-1 min-w-0">
                <p class="service-welcome-title mb-0">{{ user.first_name }} {{ user.last_name }}</p>
                <p class="service-welcome-subtitle mb-0 text-truncate">{{ user.email }}</p>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-1 mt-2">
              <span class="service-role-chip">{{ $t(userRoleKey) }}</span>
            </div>

            <NuxtLink :to="localePath('/')" class="service-perk-link mt-2">
              <span class="service-perk-icon">
                <i class="bi bi-gift-fill"></i>
              </span>
              <span>Xem ưu đãi của bạn</span>
              <i class="bi bi-chevron-right service-chevron"></i>
            </NuxtLink>
          </template>

          <template v-else>
            <div class="service-welcome-head">
              <div class="service-avatar">
                <svg viewBox="0 0 48 48" class="service-avatar-logo" aria-hidden="true">
                  <rect x="6" y="6" width="36" height="36" rx="12" fill="#111827" />
                  <path d="M17 15h14v4H17zm0 7h14v4H17zm0 7h8v4h-8z" fill="#fff" />
                  <circle cx="31" cy="31" r="3" fill="#fff" />
                </svg>
              </div>
              <div class="flex-grow-1">
                <p class="service-welcome-title mb-0">Chào mừng bạn đến với IrusGear</p>
              </div>
            </div>

            <p class="service-welcome-copy">
              Nhập hội thành viên để không bỏ lỡ các ưu đãi hấp dẫn.
            </p>

            <div class="service-auth-actions">
              <NuxtLink :to="localePath('/auth/login')" class="service-text-link">Đăng nhập</NuxtLink>
              <span class="text-secondary">hoặc</span>
              <NuxtLink :to="localePath('/auth/register')" class="service-text-link">Đăng ký</NuxtLink>
            </div>

            <NuxtLink :to="localePath('/')" class="service-perk-link">
              <span class="service-perk-icon">
                <i class="bi bi-gift-fill"></i>
              </span>
              <span>Xem ưu đãi Smember</span>
              <i class="bi bi-chevron-right service-chevron"></i>
            </NuxtLink>
          </template>
        </div>

        <div class="service-benefits-card">
          <div
            v-for="group in serviceGroups"
            :key="group.title"
            class="service-benefit-group"
          >
            <NuxtLink :to="localePath(group.href)" class="service-group-title">
              {{ group.title }}
            </NuxtLink>

            <NuxtLink
              v-for="item in group.items"
              :key="item.label"
              :to="localePath(item.href)"
              class="acct-row"
            >
              <span class="service-item-icon">
                <i :class="['bi', item.icon]"></i>
              </span>
              <span class="flex-grow-1" v-html="item.label"></span>
            </NuxtLink>
          </div>

          <NuxtLink :to="localePath('/')" class="service-bottom-banner">
            <span class="service-bottom-pill">Ưu đãi nổi bật</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUpdate, onMounted, onUnmounted, ref } from "vue";
import { useI18n, useLocalePath } from "#imports";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/authStore";
import { useHomeStore } from "@/stores/homeStore";
import { getUserRoleKey } from "@/utils/roleHelper";

const { t } = useI18n();
const localePath = useLocalePath();
const auth = useAuthStore();
const homeStore = useHomeStore();
const { megaMenuLeafByKey, activeMegaMenuKey } = storeToRefs(homeStore);
const { user } = storeToRefs(auth);
const userRoleKey = computed(() => (user.value ? getUserRoleKey(user.value.role_id) : ""));

const carouselRef = ref(null);
const tabScrollerRef = ref(null);
const tabButtons = ref([]);
const activeIndex = ref(0);
const isMegaMenuOpen = ref(false);
let megaMenuCloseTimer = null;

const setTabButtonRef = (el) => {
  if (el) tabButtons.value.push(el);
};

onBeforeUpdate(() => {
  tabButtons.value = [];
});

const categories = [
  { key: "dien-thoai-tablet", name: "Điện thoại, Tablet", icon: "bi-phone" },
  { key: "laptop", name: "Laptop", icon: "bi-laptop" },
  { key: "am-thanh-mic-thu-am", name: "Âm thanh, Mic thu âm", icon: "bi-headphones" },
  { key: "dong-ho-camera", name: "Đồng hồ, Camera", icon: "bi-smartwatch" },
  { key: "do-gia-dung-lam-dep", name: "Đồ gia dụng, Làm đẹp", icon: "bi-house" },
  { key: "phu-kien", name: "Phụ kiện", icon: "bi-earbuds" },
  { key: "pc-man-hinh-may-in", name: "PC, Màn hình, Máy in", icon: "bi-pc-display" },
  { key: "tv-dien-may", name: "Tivi, Điện máy", icon: "bi-display" },
  { key: "thu-cu-doi-moi", name: "Thu cũ đổi mới", icon: "bi-repeat" },
  { key: "hang-cu", name: "Hàng cũ", icon: "bi-box-seam" },
  { key: "khuyen-mai", name: "Khuyến mãi", icon: "bi-patch-check" },
  { key: "tin-cong-nghe", name: "Tin công nghệ", icon: "bi-card-text" },
];

const activeSectionKey = computed(() => {
  const matched = categories.find((section) => section.key === activeMegaMenuKey.value);
  return matched?.key || categories[0]?.key || "";
});

const activeSection = computed(
  () => categories.find((section) => section.key === activeSectionKey.value) || null
);

const activeGroups = computed(() => megaMenuLeafByKey.value?.[activeSectionKey.value]?.children || []);

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

const serviceGroups = [
  {
    title: "Ưu đãi cho giáo dục",
    href: "/",
    items: [
      { icon: "bi-mortarboard-fill", href: "/", label: "Đăng ký <b>nhận ưu đãi</b>" },
      { icon: "bi-mortarboard-fill", href: "/", label: "Deal hot <b>học sinh sinh viên</b>" },
      { icon: "bi-mortarboard-fill", href: "/", label: "Laptop <b>ưu đãi khủng</b>" },
    ],
  },
  {
    title: "Thu cũ lên đời giá hời",
    href: "/",
    items: [
      { icon: "bi-arrow-repeat", href: "/", label: "iPhone trợ giá <b>đến 3 triệu</b>" },
      { icon: "bi-arrow-repeat", href: "/", label: "Samsung trợ giá <b>đến 4 triệu</b>" },
    ],
  },
  {
    title: "Khách hàng doanh nghiệp (B2B)",
    href: "/",
    items: [
      { icon: "bi-briefcase-fill", href: "/", label: "Đăng ký <b>S-Business</b>" },
      { icon: "bi-briefcase-fill", href: "/", label: "Chính sách <b>ưu đãi</b>" },
    ],
  },
];

const activateMegaMenu = (key) => {
  if (!key) return;
  homeStore.setActiveMegaMenuKey(key);
  isMegaMenuOpen.value = true;
};

const resolveGroupItems = (group) => {
  if (!group) return [];

  if (Array.isArray(group.items) && group.items.length) {
    return group.items;
  }

  if (Array.isArray(group.children) && group.children.length) {
    return group.children.filter((child) => child?.title);
  }

  return [];
};

const resolveHref = (item) => {
  if (!item) return "";
  if (item.url) return item.url;
  if (item.slug) return `/${item.slug}`;
  return "";
};

const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const isBrandGroup = (group) => {
  const title = normalizeText(group?.title);
  return title.includes("hang") || title.includes("thuong hieu") || title.includes("brand");
};

const shouldHideItemTitle = (group, item) => {
  return Boolean(item?.image) && isBrandGroup(group);
};

const openMegaMenu = () => {
  if (megaMenuCloseTimer) {
    clearTimeout(megaMenuCloseTimer);
    megaMenuCloseTimer = null;
  }
  isMegaMenuOpen.value = true;
};

const keepMegaMenuOpen = () => {
  if (megaMenuCloseTimer) {
    clearTimeout(megaMenuCloseTimer);
    megaMenuCloseTimer = null;
  }
  isMegaMenuOpen.value = true;
};

const closeMegaMenu = () => {
  if (megaMenuCloseTimer) {
    clearTimeout(megaMenuCloseTimer);
  }

  megaMenuCloseTimer = setTimeout(() => {
    isMegaMenuOpen.value = false;
    megaMenuCloseTimer = null;
  }, 180);
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

const handleCarouselSlide = (event) => {
  activeIndex.value = event?.to ?? 0;
  nextTick(() => centerActiveTab(activeIndex.value));
};

onMounted(() => {
  homeStore.fetchMegaMenuLeaves().catch(() => {});

  if (!activeMegaMenuKey.value) {
    homeStore.setActiveMegaMenuKey(categories[0]?.key || "");
  }

  const carouselEl = carouselRef.value;
  if (!carouselEl) return;

  carouselEl.addEventListener("slide.bs.carousel", handleCarouselSlide);
  nextTick(() => centerActiveTab(activeIndex.value));
});

onUnmounted(() => {
  if (megaMenuCloseTimer) {
    clearTimeout(megaMenuCloseTimer);
    megaMenuCloseTimer = null;
  }

  const carouselEl = carouselRef.value;
  if (!carouselEl) return;

  carouselEl.removeEventListener("slide.bs.carousel", handleCarouselSlide);
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

.hero-category-wrap {
  position: relative;
  z-index: 15;
}

.hero-category-sidebar {
  width: 258px;
}

.hero-category-icon {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #111827;
  flex-shrink: 0;
}

.hero-category-icon img {
  display: none;
}

.cat-item > .bi-chevron-right {
  color: #adb5bd;
}

.cat-item.cat-item-active {
  background: #f8f9fa;
}

.cat-item.cat-item-active > span {
  color: #111827;
}

.cat-item.cat-item-active > .bi-chevron-right {
  color: #111827;
}

.cat-item:last-child {
  border-bottom: none !important;
}

.cat-item:hover {
  background: #f8f9fa;
  color: #111827 !important;
  transform: translateX(3px);
}

.hero-mega-menu-panel {
  position: absolute;
  top: 0;
  left: calc(100% + 12px);
  width: clamp(720px, calc(100vw - 420px), 980px);
  min-height: 100%;
  max-height: 465px;
  padding: 16px;
  overflow-y: auto;
}

.hero-mega-menu-columns {
  column-count: 3;
  column-gap: 28px;
}

.hero-mega-menu-group {
  break-inside: avoid;
  margin-bottom: 18px;
}

.hero-mega-menu-group-title {
  margin: 0 0 10px;
  color: #111827;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
}

.hero-mega-menu-group-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-mega-menu-chip {
  position: relative;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  background: #fff;
  color: #111827;
  font-size: 0.92rem;
  line-height: 1.2;
  text-decoration: none;
}

.hero-mega-menu-chip:hover {
  border-color: #cfd4da;
  color: #111827;
}

.hero-mega-menu-chip.has-badge {
  padding-top: 12px;
}

.hero-mega-menu-chip-image {
  width: auto;
  max-width: 92px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
}

.hero-mega-menu-chip-title {
  white-space: nowrap;
}

.hero-mega-menu-chip-badge {
  position: absolute;
  top: -1px;
  right: 10px;
  padding: 2px 6px;
  border-radius: 0 0 8px 8px;
  background: #111827;
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
}

.hero-carousel-tabs {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: stretch;
  overflow-x: auto;
  scrollbar-width: none;
  background: #fff;
  margin-bottom: -6px;
}

.hero-carousel-tabs::-webkit-scrollbar {
  display: none;
}

.hero-carousel-tabs-left-wing {
  padding-left: 35px;
}

.hero-carousel-tabs-right-wing {
  padding-right: 35px;
}

.hero-carousel-tab {
  position: relative;
  flex: 0 0 auto;
  padding: 0.55rem 1.75rem;
  border: 0;
  background: #fff;
  color: #6b7280;
  white-space: nowrap;
  z-index: 0;
}

.hero-carousel-tab-first-active {
  margin-left: -1px;
}

.hero-carousel-tab-last-active {
  margin-right: -1px;
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
  height: 402px;
  object-fit: contain;
  object-position: center;
  background: #fff;
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

.service-welcome-card,
.service-benefits-card {
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.service-welcome-card {
  padding: 0.85rem 0.95rem;
}

.service-welcome-head {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.service-avatar {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: linear-gradient(180deg, #fff5f0 0%, #f4c8d0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.service-avatar-logo {
  width: 28px;
  height: 28px;
  display: block;
}

.service-avatar-user {
  background: linear-gradient(180deg, #f3f4f6 0%, #d1d5db 100%);
  color: #111827;
  font-size: 1.15rem;
}

.service-welcome-title {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.35;
  color: #1f2937;
}

.service-welcome-subtitle,
.service-welcome-copy {
  margin-top: 0.2rem;
  font-size: 0.74rem;
  line-height: 1.5;
  color: #6b7280;
}

.service-auth-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0.45rem 0 0.55rem;
  font-size: 0.78rem;
}

.service-text-link {
  color: #111827;
  font-weight: 600;
  text-decoration: none;
}

.service-text-link:hover {
  color: #000;
}

.service-role-chip {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  background: #111827;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 600;
}

.service-perk-link {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 0.55rem;
  text-decoration: none;
  color: #111827;
  font-size: 0.78rem;
  font-weight: 600;
}

.service-perk-link:hover,
.service-group-title:hover,
.acct-row:hover {
  color: #111827;
}

.service-perk-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  color: #111827;
}

.service-chevron {
  margin-left: auto;
  color: #9ca3af;
  font-size: 0.95rem;
}

.service-benefits-card {
  padding: 0.65rem;
}

.service-benefit-group + .service-benefit-group {
  margin-top: 0.5rem;
}

.service-group-title {
  display: block;
  padding: 0.34rem 0.55rem;
  border-radius: 0.45rem;
  background: #f3f4f6;
  color: #374151;
  text-align: center;
  text-decoration: none;
  font-size: 0.72rem;
  font-weight: 600;
  margin-bottom: 0.22rem;
}

.acct-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 28px;
  padding: 0.15rem 0.3rem;
  border-radius: 0.45rem;
  font-size: 0.76rem;
  line-height: 1.35;
  color: #1f2937;
  text-decoration: none;
  transition: background-color 0.15s, color 0.15s;
}

.acct-row:hover {
  background: #f3f4f6;
}

.service-item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  color: #111827;
  flex-shrink: 0;
}

.service-bottom-banner {
  display: block;
  margin-top: 0.5rem;
  text-decoration: none;
}

.service-bottom-pill {
  display: block;
  width: 100%;
  padding: 0.45rem 0.7rem;
  border-radius: 0.65rem;
  text-align: center;
  font-size: 0.73rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(90deg, #374151 0%, #111827 100%);
}

@media (max-width: 1399.98px) {
  .cat-item {
    min-height: 45px;
    font-size: 0.9rem;
    padding-inline: 14px !important;
  }

  .hero-mega-menu-panel {
    width: clamp(650px, calc(100vw - 360px), 900px);
    max-height: 430px;
  }

  .hero-mega-menu-columns {
    column-gap: 20px;
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
