<template>
  <div v-if="normalizedTabs.length" id="block-same-product" ref="rootEl" class="block-same-product">
    <div class="same-product-head">
      <h2 class="same-product-title mt-2">Có thể bạn cũng thích</h2>
    </div>

    <div class="same-product-options-list is-flex is-justify-content-space-between">
      <div class="product-options-tabs">
        <button
          v-for="tab in normalizedTabs"
          :key="tab.id"
          type="button"
          :class="['item', 'button__tab', { active: activeTab === tab.id }]"
          @click="setActiveTab(tab.id)"
        >
          <p>{{ tab.label }}</p>
        </button>
      </div>
    </div>

    <div class="product-list-swiper">
      <div
        v-if="isSwiperMounted"
        :key="swiperKey"
        :class="{ 'swiper--ready': isSwiperReady }"
        class="swiper same-product-swiper"
      >
        <div class="swiper-wrapper">
          <div
            v-for="item in activeItems"
            :key="`${activeTab}-${item.id}`"
            class="swiper-slide"
          >
            <HomeProdCard :product="mapCardProduct(item)" />
          </div>
        </div>

        <div
          class="swiper-button-prev button-navigate-thumbnail__prev"
          tabindex="0"
          role="button"
          aria-label="Previous slide"
          aria-disabled="false"
        >
          <div class="icon">
            <svg
              height="15"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              aria-hidden="true"
            >
              <path
                d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"
              ></path>
            </svg>
          </div>
        </div>
        <div
          class="swiper-button-next button-navigate-thumbnail__next"
          tabindex="0"
          role="button"
          aria-label="Next slide"
          aria-disabled="false"
        >
          <div class="icon">
            <svg
              height="15"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              aria-hidden="true"
            >
              <path
                d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import "swiper/css";
import "swiper/css/navigation";
import { useProductStore } from "@/stores/productStore";
import HomeProdCard from "@/components/Home/HomeProdCard.vue";

const productStore = useProductStore();
const { productSameProducts } = storeToRefs(productStore);

const TAB_LABELS = {
  similar: "Sản phẩm tương tự",
  used: "Tham khảo hàng cũ",
};

const rootEl = ref(null);
const activeTab = ref("");
const isSwiperMounted = ref(false);
const isSwiperReady = ref(false);
const swiperKey = ref(0);
let swiperInstance = null;

const normalizedTabs = computed(() =>
  (productSameProducts.value?.tabs || [])
    .filter((tab) => Array.isArray(tab?.items) && tab.items.length)
    .map((tab) => ({
      ...tab,
      label: TAB_LABELS[tab.id] || tab.id,
    }))
    .filter((tab) => Boolean(TAB_LABELS[tab.id])),
);

const activeItems = computed(() => {
  const currentTab =
    normalizedTabs.value.find((tab) => tab.id === activeTab.value) ??
    normalizedTabs.value[0];
  return currentTab?.items ?? [];
});

const parseMoney = (value) => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return 0;
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
};

