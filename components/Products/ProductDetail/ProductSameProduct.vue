<template>
  <div id="block-same-product" ref="rootEl" class="block-same-product">
    <div class="same-product-head">
      <h2 class="same-product-title mt-2">{{ title }}</h2>
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
            <div
              :class="[ 'product-info-container', { 'more-trade-product': item.variant === 'trade-placeholder' }, ]"
            >
              <div class="product-info">
                <a
                  :href="item.href || '#'"
                  class="product__link button__link"
                  :target="item.external ? '_blank' : undefined"
                  :rel="item.external ? 'noopener noreferrer' : undefined"
                >
                  <div class="product__image">
                    <img
                      :src="item.image"
                      :alt="item.name"
                      width="358"
                      height="358"
                      class="product__img"
                    />
                  </div>

                  <div class="product__name">
                    <h3>{{ item.name }}</h3>
                  </div>

                  <p v-if="item.variant === 'trade'" class="trade--price">
                    Giá thu đến: <strong>{{ item.tradePrice }}</strong>
                  </p>

                  <template v-else-if="item.variant === 'trade-placeholder'">
                    <p class="trade-placeholder-copy">Thu cũ đổi mới</p>
                  </template>

                  <template v-else>
                    <div class="block-box-price">
                      <div class="box-info__box-price">
                        <p class="product__price--show">{{ item.price }}</p>
                        <p
                          v-if="item.oldPrice"
                          class="product__price--through"
                        >
                          {{ item.oldPrice }}
                        </p>
                        <div
                          v-if="item.discountPercent"
                          class="product__price--percent"
                        >
                          <p class="product__price--percent-detail">
                            Giảm <span>{{ item.discountPercent }}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      v-if="item.promotion"
                      class="product__promotions"
                    >
                      <div class="promotion">
                        <p class="gift-cont">{{ item.promotion }}</p>
                      </div>
                    </div>
                  </template>
                </a>

                <a
                  v-if="item.ctaLabel"
                  :href="item.ctaHref || item.href || '#'"
                  class="exchange button__compare is-flex is-justify-content-center is-align-items-center"
                  :target="item.external ? '_blank' : undefined"
                  :rel="item.external ? 'noopener noreferrer' : undefined"
                >
                  {{ item.ctaLabel }}
                </a>
              </div>

              <div
                v-if="item.variant === 'product' || item.variant === 'used'"
                class="bottom-div"
              >
                <div
                  v-if="item.rating"
                  class="product__box-rating"
                >
                  <span class="icon-star is-active">
                    <svg
                      height="15"
                      viewBox="0 0 576 512"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M381.2 150.3 524.9 171.5c11.9 1.7 21.9 10.1 25.7 21.6 3.8 11.6.7 24.2-7.9 32.8L438.5 328.1l24.6 146.6c2 12-3 24.2-13 31.3-9.9 7.1-23 8-33.7 2.3l-128.3-68.5-128.3 68.5c-10.8 5.7-23.9 4.8-33.8-2.3-9.9-7.1-14.9-19.3-12.8-31.3l24.6-146.6L33.6 225.9c-8.6-8.6-11.7-21.2-7.9-32.8 3.8-11.5 13.8-19.9 25.7-21.6L195 150.3 259.4 18c5.3-11 16.5-18 28.7-18s23.4 7 28.8 18l64.3 132.3Z"
                      />
                    </svg>
                  </span>
                  {{ item.rating }}
                </div>

                <div
                  v-if="item.installment"
                  class="install-0-tag"
                >
                  <span>Trả góp <strong>{{ item.installment }}</strong></span>
                </div>
              </div>
            </div>
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
import "swiper/css";
import "swiper/css/navigation";

