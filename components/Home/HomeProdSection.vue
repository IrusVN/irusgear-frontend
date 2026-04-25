<template>
  <section class="my-3 my-md-4">
    <div class="d-flex flex-column flex-md-row gap-2 align-items-stretch">
      <div class="d-none d-md-flex promo-side flex-column justify-content-between gap-3">
        <a v-for="banner in resolvedDesktopBanners" :key="banner.image" :href="banner.href" class="d-block text-decoration-none">
          <img :src="banner.image" :alt="banner.alt" class="w-100 promo-side-image" loading="lazy" />
        </a>
      </div>

      <div class="d-md-none">
        <div id="mobilePromoCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3500">
          <div class="carousel-inner">
            <div
              v-for="(banner, i) in resolvedMobileBanners"
              :key="banner.image"
              :class="['carousel-item', { active: i === 0 }]"
            >
              <a :href="banner.href" class="d-block text-decoration-none">
                <img :src="banner.image" :alt="banner.alt" class="w-100 promo-mobile-image" loading="lazy" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-grow-1 section-shell overflow-hidden">
        <div class="d-flex align-items-stretch bg-white">
          <template v-if="resolvedHeaderTabs.length">
            <template v-for="(tab, idx) in resolvedHeaderTabs" :key="`${tab}-${idx}`">
              <button type="button" class="section-main-tab" :class="{ active: section.activeHeaderTabIndex === idx }" @click="onHeaderTabChange(idx)">{{ tab }}</button>
              <div v-if="idx < resolvedHeaderTabs.length - 1" class="my-auto section-tab-divider"></div>
            </template>
          </template>

          <template v-else>
            <button type="button" class="section-main-tab" :class="{ active: section.activeMainTab === 'primary' }" @click="onMainTabChange('primary')">{{ section.title }}</button>
            <div class="my-auto section-tab-divider"></div>
            <button type="button" class="section-main-tab" :class="{ active: section.activeMainTab === 'secondary' }" @click="onMainTabChange('secondary')">{{ resolvedSecondaryTitle }}</button>
          </template>
        </div>

        <div class="px-2 px-md-3 pt-2">
          <div v-if="hasNeedItems" class="feature-strip-wrap position-relative">
            <button
              title="Previous"
              class="swiper-button-prev"
              type="button"
              :disabled="!canScrollPrev"
              @click="scrollFeatureStrip(-220)"
            >
              <i class="bi bi-chevron-left"></i>
            </button>

            <div ref="featureStripRef" class="feature-strip d-flex gap-2 overflow-auto no-scrollbar pe-4 pt-1" @scroll="updateStripNavState">
              <a
                v-for="(item, i) in featureChips"
                :key="`${item.title}-${i}`"
                :href="item.href || '#'"
                class="feature-chip text-decoration-none text-dark"
              >
                <img v-if="item.image" :src="item.image" :alt="item.title" class="feature-chip-image" loading="lazy" />
                <span v-else class="feature-chip-icon-wrap">
                  <i :class="item.iconClass || 'bi bi-phone'" aria-hidden="true"></i>
                </span>
                <span class="feature-chip-title">{{ item.title }}</span>
              </a>
            </div>

            <button
              title="Next"
              class="swiper-button-next"
              type="button"
              :disabled="!canScrollNext"
              @click="scrollFeatureStrip(220)"
            >
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>

          <div class="d-flex align-items-center justify-content-between mt-2 mb-2">
            <div class="brand-strip-wrap position-relative flex-grow-1 pe-2">
              <button
                title="Previous"
                class="swiper-button-prev brand-swiper-button-prev"
                type="button"
                :disabled="!canScrollBrandPrev"
                @click="scrollBrandStrip(-240)"
              >
                <i class="bi bi-chevron-left"></i>
              </button>

              <div ref="brandStripRef" class="d-flex gap-2 overflow-auto no-scrollbar brand-strip-track" @scroll="updateBrandNavState">
              <a
                v-for="(brand, i) in resolvedBrands"
                :key="`${brand.slug || brand.title || i}-${i}`"
                :href="brand.url || '#'"
                class="btn btn-sm rounded-pill text-nowrap fw-medium brand-pill text-decoration-none"
              >
                <img v-if="brand.image" :src="brand.image" :alt="brand.title" class="brand-pill-logo" loading="lazy" />
                <span v-else>{{ brand.title }}</span>
              </a>
              </div>

              <button
                title="Next"
                class="swiper-button-next brand-swiper-button-next"
                type="button"
                :disabled="!canScrollBrandNext"
                @click="scrollBrandStrip(240)"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>

            <a :href="section.viewAllUrl || '#'" class="view-all-btn d-none d-md-inline-flex">
              Xem tất cả
              <i class="bi bi-chevron-right"></i>
            </a>
          </div>
        </div>

        <div v-if="section.loading" class="px-2 px-md-3 pb-2 pb-md-3">
          <div class="skeleton-product-grid" :style="productStripStyle">
            <SkeletonCard v-for="n in skeletonCount" :key="n" />
          </div>
        </div>

        <div v-else class="px-2 px-md-3 pb-2 pb-md-3 section-products-body">
          <div v-if="displayedProducts.length" class="product-swiper-wrap position-relative">
            <button
              title="Previous"
              class="product-swiper-button-prev"
              type="button"
              :disabled="!canScrollProductPrev"
              @click="scrollProductStrip(-500)"
            >
              <i class="bi bi-chevron-left"></i>
            </button>

            <div ref="productStripRef" class="product-strip no-scrollbar" :style="productStripStyle" @scroll="updateProductNavState">
              <div v-for="product in displayedProducts" :key="product.id" class="product-grid-item">
                <HomeProdCard :product="product" />
              </div>
            </div>

            <button
              title="Next"
              class="product-swiper-button-next"
              type="button"
              :disabled="!canScrollProductNext"
              @click="scrollProductStrip(500)"
            >
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>

          <div v-else class="text-center py-5 text-muted small">Không có sản phẩm nào</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useHomeSectionsStore } from "~/stores/homeSectionsStore";
