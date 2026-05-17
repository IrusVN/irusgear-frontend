<template>
  <Teleport to="body">
    <!-- Desktop dropdown -->
    <div
      v-if="open && mode === 'desktop'"
      class="dropdown-search-desktop-layer"
      @pointerdown.self="emit('update:open', false)"
    >
      <div class="dropdown-search-desktop-panel" :style="panelStyle">

        <!-- ── Empty state: history + trending ── -->
        <template v-if="inputMode === 'empty'">
          <header class="dropdown-search-header">
            <h2 id="dropdown-search-title" class="dropdown-search-title">
              <i class="bi bi-clock-history" aria-hidden="true"></i>
              <span>{{ labels.historyTitle }}</span>
            </h2>
            <button
              type="button"
              class="dropdown-search-clear"
              :disabled="searchStore.history.length === 0"
              @click="confirmClearHistory"
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
            >
              <i class="bi bi-clock-history" aria-hidden="true"></i>
              <span>{{ item }}</span>
            </NuxtLink>
            <p v-if="historyItems.length === 0" class="dropdown-search-empty">
              {{ labels.emptyHistory }}
            </p>
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
            >
              <span
                class="dropdown-search-thumb"
                :class="`dropdown-search-thumb--${item.variant}`"
                aria-hidden="true"
              >
                <img v-if="item.image" :src="item.image" :alt="item.name" loading="lazy">
              </span>
              <span class="dropdown-search-trending-name">{{ item.name }}</span>
            </NuxtLink>
          </div>
        </template>

        <!-- ── Typing state: suggestions + products ── -->
        <template v-else>
          <!-- "Có phải bạn muốn tìm" -->
          <div v-if="searchStore.suggestions.length > 0" class="dropdown-search-section">
            <div class="dropdown-search-section-title">
              <i class="bi bi-search" aria-hidden="true"></i>
              <span>{{ labels.suggestionsTitle }}</span>
            </div>
            <div class="dropdown-search-suggestions" :aria-label="labels.suggestionsTitle">
              <NuxtLink
                v-for="s in searchStore.suggestions"
                :key="s.id"
                :to="s.url || (localePath('/products') + '?search=' + encodeURIComponent(s.label || s.keyword))"
                class="dropdown-search-suggestion-item"
                @click="emit('update:open', false)"
              >
                <i class="bi bi-search" aria-hidden="true"></i>
                <span class="dropdown-search-suggestion-label">{{ s.label || s.keyword }}</span>
                <img
                  v-if="s.image || s.img"
                  :src="s.image || s.img"
                  :alt="s.label"
                  class="dropdown-search-suggestion-img"
                  loading="lazy"
                >
              </NuxtLink>
            </div>
          </div>

          <!-- "Sản phẩm gợi ý" -->
          <div v-if="searchStore.products.length > 0" class="dropdown-search-section">
            <div class="dropdown-search-section-title">
              <span class="dropdown-search-flame" aria-hidden="true">🔥</span>
              <span>{{ labels.suggestedProducts }}</span>
            </div>
            <div class="dropdown-search-products" :aria-label="labels.suggestedProducts">
              <NuxtLink
                v-for="p in searchStore.products"
                :key="p.id"
                :to="p.url || localePath('/products/' + p.slug)"
                class="dropdown-search-product-item"
                @click="emit('update:open', false)"
              >
                <img
                  :src="p.image || p.img || 'https://placehold.co/80x80/f5f5f5/999?text=IMG'"
                  :alt="p.name"
                  class="dropdown-search-product-img"
                  loading="lazy"
                >
                <div class="dropdown-search-product-info">
                  <span class="dropdown-search-product-name">{{ p.name }}</span>
                  <div class="dropdown-search-product-prices">
                    <span class="dropdown-search-price-sale">{{ formatPrice(p.price) }}đ</span>
                    <span v-if="p.original_price && p.original_price > p.price" class="dropdown-search-price-original">
                      {{ formatPrice(p.original_price) }}đ
                    </span>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- No results -->
          <p v-if="searchStore.suggestions.length === 0 && searchStore.products.length === 0 && !searchStore.suggestionsLoading" class="dropdown-search-empty">
            {{ labels.emptyHistory }}
          </p>
        </template>

      </div>
    </div>

    <!-- Mobile bottom sheet -->
    <BottomSheet
      :open="open && mode === 'mobile'"
      @close="emit('update:open', false)"
    >
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
            @click="emit('update:open', false)"
          >
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </header>

        <form class="dropdown-search-mobile-form" role="search" @submit.prevent="submitMobileSearch">
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

        <!-- Mobile: typing state → suggestions + products -->
        <template v-if="mobileInputMode === 'typing'">
          <div v-if="searchStore.suggestions.length > 0" class="dropdown-search-mobile-section">
            <div class="dropdown-search-mobile-section-header">
              <h3 class="dropdown-search-mobile-section-title">
                <i class="bi bi-search" aria-hidden="true"></i>
                <span>{{ labels.suggestionsTitle }}</span>
              </h3>
            </div>
            <div class="dropdown-search-mobile-suggestions">
              <NuxtLink
                v-for="s in searchStore.suggestions"
                :key="`mob-s-${s.id}`"
                :to="s.url || (localePath('/products') + '?search=' + encodeURIComponent(s.label || s.keyword))"
                class="dropdown-search-mobile-suggestion-item"
                @click="emit('update:open', false)"
              >
                <i class="bi bi-search" aria-hidden="true"></i>
                <span>{{ s.label || s.keyword }}</span>
              </NuxtLink>
            </div>
          </div>

          <div v-if="searchStore.products.length > 0" class="dropdown-search-mobile-section">
            <div class="dropdown-search-mobile-section-header">
              <h3 class="dropdown-search-mobile-section-title">
                <span class="dropdown-search-flame" aria-hidden="true">🔥</span>
                <span>{{ labels.suggestedProducts }}</span>
              </h3>
            </div>
            <div class="dropdown-search-mobile-grid">
              <NuxtLink
                v-for="p in searchStore.products"
                :key="`mob-p-${p.id}`"
                :to="p.url || localePath('/products/' + p.slug)"
                class="dropdown-search-mobile-card"
                @click="emit('update:open', false)"
              >
                <img
                  :src="p.image || p.img || 'https://placehold.co/80x80/f5f5f5/999?text=IMG'"
                  :alt="p.name"
                  class="dropdown-search-mobile-card-img"
                  loading="lazy"
                >
                <div class="dropdown-search-mobile-card-info">
                  <span class="dropdown-search-mobile-card-name">{{ p.name }}</span>
                  <div class="dropdown-search-mobile-card-prices">
                    <span class="dropdown-search-price-sale">{{ formatPrice(p.price) }}đ</span>
                    <span v-if="p.original_price && p.original_price > p.price" class="dropdown-search-price-original">
                      {{ formatPrice(p.original_price) }}đ
                    </span>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </template>

        <!-- Mobile: empty state -->
        <template v-else>
          <section class="dropdown-search-mobile-section">
            <header class="dropdown-search-mobile-section-header">
              <h3 class="dropdown-search-mobile-section-title">
                <i class="bi bi-clock-history" aria-hidden="true"></i>
                <span>{{ labels.historyTitle }}</span>
              </h3>
              <button
                type="button"
                class="dropdown-search-mobile-link"
                :disabled="searchStore.history.length === 0"
                @click="confirmClearHistory"
              >
                {{ labels.clearAll }}
              </button>
            </header>

            <div v-if="historyItems.length" class="dropdown-search-mobile-history" :aria-label="labels.historyTitle">
              <NuxtLink
                v-for="item in historyItems"
                :key="`mobile-${item}`"
                :to="buildSearchTo(item)"
                class="dropdown-search-mobile-history-item"
              >
                <i class="bi bi-arrow-up-left" aria-hidden="true"></i>
                <span>{{ item }}</span>
              </NuxtLink>
            </div>
            <p v-else class="dropdown-search-mobile-empty">{{ labels.emptyHistory }}</p>
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
              >
                <span
                  class="dropdown-search-thumb"
                  :class="`dropdown-search-thumb--${item.variant}`"
                  aria-hidden="true"
                >
                  <img v-if="item.image" :src="item.image" :alt="item.name" loading="lazy">
                </span>
                <span class="dropdown-search-mobile-card-name">{{ item.name }}</span>
              </NuxtLink>
            </div>
          </section>
        </template>
      </div>
    </BottomSheet>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { navigateTo, useLocalePath, useI18n } from "#imports";
