<template>
  <Teleport to="body">
    <Transition name="dropdown-search-fade">
      <div
        v-if="open && !isMobileMode"
        class="dropdown-search-layer"
        role="dialog"
        aria-labelledby="dropdown-search-title"
        @pointerdown.self="close"
      >
        <section
          class="dropdown-search-panel"
          :style="panelStyle"
          @pointerdown.stop
        >
          <header class="dropdown-search-header">
            <h2 id="dropdown-search-title" class="dropdown-search-title">
              <i class="bi bi-clock-history" aria-hidden="true"></i>
              <span>{{ labels.historyTitle }}</span>
            </h2>

            <button
              type="button"
              class="dropdown-search-clear"
              :disabled="historyItems.length === 0"
              @click="clearHistory"
            >
              <span>{{ labels.clearAll }}</span>
              <i class="bi bi-trash3" aria-hidden="true"></i>
            </button>
          </header>

          <div class="dropdown-search-history" :aria-label="labels.historyTitle">
            <NuxtLink
              v-for="item in historyItems"
              :key="item"
              :to="buildSearchTo(item)"
              class="dropdown-search-history-item"
              @click="close"
            >
              <i class="bi bi-clock-history" aria-hidden="true"></i>
              <span>{{ item }}</span>
            </NuxtLink>
          </div>

          <div class="dropdown-search-trending-title">
            <span class="dropdown-search-flame" aria-hidden="true">🔥</span>
            <span>{{ labels.trendingTitle }}</span>
          </div>

          <div class="dropdown-search-trending" :aria-label="labels.trendingTitle">
            <NuxtLink
              v-for="item in trendingItems"
              :key="item.name"
              :to="buildSearchTo(item.name)"
              class="dropdown-search-trending-item"
              @click="close"
            >
              <span
                class="dropdown-search-thumb"
                :class="`dropdown-search-thumb--${item.variant}`"
                aria-hidden="true"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                  loading="lazy"
                >
              </span>
              <span class="dropdown-search-trending-name">{{ item.name }}</span>
            </NuxtLink>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>

  <BottomSheet ref="mobileSheetRef" @close="handleMobileSheetClose">
    <div
      class="dropdown-search-mobile-sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dropdown-search-mobile-title"
    >
      <header class="dropdown-search-mobile-header">
        <div class="dropdown-search-mobile-heading">
          <p class="dropdown-search-mobile-eyebrow">{{ labels.mobileEyebrow }}</p>
          <h2 id="dropdown-search-mobile-title" class="dropdown-search-mobile-title">
            {{ labels.mobileTitle }}
          </h2>
        </div>

        <button
          type="button"
          class="dropdown-search-mobile-close"
          :aria-label="labels.closeLabel"
          @click="close"
        >
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      </header>

      <form
        class="dropdown-search-mobile-form"
        role="search"
        @submit.prevent="submitMobileSearch"
      >
        <i class="bi bi-search dropdown-search-mobile-form-icon" aria-hidden="true"></i>
        <input
          ref="mobileSearchInputRef"
          v-model="mobileSearchKeyword"
          type="search"
          class="dropdown-search-mobile-input"
          :placeholder="searchPlaceholder"
          autocomplete="off"
        >

        <button
          v-if="mobileSearchKeyword"
          type="button"
          class="dropdown-search-mobile-clear"
          :aria-label="labels.clearKeyword"
          @click="mobileSearchKeyword = ''"
        >
          <i class="bi bi-x-circle-fill" aria-hidden="true"></i>
        </button>

        <button type="submit" class="dropdown-search-mobile-submit">
          {{ labels.searchAction }}
        </button>
      </form>

      <p class="dropdown-search-mobile-hint">{{ labels.mobileHint }}</p>

      <section class="dropdown-search-mobile-section">
        <header class="dropdown-search-mobile-section-header">
          <h3 class="dropdown-search-mobile-section-title">
            <i class="bi bi-clock-history" aria-hidden="true"></i>
            <span>{{ labels.historyTitle }}</span>
          </h3>

          <button
            type="button"
            class="dropdown-search-mobile-link"
            :disabled="historyItems.length === 0"
            @click="clearHistory"
          >
            {{ labels.clearAll }}
          </button>
        </header>

        <div
          v-if="historyItems.length"
          class="dropdown-search-mobile-history"
          :aria-label="labels.historyTitle"
        >
          <NuxtLink
            v-for="item in historyItems"
            :key="`mobile-${item}`"
            :to="buildSearchTo(item)"
            class="dropdown-search-mobile-history-item"
            @click="close"
          >
            <i class="bi bi-arrow-up-left" aria-hidden="true"></i>
            <span>{{ item }}</span>
          </NuxtLink>
        </div>

        <p v-else class="dropdown-search-mobile-empty">
          {{ labels.emptyHistory }}
        </p>
      </section>

      <section class="dropdown-search-mobile-section">
        <header class="dropdown-search-mobile-section-header">
          <h3 class="dropdown-search-mobile-section-title">
            <span class="dropdown-search-flame" aria-hidden="true">🔥</span>
            <span>{{ labels.trendingTitle }}</span>
          </h3>
        </header>

        <div class="dropdown-search-mobile-grid" :aria-label="labels.trendingTitle">
          <NuxtLink
            v-for="item in trendingItems"
            :key="`mobile-card-${item.name}`"
            :to="buildSearchTo(item.name)"
            class="dropdown-search-mobile-card"
            @click="close"
          >
            <span
              class="dropdown-search-thumb"
              :class="`dropdown-search-thumb--${item.variant}`"
              aria-hidden="true"
            >
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                loading="lazy"
              >
            </span>

            <span class="dropdown-search-mobile-card-name">{{ item.name }}</span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </BottomSheet>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { navigateTo, useLocalePath, useI18n } from "#imports";