import SkeletonCard from "~/components/common/SkeletonCard.vue";

const props = defineProps({
  sectionKey: { type: String, required: true },
  desktopProductRows: { type: Number, default: 2 },
});

const homeSectionsStore = useHomeSectionsStore();
const section = computed(() => homeSectionsStore.getSection(props.sectionKey) || {});

const featureStripRef = ref(null);
const productStripRef = ref(null);
const brandStripRef = ref(null);
const canScrollPrev = ref(false);
const canScrollNext = ref(false);
const canScrollProductPrev = ref(false);
const canScrollProductNext = ref(false);
const canScrollBrandPrev = ref(false);
const canScrollBrandNext = ref(false);
const resolvedHeaderTabs = computed(() =>
  Array.isArray(section.value.headerTabs) ? section.value.headerTabs.filter(Boolean) : []
);
const productStripStyle = computed(() => {
  const rows = Number(props.desktopProductRows);
  const safeRows = Number.isFinite(rows) && rows > 0 ? Math.floor(rows) : 2;
  return {
    "--desktop-product-rows": String(safeRows),
  };
});

const skeletonCount = computed(() => {
  const rows = Number(props.desktopProductRows);
  const safeRows = Number.isFinite(rows) && rows > 0 ? Math.floor(rows) : 2;
  return safeRows * 2;
});

const recalcAllNavStates = () => {
  updateStripNavState();
  updateBrandNavState();
  updateProductNavState();
};

const scheduleNavRecalc = () => {
  nextTick(() => {
    recalcAllNavStates();
    // Recalculate after async image/layout updates coming from API render.
    setTimeout(recalcAllNavStates, 120);
    setTimeout(recalcAllNavStates, 320);
  });
};