import { toast } from "vue-sonner";
import BottomSheet from "@/components/Common/BottomSheet.vue";
import { useSearchStore } from "@/stores/searchStore";

const props = defineProps({
  open: { type: Boolean, default: false },
  anchorRect: { type: Object, default: null },
  mode: { type: String, default: "desktop" },
  searchQuery: { type: String, default: "" },
});

const emit = defineEmits(["update:open"]);

const localePath = useLocalePath();
const { locale, t } = useI18n();
const searchStore = useSearchStore();
const mobileSearchInputRef = ref(null);
const mobileSearchKeyword = ref("");
const searchPlaceholder = computed(() => t("home.searchProducts"));

// 'empty' = history + trending; 'typing' = suggestions + products
const inputMode = computed(() =>
  props.searchQuery?.length >= 1 ? 'typing' : 'empty'
);

// History items from API — empty string keyword = fallback empty
const historyItems = computed(() =>
  searchStore.history.map(h => h.keyword)
);

const labels = computed(() => locale.value === "en" ? {
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
  suggestionsTitle: "Did you mean",
  suggestedProducts: "Suggested products",
} : {
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
  suggestionsTitle: "Có phải bạn muốn tìm",
  suggestedProducts: "Sản phẩm gợi ý",
});

const panelStyle = computed(() => {
  const rect = props.anchorRect;
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1200;
  const panelW = Math.min(500, Math.max(viewportW - 8, 300));

  if (!rect) {
    return { width: `${panelW}px` };
  }

  const topGap = 12;
  const edgePad = 4;
  const left = Math.min(Math.max(rect.left, edgePad), viewportW - panelW - edgePad);
  const arrowOffset = Math.min(86, Math.max(rect.width * 0.2, 54));
  const arrowLeft = Math.min(Math.max(rect.left - left + arrowOffset, 18), panelW - 18);

  return {
    top: `${rect.bottom + topGap}px`,
    left: `${left}px`,
    width: `${panelW}px`,
    "--arrow-left": `${arrowLeft}px`,
  };
});