import BottomSheet from "@/components/Common/BottomSheet.vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  anchorRect: {
    type: Object,
    default: null,
  },
  mode: {
    type: String,
    default: "desktop",
  },
});

const emit = defineEmits(["update:open"]);

const localePath = useLocalePath();
const { locale, t } = useI18n();
const viewportWidth = ref(0);
const mobileSheetRef = ref(null);
const mobileSearchInputRef = ref(null);
const mobileSearchKeyword = ref("");
const isMobileMode = computed(() => props.mode === "mobile");
const searchPlaceholder = computed(() => t("home.searchProducts"));

const historyItems = ref([
  "iPhone 17 Series",
  "legion loq",
  "legion loq",
  "legion R7000",
  "Lenovo Legion",
]);

const labels = computed(() => {
  if (locale.value === "en") {
    return {
      historyTitle: "Search history",
      clearAll: "Clear all",
      trendingTitle: "Trending searches",
      mobileEyebrow: "Quick search",
      mobileTitle: "Search products",
      mobileHint: "Search by product name, model line, or category.",
      searchAction: "Search",
      closeLabel: "Close search",
      clearKeyword: "Clear keyword",
      emptyHistory: "No recent searches yet.",
    };
  }

  return {
    historyTitle: "Lịch sử tìm kiếm",
    clearAll: "Xoá tất cả",
    trendingTitle: "Xu hướng tìm kiếm",
    mobileEyebrow: "Tìm kiếm nhanh",
    mobileTitle: "Tìm sản phẩm",
    mobileHint: "Nhập tên sản phẩm, dòng máy hoặc danh mục bạn đang cần.",
    searchAction: "Tìm",
    closeLabel: "Đóng tìm kiếm",
    clearKeyword: "Xoá từ khoá",
    emptyHistory: "Bạn chưa có lượt tìm kiếm gần đây.",
  };
});

const panelStyle = computed(() => {
  const safeViewportWidth = viewportWidth.value || 500;
  const panelWidth = Math.min(500, Math.max(safeViewportWidth - 4, 300));
  const anchor = props.anchorRect;

  if (!anchor) {
    return {
      top: "10px",
      left: "50%",
      width: `${panelWidth}px`,
      transform: "translateX(-50%)",
      "--dropdown-search-arrow-left": "76px",
    };
  }

  const edgePadding = 2;
  const topGap = 17;
  const maxLeft = Math.max(safeViewportWidth - panelWidth - edgePadding, edgePadding);
  const left = Math.min(Math.max(anchor.left, edgePadding), maxLeft);
  const arrowOffset = Math.min(86, Math.max(anchor.width * 0.2, 54));
  const arrowLeft = Math.min(
    Math.max(anchor.left - left + arrowOffset, 18),
    panelWidth - 18
  );

  return {
    top: `${anchor.bottom + topGap}px`,
    left: `${left}px`,
    width: `${panelWidth}px`,
    "--dropdown-search-arrow-left": `${arrowLeft}px`,
  };
});