const resolvedSecondaryTitle = computed(() => {
  if (section.value.secondaryTitle) return section.value.secondaryTitle;
  return "MAY TINH BANG";
});

const displayedProducts = computed(() =>
  Array.isArray(section.value.products) ? section.value.products : []
);
const hasNeedItems = computed(() =>
  Array.isArray(section.value.needItems) && section.value.needItems.length > 0
);

const featureChips = computed(() => {
  if (!hasNeedItems.value) return [];

  return section.value.needItems.slice(0, 10).map((item) => ({
    title: item.title,
    image: item.image,
    iconClass: item.iconClass,
    href: item.url || "#",
  }));
});

const resolvedBrands = computed(() => {
  if (Array.isArray(section.value.brandItems) && section.value.brandItems.length) {
    return section.value.brandItems.map((item) => ({
      title: item.title,
      image: item.image,
      slug: item.slug,
      url: item.url,
    }));
  }

  if (section.value.disableTabsFallback) {
    return [];
  }

  return Array.isArray(section.value.tabs)
    ? section.value.tabs.map((tab) => ({ title: tab }))
    : [];
});

const fallbackDesktopBanners = [
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:321:795/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01KKXFP9PENJJF7Y55WM80DSAD.jpg",
    alt: "Promo Banner 1",
    href: "/category/dien-thoai?sort=newest&limit=20",
  },
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:321:795/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01KK8E4NQYFFSS1BRHNV4WXZZP.png",
    alt: "Promo Banner 2",
    href: "/category/dien-thoai?sort=newest&limit=20",
  },
];

const fallbackMobileBanners = [
  {
    image: "/image/dashboard/homehero/swiperslide/Home(3).png",
    alt: "Mobile Promo 1",
    href: "#",
  },
  {
    image: "/image/dashboard/homehero/swiperslide/690x300_open_iPhone 17e.png",
    alt: "Mobile Promo 2",
    href: "#",
  },
  {
    image: "/image/dashboard/homehero/swiperslide/690x300_ROI_MacBookNeo.png",
    alt: "Mobile Promo 3",
    href: "#",
  },
];

const resolvedDesktopBanners = computed(() =>
  Array.isArray(section.value.desktopBanners) && section.value.desktopBanners.length
    ? section.value.desktopBanners
    : fallbackDesktopBanners
);
const resolvedMobileBanners = computed(() =>
  Array.isArray(section.value.mobileBanners) && section.value.mobileBanners.length
    ? section.value.mobileBanners
    : fallbackMobileBanners
);

const onMainTabChange = async (tabType) => {
  await homeSectionsStore.handleMainTabChange(props.sectionKey, tabType);
};

const onHeaderTabChange = async (tabIndex) => {
  await homeSectionsStore.handleHeaderTabChange(props.sectionKey, tabIndex);
};

const updateStripNavState = () => {
  const el = featureStripRef.value;
  if (!el) {
    canScrollPrev.value = false;
    canScrollNext.value = false;
    return;
  }

  const maxScrollLeft = Math.max(el.scrollWidth - el.clientWidth, 0);
  canScrollPrev.value = el.scrollLeft > 1;
  canScrollNext.value = el.scrollLeft < maxScrollLeft - 1;
};

const updateProductNavState = () => {
  const el = productStripRef.value;
  if (!el) {
    canScrollProductPrev.value = false;
    canScrollProductNext.value = false;
    return;
  }

  const maxScrollLeft = Math.max(el.scrollWidth - el.clientWidth, 0);
  canScrollProductPrev.value = el.scrollLeft > 1;
  canScrollProductNext.value = el.scrollLeft < maxScrollLeft - 1;
};

const updateBrandNavState = () => {
  const el = brandStripRef.value;
  if (!el) {
    canScrollBrandPrev.value = false;
    canScrollBrandNext.value = false;
    return;
  }

  const maxScrollLeft = Math.max(el.scrollWidth - el.clientWidth, 0);
  canScrollBrandPrev.value = el.scrollLeft > 1;
  canScrollBrandNext.value = el.scrollLeft < maxScrollLeft - 1;
};