const defaultTabs = [
  {
    id: "trade-in",
    label: "Thu cũ đổi mới",
    items: [
      {
        id: 1,
        variant: "trade",
        name: "iPhone 13 128GB | Chính hãng VN/A",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13_2_2.jpg",
        tradePrice: "5.197.500đ",
        href: "https://cellphones.com.vn/iphone-13.html",
        ctaHref: "https://cellphones.com.vn/thu-cu-doi-moi?exchange=36242-31495",
        ctaLabel: "Lên đời ngay",
        external: true,
      },
      {
        id: 2,
        variant: "trade",
        name: "iPhone 12 64GB | Chính hãng VN/A",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12.png",
        tradePrice: "4.147.500đ",
        href: "https://cellphones.com.vn/iphone-12.html",
        ctaHref: "https://cellphones.com.vn/thu-cu-doi-moi?exchange=24746-31495",
        ctaLabel: "Lên đời ngay",
        external: true,
      },
      {
        id: 3,
        variant: "trade",
        name: "iPhone 12 128GB | Chính hãng VN/A",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-128gb_2.png",
        tradePrice: "4.672.500đ",
        href: "https://cellphones.com.vn/iphone-12-128gb.html",
        ctaHref: "https://cellphones.com.vn/thu-cu-doi-moi?exchange=27451-31495",
        ctaLabel: "Lên đời ngay",
        external: true,
      },
      {
        id: 4,
        variant: "trade",
        name: "iPhone SE 2022 | Chính hãng VN/A",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/_/1_359_1.png",
        tradePrice: "2.257.500đ",
        href: "https://cellphones.com.vn/iphone-se-2022.html",
        ctaHref: "https://cellphones.com.vn/thu-cu-doi-moi?exchange=31075-31495",
        ctaLabel: "Lên đời ngay",
        external: true,
      },
      {
        id: 5,
        variant: "trade",
        name: "iPhone 11 256GB | Chính hãng VN/A",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/_/1_253_2.jpg",
        tradePrice: "4.462.500đ",
        href: "https://cellphones.com.vn/iphone-11-256gb.html",
        ctaHref: "https://cellphones.com.vn/thu-cu-doi-moi?exchange=18395-31495",
        ctaLabel: "Lên đời ngay",
        external: true,
      },
      {
        id: 6,
        variant: "trade",
        name: "iPhone 13 512GB | Chính hãng VN/A",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-02_4.jpg",
        tradePrice: "6.457.500đ",
        href: "https://cellphones.com.vn/iphone-13-512gb.html",
        ctaHref: "https://cellphones.com.vn/thu-cu-doi-moi?exchange=36486-31495",
        ctaLabel: "Lên đời ngay",
        external: true,
      },
      {
        id: 7,
        variant: "trade-placeholder",
        name: "Chọn sản phẩm khác",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:69:69/q:90/plain/https://cellphones.com.vn/media/cps-images/trade-placeholder.png",
        ctaHref: "https://cellphones.com.vn/thu-cu-doi-moi?id=31495",
        ctaLabel: "Chọn sản phẩm khác",
        external: true,
      },
    ],
  },
  {
    id: "similar",
    label: "Sản phẩm tương tự",
    items: [
      {
        id: 11,
        variant: "product",
        name: "iPhone 16e 256GB | Chính hãng VN/A",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16e-256gb.png",
        href: "https://cellphones.com.vn/iphone-16e-256gb.html",
        price: "14.490.000đ",
        oldPrice: "19.990.000đ",
        discountPercent: "28%",
        promotion: "Ưu đãi iPhone 16e chỉ từ 12.49 triệu khi mua kèm sim Viettel 5G",
        rating: "5",
        installment: "0%",
        external: true,
      },
      {
        id: 12,
        variant: "product",
        name: "iPhone 16e 128GB | Chính hãng VN/A",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16e.png",
        href: "https://cellphones.com.vn/iphone-16e.html",
        price: "12.990.000đ",
        oldPrice: "16.990.000đ",
        discountPercent: "24%",
        promotion: "Thu cũ đổi mới trợ giá đến 2 triệu, áp dụng số lượng có hạn",
        rating: "4.9",
        installment: "0%",
        external: true,
      },
      {
        id: 13,
        variant: "product",
        name: "iPhone 15 128GB | Chính hãng VN/A",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-128gb.png",
        href: "https://cellphones.com.vn/iphone-15.html",
        price: "16.990.000đ",
        oldPrice: "22.990.000đ",
        discountPercent: "26%",
        promotion: "Tặng gói bảo hành rơi vỡ 6 tháng khi đặt online",
        rating: "4.8",
        installment: "0%",
        external: true,
      },
      {
        id: 14,
        variant: "product",
        name: "iPhone 15 Plus 128GB | Chính hãng VN/A",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus_1__4.png",
        href: "https://cellphones.com.vn/iphone-15-plus.html",
        price: "19.490.000đ",
        oldPrice: "25.990.000đ",
        discountPercent: "25%",
        promotion: "Giảm thêm 500.000đ khi thanh toán qua thẻ tín dụng đối tác",
        rating: "4.7",
        installment: "0%",
        external: true,
      },
      {
        id: 15,
        variant: "product",
        name: "iPhone 14 128GB | Chính hãng VN/A",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/p/h/photo_2022-09-28_21-58-48_1.jpg",
        href: "https://cellphones.com.vn/iphone-14.html",
        price: "13.990.000đ",
        oldPrice: "14.990.000đ",
        discountPercent: "7%",
        promotion: "Thu cũ trợ giá đến 3 triệu, hỗ trợ trả góp 0%",
        rating: "4.8",
        installment: "0%",
        external: true,
      },
      {
        id: 16,
        variant: "product",
        name: "iPhone 13 256GB | Chính hãng VN/A",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/1/11_3_12_2_1_6.jpg",
        href: "https://cellphones.com.vn/iphone-13-256gb.html",
        price: "15.290.000đ",
        oldPrice: "18.990.000đ",
        discountPercent: "19%",
        promotion: "Tặng voucher phụ kiện 500.000đ khi mua online",
        rating: "5",
        installment: "0%",
        external: true,
      },
    ],
  },
  {
    id: "used",
    label: "Tham khảo hàng cũ",
    items: [
      {
        id: 21,
        variant: "used",
        name: "iPhone 14 Pro Max 128GB - Cũ Đẹp",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_m_18_1_3_2.png",
        href: "https://cellphones.com.vn/iphone-14-pro-max-cu-dep.html",
        price: "17.990.000đ",
        oldPrice: "29.990.000đ",
        discountPercent: "40%",
        promotion: "Phụ kiện ốp dán mua kèm máy giảm thêm đến 15%",
        rating: "5",
        installment: "0%",
        external: true,
      },
      {
        id: 22,
        variant: "used",
        name: "iPhone 14 Pro Max 256GB - Cũ Đẹp",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/v/_/v_ng_20_2_1_2_1.png",
        href: "https://cellphones.com.vn/iphone-14-pro-max-256gb-cu-dep.html",
        price: "19.990.000đ",
        oldPrice: "32.990.000đ",
        discountPercent: "39%",
        promotion: "Trả góp 0% lãi suất, tối đa 9 tháng qua đối tác tài chính",
        rating: "4.8",
        installment: "0%",
        external: true,
      },
      {
        id: 23,
        variant: "used",
        name: "iPhone 14 Plus 128GB - Cũ Đẹp",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/p/h/photo_2022-09-28_21-58-51_4_1_2_2.jpg",
        href: "https://cellphones.com.vn/iphone-14-plus-cu-dep.html",
        price: "12.590.000đ",
        oldPrice: "19.990.000đ",
        discountPercent: "37%",
        promotion: "Trả góp 0% lãi suất, tối đa 9 tháng qua đối tác tài chính",
        rating: "4.5",
        installment: "0%",
        external: true,
      },
      {
        id: 24,
        variant: "used",
        name: "iPhone 14 Pro Max 128GB - Cũ Trầy Xước",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_m_18_1_3_2_1.png",
        href: "https://cellphones.com.vn/iphone-14-pro-max-cu-tray-xuoc.html",
        price: "16.990.000đ",
        oldPrice: "29.990.000đ",
        discountPercent: "43%",
        promotion: "Phụ kiện ốp dán mua kèm máy giảm thêm đến 15%",
        rating: "5",
        installment: "0%",
        external: true,
      },
      {
        id: 25,
        variant: "used",
        name: "iPhone 14 Pro 128GB - Cũ Đẹp",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_m_12_1_3_2.png",
        href: "https://cellphones.com.vn/iphone-14-pro-cu-dep.html",
        price: "16.190.000đ",
        oldPrice: "27.990.000đ",
        discountPercent: "42%",
        promotion: "Trả góp 0% lãi suất, tối đa 9 tháng qua đối tác tài chính",
        rating: "5",
        installment: "0%",
        external: true,
      },
      {
        id: 26,
        variant: "used",
        name: "iPhone 14 Pro 256GB - Cũ Đẹp",
        image:
          "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/_/t_m_13_1_2.png",
        href: "https://cellphones.com.vn/iphone-14-pro-256gb-cu-dep.html",
        price: "17.190.000đ",
        oldPrice: "29.990.000đ",
        discountPercent: "43%",
        promotion: "Trả góp 0% lãi suất, tối đa 9 tháng qua đối tác tài chính",
        rating: "4.3",
        installment: "0%",
        external: true,
      },
    ],
  },
];