const mapCardProduct = (item) => ({
  name: item?.name || "",
  img: item?.image || "",
  price: parseMoney(item?.price),
  originalPrice: parseMoney(item?.oldPrice),
  discount: Number(String(item?.discountPercent || "").replace(/[^\d]/g, "")) || 0,
  badge: Boolean(item?.discountPercent),
  installmentText: item?.installment || "",
  gifts: item?.promotion ? [item.promotion] : [],
  rating: Number(item?.rating) || 0,
  slug: typeof item?.href === "string" && item.href.startsWith("/products/")
    ? item.href.replace(/^\/products\//, "")
    : "",
  url: item?.href || "/",
});

const destroySwiper = () => {
  if (swiperInstance && !swiperInstance.destroyed) {
    swiperInstance.destroy(true, true);
  }
  swiperInstance = null;
};

const initSwiper = async () => {
  if (!import.meta.client || !rootEl.value || !normalizedTabs.value.length) return;

  const swiperEl = rootEl.value.querySelector(".same-product-swiper");
  if (!swiperEl) return;

  destroySwiper();

  const { default: Swiper } = await import("swiper");
  const { Navigation } = await import("swiper/modules");

  swiperInstance = new Swiper(swiperEl, {
    modules: [Navigation],
    slidesPerView: 1.15,
    spaceBetween: 12,
    navigation: {
      nextEl: swiperEl.querySelector(".button-navigate-thumbnail__next"),
      prevEl: swiperEl.querySelector(".button-navigate-thumbnail__prev"),
    },
    observer: true,
    observeParents: true,
    breakpoints: {
      576: {
        slidesPerView: 2.2,
        spaceBetween: 12,
      },
      768: {
        slidesPerView: 3.2,
        spaceBetween: 12,
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 10,
      },
    },
  });
};

const setActiveTab = async (tabId) => {
  if (activeTab.value === tabId) return;

  activeTab.value = tabId;
  isSwiperReady.value = false;
  swiperKey.value += 1;
  await nextTick();
  await initSwiper();
  isSwiperReady.value = true;
};

watch(
  normalizedTabs,
  async (tabs) => {
    if (!tabs.length) {
      activeTab.value = "";
      isSwiperReady.value = false;
      destroySwiper();
      return;
    }

    if (!tabs.some((tab) => tab.id === activeTab.value)) {
      activeTab.value = tabs[0].id;
    }

    if (!isSwiperMounted.value) return;

    isSwiperReady.value = false;
    swiperKey.value += 1;
    await nextTick();
    await initSwiper();
    isSwiperReady.value = true;
  },
  { immediate: true },
);

onMounted(async () => {
  isSwiperMounted.value = true;
  if (!normalizedTabs.value.length) return;
  await nextTick();
  await initSwiper();
  isSwiperReady.value = true;
});

onBeforeUnmount(() => {
  isSwiperReady.value = false;
  destroySwiper();
});
</script>

<style scoped>
.block-same-product {
  margin-top: 20px;
  width: 100%;
}

.same-product-head {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.same-product-title {
  color: #18181b;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.same-product-options-list {
  align-items: center;
  margin: 10px auto 14px;
}

.is-flex {
  display: flex !important;
}

.is-justify-content-space-between {
  justify-content: space-between !important;
}

.is-justify-content-center {
  justify-content: center !important;
}

.is-align-items-center {
  align-items: center !important;
}

.product-options-tabs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
}

.product-options-tabs::-webkit-scrollbar {
  display: none;
}

.product-options-tabs .item {
  background: transparent;
  border: none;
  border-bottom: 1px solid transparent;
  color: #71717a;
  cursor: pointer;
  flex: 0 0 155px;
  font-size: 14px;
  font-weight: 400;
  max-height: 30px;
  padding: 5px 0;
  text-align: center;
  transition:
    border 0.3s ease,
    color 0.3s ease;
}

.product-options-tabs .item p {
  margin: 0;
}

.product-options-tabs .item.active {
  border-bottom-color: #d70018;
  color: #d70018;
  font-weight: 600;
}

.product-list-swiper {
  margin: -12px;
  padding: 12px;
  position: relative;
}

.same-product-swiper {
  overflow: hidden;
  padding: 12px 0 18px;
  position: relative;
}

.same-product-swiper:not(.swiper--ready) {
  visibility: hidden;
}

.same-product-swiper .swiper-slide {
  box-sizing: border-box;
  height: auto;
  max-width: calc(20% - 8px);
}
.same-product-swiper :deep(.swiper-button-next),
.same-product-swiper :deep(.swiper-button-prev) {
  align-items: center;
  background: #fff;
  border-radius: 999px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  display: flex;
  height: 40px;
  justify-content: center;
  margin-top: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
}

.same-product-swiper :deep(.swiper-button-prev) {
  left: 2px;
}

.same-product-swiper :deep(.swiper-button-next) {
  right: 2px;
}

.same-product-swiper :deep(.swiper-button-next:after),
.same-product-swiper :deep(.swiper-button-prev:after),
.same-product-swiper :deep(.swiper-button-disabled) {
  display: none;
}

.same-product-swiper :deep(.swiper-button-next .icon),
.same-product-swiper :deep(.swiper-button-prev .icon) {
  align-items: center;
  display: flex;
  height: 15px;
  justify-content: center;
  width: 15px;
}

.same-product-swiper :deep(.swiper-button-next .icon svg),
.same-product-swiper :deep(.swiper-button-prev .icon svg) {
  fill: #707070;
}

@media only screen and (max-width: 1199px) {
  .same-product-swiper .swiper-slide {
    max-width: none;
  }
}

@media only screen and (max-width: 767px) {
  .block-same-product {
    margin-top: 16px;
  }

  .product-list-swiper {
    margin: -8px;
    padding: 8px;
  }

  .same-product-title {
    font-size: 18px;
  }

  .product-options-tabs {
    gap: 8px;
  }

  .product-options-tabs .item {
    flex-basis: 132px;
    font-size: 13px;
  }

  .product-info {
    padding: 14px;
  }

  .product__image {
    min-height: 108px;
  }

  .product__img {
    height: 96px;
    width: 96px;
  }

  .product__price--show {
    font-size: 18px;
  }

  .same-product-swiper :deep(.swiper-button-next),
  .same-product-swiper :deep(.swiper-button-prev) {
    height: 34px;
    width: 34px;
  }
}
</style>