const scrollFeatureStrip = (offset) => {
  const el = featureStripRef.value;
  if (!el) return;
  el.scrollBy({ left: offset, behavior: "smooth" });
  setTimeout(updateStripNavState, 220);
};

const scrollProductStrip = (offset) => {
  const el = productStripRef.value;
  if (!el) return;
  el.scrollBy({ left: offset, behavior: "smooth" });
  setTimeout(updateProductNavState, 220);
};

const scrollBrandStrip = (offset) => {
  const el = brandStripRef.value;
  if (!el) return;
  el.scrollBy({ left: offset, behavior: "smooth" });
  setTimeout(updateBrandNavState, 220);
};

onMounted(() => {
  scheduleNavRecalc();
  window.addEventListener("resize", updateStripNavState);
  window.addEventListener("resize", updateProductNavState);
  window.addEventListener("resize", updateBrandNavState);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateStripNavState);
  window.removeEventListener("resize", updateProductNavState);
  window.removeEventListener("resize", updateBrandNavState);
});

watch(
  () => [
    section.value.loading,
    featureChips.value.length,
    resolvedBrands.value.length,
    displayedProducts.value.length,
  ],
  () => {
    scheduleNavRecalc();
  },
  { immediate: true }
);
</script>

<style scoped>
.promo-side {
  flex: 0 0 200px;
}

.promo-side-image {
  border-radius: 10px;
  object-fit: cover;
}

.section-shell {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #d9e0ea;
  display: flex;
  flex-direction: column;
}

.promo-mobile-image {
  border-radius: 12px;
  object-fit: cover;
}