const props = defineProps({
  title: {
    type: String,
    default: "Có thể bạn cũng thích",
  },
  tabs: {
    type: Array,
    default: () => [],
  },
});

const rootEl = ref(null);
const activeTab = ref("");
const isSwiperMounted = ref(false);
const isSwiperReady = ref(false);
const swiperKey = ref(0);
let swiperInstance = null;

const normalizedTabs = computed(() =>
  props.tabs?.length ? props.tabs : defaultTabs,
);

const activeItems = computed(() => {
  const currentTab =
    normalizedTabs.value.find((tab) => tab.id === activeTab.value) ??
    normalizedTabs.value[0];
  return currentTab?.items ?? [];
});

const destroySwiper = () => {
  if (swiperInstance && !swiperInstance.destroyed) {
    swiperInstance.destroy(true, true);
  }
  swiperInstance = null;
};

const initSwiper = async () => {
  if (!import.meta.client || !rootEl.value) return;

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
  (tabs) => {
    if (!tabs.length) {
      activeTab.value = "";
      return;
    }

    if (!tabs.some((tab) => tab.id === activeTab.value)) {
      activeTab.value = tabs[0].id;
    }
  },
  { immediate: true },
);

onMounted(async () => {
  isSwiperMounted.value = true;
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
  border-radius: 15px;
  box-shadow:
    0 4px 20px -8px rgba(0, 0, 0, 0.11),
    0 0 10px 0 rgba(0, 0, 0, 0.059);
  box-sizing: border-box;
  height: auto;
  max-width: calc(20% - 8px);
}

.product-info-container {
  background: #fff;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100%;
}

.product-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
}