// BE có thể trả 2 shape:
//  - Cũ: ['keyword 1', 'keyword 2', ...]
//  - Mới: [{ name: 'keyword', image: 'url' }, ...]
// Normalize về { name, image } để template render đồng nhất.
const trendingItems = computed(() =>
  searchStore.trending.map((item) =>
    typeof item === "string"
      ? { name: item, image: null }
      : { name: item?.name || item?.keyword || "", image: item?.image || null }
  )
);

const buildSearchTo = (keyword) => ({
  path: localePath("/products"),
  query: { search: keyword, sort: "newest", limit: "20" },
});

const confirmClearHistory = () => {
  toast(t('search.confirmClearHistory'), {
    cancel: { label: t('common.confirmNo'), onClick: () => {} },
    action: { label: t('common.confirmYes'), onClick: () => searchStore.clearHistory() },
  });
};

// Format VND price from raw integer
const formatPrice = (price) => {
  if (price == null) return ''
  return new Intl.NumberFormat('vi-VN').format(price)
};

const submitMobileSearch = async () => {
  const keyword = mobileSearchKeyword.value.trim();
  if (!keyword) return;
  await searchStore.saveKeyword(keyword);
  mobileSearchKeyword.value = "";
  emit("update:open", false);
  await navigateTo(buildSearchTo(keyword));
};

// Focus mobile input when sheet opens
watch([() => props.mode, () => props.open], async ([nextMode, isOpen]) => {
  if (nextMode === "mobile" && isOpen) {
    await nextTick();
    await nextTick();
    mobileSearchInputRef.value?.focus();
  }
});

// Mobile autocomplete — debounced
const mobileInputMode = computed(() =>
  mobileSearchKeyword.value.length >= 1 ? 'typing' : 'empty'
)

let _mobileSearchTimer = null
watch(mobileSearchKeyword, (query) => {
  clearTimeout(_mobileSearchTimer)
  _mobileSearchTimer = setTimeout(() => {
    if (query.length >= 1) {
      searchStore.fetchSuggestions(query)
    } else {
      searchStore.clearSuggestions()
    }
  }, 300)
})

onBeforeUnmount(() => {
  mobileSearchKeyword.value = "";
  searchStore.clearSuggestions();
  clearTimeout(_mobileSearchTimer);
});
</script>

<style scoped>
/* === Desktop Layer (Teleport to body) === */
.dropdown-search-desktop-layer {
  position: fixed;
  inset: 0;
  z-index: 1095;
  pointer-events: none;
  display: flex;
  justify-content: center;
}