.section-main-tab {
  flex: 1 1 0;
  min-height: 60px;
  border: 0;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  color: #111827;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

.section-main-tab.active {
  border-bottom: 2px solid #d70018;
  color: #d70018;
  background: linear-gradient(to top, rgba(215, 0, 24, 0.05), rgba(255, 255, 255, 0));
}

.section-tab-divider {
  height: 20px;
  border-left: 1px solid #e5e7eb;
}

.feature-strip-wrap {
  position: relative;
}

.feature-strip {
  padding-inline: 18px;
}

.feature-chip {
  min-width: 146px;
  min-height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f5f6f7;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
}

.feature-chip-image,
.feature-chip-icon-wrap {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.feature-chip-image {
  object-fit: contain;
}

.feature-chip-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  background: #fff;
  border: 1px solid #e9edf2;
  color: #4b5563;
  font-size: 0.78rem;
}

.feature-chip-title {
  font-size: 0.73rem;
  font-weight: 600;
  line-height: 1.2;
  line-clamp: 2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.brand-pill {
  border: 1px solid #d0d7e1;
  background: #f4f6fa;
  color: #2b2f36;
  font-size: 0.8rem;
  min-height: 30px;
  padding: 3px 11px;
}

.brand-pill-logo {
  height: 13px;
  max-width: 62px;
  object-fit: contain;
}

.view-all-btn {
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  min-height: 24px;
  padding: 0.375rem 0.5rem;
  border: 1px solid #fff;
  border-radius: 999px;
  background: #fff;
  color: #3b82f6;
  font-size: 0.82rem;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
}

.view-all-btn i {
  font-size: 0.85rem;
}

.view-all-btn:hover {
  border-color: #f3f4f6;
  background: #f9fafb;
  color: #2563eb;
}

.brand-strip-wrap {
  position: relative;
  min-width: 0;
}

.brand-strip-track {
  padding-inline: 14px;
  min-width: 0;
}

.brand-swiper-button-prev,
.brand-swiper-button-next {
  position: absolute;
  top: 50%;
  z-index: 3;
  width: 24px;
  height: 48px;
  border: 1px solid #e5e7eb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #111827;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);
  transform: translateY(-50%);
  transition: background-color 0.15s ease, opacity 0.15s ease;
}

.brand-swiper-button-prev i,
.brand-swiper-button-next i {
  font-size: 1.1rem;
}

.brand-swiper-button-prev {
  left: 0;
  border-radius: 0 999px 999px 0;
}

.brand-swiper-button-next {
  right: 0;
  border-radius: 999px 0 0 999px;
}

.brand-swiper-button-prev:disabled,
.brand-swiper-button-next:disabled {
  opacity: 0;
  cursor: default;
  pointer-events: none;
}

.brand-swiper-button-prev:not(:disabled):hover,
.brand-swiper-button-next:not(:disabled):hover {
  background: rgba(255, 255, 255, 1);
}

.swiper-button-prev,
.swiper-button-next {
  position: absolute;
  top: 54%;
  z-index: 3;
  width: 24px;
  height: 39px;
  border: 1px solid #e5e7eb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #111827;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);
  transform: translateY(-50%);
  transition: background-color 0.15s ease, opacity 0.15s ease;
}

.swiper-button-prev i,
.swiper-button-next i {
  font-size: 1.15rem;
}

.swiper-button-prev {
  left: 0;
  border-radius: 0 999px 999px 0;
}

.swiper-button-next {
  right: 0;
  border-radius: 999px 0 0 999px;
}

.swiper-button-prev:disabled,
.swiper-button-next:disabled {
  opacity: 0;
  cursor: default;
  pointer-events: none;
}

.swiper-button-prev:not(:disabled):hover,
.swiper-button-next:not(:disabled):hover {
  background: rgba(255, 255, 255, 1);
}

.no-scrollbar {
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.product-swiper-wrap {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
}

.product-strip {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(1, minmax(0, 1fr));
  grid-auto-columns: calc((100% - 8px) / 2);
  gap: 8px;
  overflow-x: auto;
  padding: 4px 18px;
  height: 100%;
  align-items: stretch;
}

.product-grid-item {
  min-width: 0;
  height: 100%;
}

.section-products-body {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
}

.product-swiper-button-prev,
.product-swiper-button-next {
  position: absolute;
  top: 50%;
  z-index: 4;
  width: 28px;
  height: 56px;
  border: 1px solid #e5e7eb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #111827;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);
  transform: translateY(-50%);
  transition: background-color 0.15s ease, opacity 0.15s ease;
}

.product-swiper-button-prev i,
.product-swiper-button-next i {
  font-size: 1.25rem;
}

.product-swiper-button-prev {
  left: 0;
  border-radius: 0 999px 999px 0;
}

.product-swiper-button-next {
  right: 0;
  border-radius: 999px 0 0 999px;
}

.product-swiper-button-prev:disabled,
.product-swiper-button-next:disabled {
  opacity: 0;
  cursor: default;
  pointer-events: none;
}

.product-swiper-button-prev:not(:disabled):hover,
.product-swiper-button-next:not(:disabled):hover {
  background: rgba(255, 255, 255, 1);
}

@media (min-width: 768px) {
  .product-strip {
    grid-template-rows: repeat(var(--desktop-product-rows, 2), minmax(0, 1fr));
    grid-auto-columns: 222px;
  }

  .product-grid-item {
    min-height: 100%;
  }
}

@media (min-width: 1200px) {
  .feature-chip {
    min-width: 148px;
  }

  .product-swiper-button-prev,
  .product-swiper-button-next {
    height: 72px;
    width: 34px;
  }
}

.skeleton-product-grid {
  display: grid;
  grid-template-columns: repeat(2, calc((100% - 8px) / 2));
  gap: 8px;
}

.skeleton-product-grid .skeleton-card-shell {
  height: 100%;
  min-height: 280px;
}

@media (min-width: 768px) {
  .skeleton-product-grid {
    grid-template-columns: repeat(var(--desktop-product-rows, 2), 222px);
  }
}
</style>