.product__link {
  color: inherit;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  text-decoration: none;
}

.product__image {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 132px;
}

.product__img {
  display: block;
  height: 120px;
  object-fit: contain;
  width: 120px;
}

.product__name h3 {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #18181b;
  display: -webkit-box;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
  margin: 0;
  min-height: 40px;
  overflow: hidden;
}

.trade--price,
.trade-placeholder-copy {
  color: #52525b;
  font-size: 14px;
  line-height: 1.45;
  margin: 0;
}

.trade--price strong {
  color: #d70018;
  font-size: 16px;
}

.block-box-price {
  margin-top: auto;
}

.box-info__box-price {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product__price--show {
  color: #d70018;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

.product__price--through {
  color: #71717a;
  font-size: 14px;
  margin: 0;
  text-decoration: line-through;
}

.product__price--percent {
  align-items: center;
  display: inline-flex;
  width: fit-content;
}

.product__price--percent-detail {
  background: #fff1f2;
  border-radius: 999px;
  color: #d70018;
  font-size: 12px;
  font-weight: 600;
  margin: 0;
  padding: 4px 8px;
}

.product__promotions {
  background: #f8fafc;
  border-radius: 10px;
  padding: 10px;
}

.gift-cont {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #3f3f46;
  display: -webkit-box;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
  overflow: hidden;
}

.exchange {
  align-items: center;
  background: #fff5f5;
  border: 1px solid #fca5a5;
  border-radius: 12px;
  color: #d70018;
  display: inline-flex;
  font-size: 14px;
  font-weight: 600;
  min-height: 40px;
  padding: 10px 12px;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.exchange:hover {
  background: #fee2e2;
  border-color: #f87171;
}

.more-trade-product {
  justify-content: center;
}

.more-trade-product .product-info {
  justify-content: center;
}

.more-trade-product .product__image {
  min-height: 100px;
}

.more-trade-product .product__img {
  height: 69px;
  width: 69px;
}

.bottom-div {
  align-items: center;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  padding: 0 16px 16px;
}

.product__box-rating {
  align-items: center;
  color: #18181b;
  display: inline-flex;
  font-size: 13px;
  font-weight: 600;
  gap: 4px;
}

.icon-star svg {
  fill: #f59e0b;
}

.install-0-tag span {
  background: #eff6ff;
  border-radius: 999px;
  color: #2563eb;
  display: inline-flex;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
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