.dropdown-search-desktop-panel {
  position: fixed;
  pointer-events: auto;
  min-height: 474px;
  padding: 9px 8px 12px;
  border: 1px solid rgba(17, 17, 17, 0.5);
  border-radius: 7px;
  background: #ffffff;
  color: #202124;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

.dropdown-search-desktop-panel::before {
  content: "";
  position: absolute;
  top: -10px;
  left: var(--arrow-left, 76px);
  width: 0;
  height: 0;
  transform: translateX(-50%);
  border-right: 10px solid transparent;
  border-bottom: 10px solid #ffffff;
  border-left: 10px solid transparent;
  z-index: 1;
}

/* === Header === */
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

.dropdown-search-title i { color: #d70018; font-size: 13px; }

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

.dropdown-search-clear:disabled { opacity: 0.45; cursor: default; }
.dropdown-search-clear:not(:disabled):hover { color: #d70018; }
.dropdown-search-clear i { font-size: 13px; }

/* === History === */
.dropdown-search-history { display: grid; margin-top: 2px; }

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

.dropdown-search-history-item i { color: #c7cbd1; font-size: 14px; }
.dropdown-search-history-item:hover { background: #f7f7f7; color: #222222; }

/* === Trending Title === */
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

.dropdown-search-flame { font-size: 17px; }

/* === Trending Grid === */
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

.dropdown-search-trending-item:hover { background: #f7f7f7; color: #222222; }

.dropdown-search-trending-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* === Thumbnails === */
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
.dropdown-search-thumb--macbook-pro img { object-position: left center; }

.dropdown-search-thumb--macbook-neo img,
.dropdown-search-thumb--oppo img { object-position: right center; }

.dropdown-search-thumb--ipad::before {
  content: "";
  width: 22px;
  height: 36px;
  border-radius: 4px;
  background: linear-gradient(135deg, rgba(255,255,255,.72), rgba(255,255,255,0) 36%), linear-gradient(145deg, #bff4ff 0%, #5fb8ff 38%, #1b5fba 100%);
  border: 2px solid #24364d;
  box-shadow: 4px 2px 0 rgba(0,0,0,.1);
}

.dropdown-search-thumb--watch::before {
  content: "";
  width: 31px;
  height: 31px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, #0f172a 0 46%, transparent 47%), conic-gradient(from 315deg, #111827, #5b6472, #111827);
  border: 2px solid #20242a;
  box-shadow: inset 0 0 0 2px #0b0d10, 0 -7px 0 -4px #2f343c, 0 7px 0 -4px #2f343c;
}

.dropdown-search-thumb--watch::after {
  content: "";
  position: absolute;
  width: 7px;
  height: 7px;
  border-right: 1px solid #fff;
  border-bottom: 1px solid #fff;
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

/* === Mobile Sheet === */
.dropdown-search-mobile-sheet {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 16px 28px;
  background: radial-gradient(circle at top right, rgba(17,17,17,.05), transparent 34%), linear-gradient(180deg, #fff 0%, #fafafa 100%);
}

.dropdown-search-mobile-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.dropdown-search-mobile-heading { min-width: 0; }

.dropdown-search-mobile-eyebrow {
  margin: 0 0 4px;
  color: #71717a;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .08em;
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
  background: #fff;
  color: #18181b;
  flex-shrink: 0;
}

.dropdown-search-mobile-form {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 54px;
  padding: 0 12px 0 14px;
  border: 1px solid rgba(17,17,17,.16);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 12px 24px rgba(17,17,17,.06);
}

.dropdown-search-mobile-form-icon { color: #18181b; font-size: 17px; }

.dropdown-search-mobile-input {
  min-width: 0;
  flex: 1 1 auto;
  border: 0;
  outline: 0;
  background: transparent;
  color: #18181b;
  font-size: 15px;
  font-weight: 500;
  /* Hide browser native cancel button */
  -webkit-appearance: none;
}

.dropdown-search-mobile-input::-webkit-search-decoration,
.dropdown-search-mobile-input::-webkit-search-cancel-button,
.dropdown-search-mobile-input::-webkit-search-results-button,
.dropdown-search-mobile-input::-webkit-search-results-decoration { display: none !important; }

.dropdown-search-mobile-input::placeholder { color: #a1a1aa; }

.dropdown-search-mobile-clear {
  display: inline-flex;
  align-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: #a1a1aa;
  font-size: 18px;
}

.dropdown-search-mobile-submit {
  min-width: 58px;
  height: 36px;
  padding: 0 14px;
  border: 1px solid #111;
  border-radius: 12px;
  background: #111;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.dropdown-search-mobile-hint {
  margin: -6px 0 0;
  color: #71717a;
  font-size: 12px;
  line-height: 1.55;
}

.dropdown-search-mobile-section { display: flex; flex-direction: column; gap: 12px; }

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

.dropdown-search-mobile-section-title i { color: #18181b; font-size: 14px; }

.dropdown-search-mobile-link {
  padding: 0;
  border: 0;
  background: transparent;
  color: #52525b;
  font-size: 13px;
  font-weight: 600;
}

.dropdown-search-mobile-link:disabled { opacity: .45; }

.dropdown-search-mobile-history { display: flex; flex-wrap: wrap; gap: 8px; }

.dropdown-search-mobile-history-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #e4e4e7;
  border-radius: 999px;
  background: #fff;
  color: #52525b;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
}

.dropdown-search-mobile-history-item i { color: #a1a1aa; font-size: 13px; }

.dropdown-search-mobile-empty {
  margin: 0;
  padding: 12px 14px;
  border: 1px dashed #e5e7eb;
  border-radius: 14px;
  background: #fcfcfc;
  color: #71717a;
  font-size: 13px;
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
  background: #fff;
  box-shadow: 0 10px 18px rgba(17,17,17,.04);
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

.dropdown-search-mobile-card .dropdown-search-thumb { flex: 0 0 46px; width: 46px; height: 46px; }
.dropdown-search-mobile-card .dropdown-search-thumb img { width: 42px; height: 42px; }

/* === Responsive === */
@media (max-width: 767.98px) {
  .dropdown-search-desktop-layer {
    position: static !important;
    display: block !important;
    pointer-events: auto;
    padding: 10px 10px 0;
  }

  .dropdown-search-desktop-panel {
    position: static !important;
    width: 100% !important;
    left: auto !important;
    right: auto !important;
    top: auto !important;
    min-height: auto;
    max-height: calc(100vh - 20px);
    overflow-y: auto;
    transform: none !important;
  }
  .dropdown-search-desktop-panel::before { display: none !important; }
  .dropdown-search-trending { grid-template-columns: 1fr; }
  .dropdown-search-mobile-sheet { padding-right: 14px; padding-left: 14px; }
}

@media (max-width: 380px) {
  .dropdown-search-mobile-grid { grid-template-columns: 1fr; }
}

/* ── New: section titles ── */
.dropdown-search-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-search-section-title {
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 24px;
  color: #111111;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.dropdown-search-section-title i { color: #d70018; font-size: 13px; }

/* ── New: empty state ── */
.dropdown-search-empty {
  margin: 0;
  padding: 12px 4px;
  color: #70747d;
  font-size: 13px;
}

/* ── New: suggestions (typing state) ── */
.dropdown-search-suggestions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
  padding: 1px 6px 0 8px;
}

.dropdown-search-suggestion-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  min-height: 36px;
  padding: 4px 4px;
  border-radius: 4px;
  color: #30343a;
  font-size: 14px;
  line-height: 1.2;
  text-decoration: none;
}

.dropdown-search-suggestion-item:hover { background: #f7f7f7; color: #222222; }
.dropdown-search-suggestion-item i { color: #c7cbd1; font-size: 14px; flex-shrink: 0; }
.dropdown-search-suggestion-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dropdown-search-suggestion-img {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 3px;
  flex-shrink: 0;
  border: 1px solid rgba(0,0,0,.06);
}

/* ── New: products (typing state) ── */
.dropdown-search-products {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-search-product-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 4px;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.dropdown-search-product-item:hover { background: #f7f7f7; }
.dropdown-search-product-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,.06);
  flex-shrink: 0;
}

.dropdown-search-product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.dropdown-search-product-name {
  font-size: 13px;
  font-weight: 500;
  color: #202124;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.dropdown-search-product-prices {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.dropdown-search-price-sale {
  font-size: 14px;
  font-weight: 700;
  color: #d70018;
}

.dropdown-search-price-original {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

/* ── Mobile suggestions ── */
.dropdown-search-mobile-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dropdown-search-mobile-suggestion-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #e4e4e7;
  border-radius: 999px;
  background: #fff;
  color: #52525b;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
}

.dropdown-search-mobile-suggestion-item i { color: #a1a1aa; font-size: 13px; }

/* ── Mobile product card in grid ── */
.dropdown-search-mobile-card-img {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #ececf1;
  flex-shrink: 0;
}

.dropdown-search-mobile-card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.dropdown-search-mobile-card-prices {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
}

.dropdown-search-mobile-card .dropdown-search-price-sale {
  font-size: 13px;
}

.dropdown-search-mobile-card .dropdown-search-price-original {
  font-size: 11px;
}

/* (duplicate removed) */
</style>