const trendingItems = [
  {
    name: "iPhone 17 Series",
    variant: "iphone-series",
    image: "/image/dashboard/homehero/swiperslide/690x300_open_iPhone 17e.png",
  },
  {
    name: "Galaxy S26 Ultra",
    variant: "galaxy",
    image: "/image/dashboard/homehero/swiperslide/Home(3).png",
  },
  {
    name: "MacBook Pro M5 Pro",
    variant: "macbook-pro",
    image: "/image/dashboard/homehero/swiperslide/mbam5homepae.png",
  },
  {
    name: "MacBook Neo",
    variant: "macbook-neo",
    image: "/image/dashboard/homehero/swiperslide/690x300_ROI_MacBookNeo.png",
  },
  {
    name: "OPPO Find X9 Ultra",
    variant: "oppo",
    image: "/image/dashboard/homehero/swiperslide/oppofingn6.png",
  },
  {
    name: "iPad Air M4",
    variant: "ipad",
  },
  {
    name: "Samsung Galaxy Watch8",
    variant: "watch",
  },
  {
    name: "MacBook Air M5",
    variant: "macbook-air",
    image: "/image/dashboard/homehero/swiperslide/mbam5homepae.png",
  },
  {
    name: "iPhone 17e",
    variant: "iphone-17e",
    image: "/image/dashboard/homehero/swiperslide/690x300_open_iPhone 17e.png",
  },
  {
    name: "Kính thông minh Xiaomi",
    variant: "glasses",
  },
];

const close = () => {
  emit("update:open", false);
};

const handleMobileSheetClose = () => {
  if (props.open) {
    emit("update:open", false);
  }
};

const clearHistory = () => {
  historyItems.value = [];
};

const buildSearchTo = (keyword) => ({
  path: localePath("/products"),
  query: {
    search: keyword,
    sort: "newest",
    limit: "20",
  },
});

const handleKeydown = (event) => {
  if (event.key === "Escape") {
    close();
  }
};

const submitMobileSearch = async () => {
  const keyword = mobileSearchKeyword.value.trim();
  if (!keyword) return;

  close();
  await navigateTo(buildSearchTo(keyword));
};

const syncViewportWidth = () => {
  if (typeof window === "undefined") return;
  viewportWidth.value = window.innerWidth;
};

const focusMobileSearchInput = async () => {
  await nextTick();

  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    mobileSearchInputRef.value?.focus();
  }, 180);
};

watch(
  () => [props.open, props.mode],
  async ([nextOpen, nextMode]) => {
    if (typeof document === "undefined") return;

    if (nextOpen) {
      syncViewportWidth();
      document.addEventListener("keydown", handleKeydown);
      window.addEventListener("resize", syncViewportWidth, { passive: true });
    } else {
      document.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("resize", syncViewportWidth);
    }

    if (nextMode === "mobile") {
      if (nextOpen) {
        mobileSheetRef.value?.open();
        focusMobileSearchInput();
        return;
      }

      mobileSheetRef.value?.close();
      return;
    }

    mobileSheetRef.value?.close();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (typeof document === "undefined") return;
  document.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", syncViewportWidth);
});
</script>

<style scoped>
.dropdown-search-layer {
  position: fixed;
  inset: 0;
  z-index: 1095;
  background: transparent;
  pointer-events: none;
}

.dropdown-search-panel {
  position: fixed;
  min-height: 474px;
  padding: 9px 8px 12px;
  border: 1px solid rgba(17, 17, 17, 0.5);
  border-radius: 7px;
  background: #ffffff;
  color: #202124;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  pointer-events: auto;
}

.dropdown-search-panel::before {
  content: "";
  position: absolute;
  top: -10px;
  left: var(--dropdown-search-arrow-left, 76px);
  width: 0;
  height: 0;
  transform: translateX(-50%);
  border-right: 10px solid transparent;
  border-bottom: 10px solid #ffffff;
  border-left: 10px solid transparent;
}

.dropdown-search-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  gap: 16px;
}

.dropdown-search-title {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  color: #111111;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.dropdown-search-title i {
  color: #d70018;
  font-size: 13px;
  line-height: 1;
}

.dropdown-search-clear {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 22px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #111111;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
}

.dropdown-search-clear:disabled {
  opacity: 0.45;
  cursor: default;
}

.dropdown-search-clear:not(:disabled):hover {
  color: #d70018;
}

.dropdown-search-clear i {
  font-size: 13px;
  line-height: 1;
}

.dropdown-search-history {
  display: grid;
  margin-top: 2px;
}

.dropdown-search-history-item {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 29px;
  padding: 0 2px;
  border-radius: 4px;
  color: #70747d;
  font-size: 14px;
  line-height: 1.2;
  text-decoration: none;
}

.dropdown-search-history-item i {
  color: #c7cbd1;
  font-size: 14px;
  line-height: 1;
}

.dropdown-search-history-item:hover,
.dropdown-search-trending-item:hover {
  background: #f7f7f7;
  color: #222222;
}

.dropdown-search-trending-title {
  display: flex;
  align-items: center;
  gap: 3px;
  min-height: 27px;
  margin-top: 2px;
  color: #111111;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.dropdown-search-flame {
  font-size: 17px;
  line-height: 1;
}

.dropdown-search-trending {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
  padding: 1px 6px 0 8px;
}

.dropdown-search-trending-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  min-height: 52px;
  border-radius: 4px;
  color: #30343a;
  font-size: 14px;
  line-height: 1.2;
  text-decoration: none;
}

.dropdown-search-trending-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-search-thumb {
  position: relative;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.dropdown-search-thumb img {
  display: block;
  width: 38px;
  height: 38px;
  object-fit: cover;
  object-position: center;
  border-radius: 3px;
}

.dropdown-search-thumb--galaxy img,
.dropdown-search-thumb--macbook-air img,
.dropdown-search-thumb--macbook-pro img {
  object-position: left center;
}

.dropdown-search-thumb--macbook-neo img,
.dropdown-search-thumb--oppo img {
  object-position: right center;
}

.dropdown-search-thumb--ipad::before {
  content: "";
  width: 22px;
  height: 36px;
  border-radius: 4px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0) 36%),
    linear-gradient(145deg, #bff4ff 0%, #5fb8ff 38%, #1b5fba 100%);
  border: 2px solid #24364d;
  box-shadow: 4px 2px 0 rgba(0, 0, 0, 0.1);
}

.dropdown-search-thumb--watch::before {
  content: "";
  width: 31px;
  height: 31px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, #0f172a 0 46%, transparent 47%),
    conic-gradient(from 315deg, #111827, #5b6472, #111827);
  border: 2px solid #20242a;
  box-shadow:
    inset 0 0 0 2px #0b0d10,
    0 -7px 0 -4px #2f343c,
    0 7px 0 -4px #2f343c;
}

.dropdown-search-thumb--watch::after {
  content: "";
  position: absolute;
  width: 7px;
  height: 7px;
  border-right: 1px solid #ffffff;
  border-bottom: 1px solid #ffffff;
  transform: rotate(45deg);
}

.dropdown-search-thumb--glasses::before {
  content: "";
  width: 34px;
  height: 12px;
  border: 2px solid #2f343a;
  border-top: 0;
  border-radius: 0 0 16px 16px;
  transform: rotate(-14deg);
}

.dropdown-search-thumb--glasses::after {
  content: "";
  position: absolute;
  width: 12px;
  height: 2px;
  border-radius: 999px;
  background: #2f343a;
  transform: translate(16px, -8px) rotate(-21deg);
  box-shadow: -22px 10px 0 #2f343a;
}

.dropdown-search-fade-enter-active,
.dropdown-search-fade-leave-active {
  transition: opacity 0.16s ease;
}

.dropdown-search-fade-enter-from,
.dropdown-search-fade-leave-to {
  opacity: 0;
}

.dropdown-search-mobile-sheet {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 16px 28px;
  background:
    radial-gradient(circle at top right, rgba(17, 17, 17, 0.05), transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
}

.dropdown-search-mobile-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.dropdown-search-mobile-heading {
  min-width: 0;
}

.dropdown-search-mobile-eyebrow {
  margin: 0 0 4px;
  color: #71717a;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dropdown-search-mobile-title {
  margin: 0;
  color: #18181b;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.1;
}

.dropdown-search-mobile-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  color: #18181b;
  flex-shrink: 0;
}

.dropdown-search-mobile-form {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 54px;
  padding: 0 12px 0 14px;
  border: 1px solid rgba(17, 17, 17, 0.16);
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(17, 17, 17, 0.06);
}

.dropdown-search-mobile-form-icon {
  color: #18181b;
  font-size: 17px;
  line-height: 1;
}

.dropdown-search-mobile-input {
  min-width: 0;
  flex: 1 1 auto;
  border: 0;
  outline: 0;
  background: transparent;
  color: #18181b;
  font-size: 15px;
  font-weight: 500;
}

.dropdown-search-mobile-input::placeholder {
  color: #a1a1aa;
  opacity: 1;
}

.dropdown-search-mobile-clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: #a1a1aa;
  font-size: 18px;
  line-height: 1;
}

.dropdown-search-mobile-submit {
  min-width: 58px;
  height: 36px;
  padding: 0 14px;
  border: 1px solid #111111;
  border-radius: 12px;
  background: #111111;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
}

.dropdown-search-mobile-hint {
  margin: -6px 0 0;
  color: #71717a;
  font-size: 12px;
  line-height: 1.55;
}

.dropdown-search-mobile-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dropdown-search-mobile-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.dropdown-search-mobile-section-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: #18181b;
  font-size: 15px;
  font-weight: 700;
}

.dropdown-search-mobile-section-title i {
  color: #18181b;
  font-size: 14px;
}

.dropdown-search-mobile-link {
  padding: 0;
  border: 0;
  background: transparent;
  color: #52525b;
  font-size: 13px;
  font-weight: 600;
}

.dropdown-search-mobile-link:disabled {
  opacity: 0.45;
}

.dropdown-search-mobile-history {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dropdown-search-mobile-history-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #e4e4e7;
  border-radius: 999px;
  background: #ffffff;
  color: #52525b;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
}

.dropdown-search-mobile-history-item i {
  color: #a1a1aa;
  font-size: 13px;
}

.dropdown-search-mobile-empty {
  margin: 0;
  padding: 12px 14px;
  border: 1px dashed #e5e7eb;
  border-radius: 14px;
  background: #fcfcfc;
  color: #71717a;
  font-size: 13px;
  line-height: 1.5;
}

.dropdown-search-mobile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.dropdown-search-mobile-card {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 78px;
  padding: 10px;
  border: 1px solid #ececf1;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 10px 18px rgba(17, 17, 17, 0.04);
  color: #18181b;
  text-decoration: none;
}

.dropdown-search-mobile-card-name {
  min-width: 0;
  display: -webkit-box;
  overflow: hidden;
  color: #18181b;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.dropdown-search-mobile-card .dropdown-search-thumb {
  flex: 0 0 46px;
  width: 46px;
  height: 46px;
}

.dropdown-search-mobile-card .dropdown-search-thumb img {
  width: 42px;
  height: 42px;
}

@media (max-width: 575.98px) {
  .dropdown-search-panel {
    top: 10px !important;
    left: 10px !important;
    width: calc(100vw - 20px) !important;
    transform: none !important;
    min-height: auto;
    max-height: calc(100vh - 20px);
    overflow-y: auto;
  }

  .dropdown-search-panel::before {
    display: none;
  }

  .dropdown-search-trending {
    grid-template-columns: 1fr;
  }

  .dropdown-search-mobile-sheet {
    padding-right: 14px;
    padding-left: 14px;
  }
}

@media (max-width: 380px) {
  .dropdown-search-mobile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
