<template>
  <div ref="rootEl" class="product-suggest">
    <section v-if="comboDeals.length" id="comboBlock" class="combo-block">
      <div class="combov2 my-3">
        <div class="combov2__wrapper list-option">
          <div class="list-option__head">
            <div class="option__title">
              <div class="icon-fire">
                <img src="https://cdn2.cellphones.com.vn/x/media/wysiwyg/fire-icon-2025.gif" alt="Lửa bập bùng" />
              </div>
              <span>{{ $t('product.comboPriceLabel') }}</span>
            </div>
            <div class="option__action">
              <button type="button">
                {{ $t('product.seeAll') }}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div class="list-option__body list-option__body--combo">
            <div v-if="isSwiperMounted" :class="{ 'swiper--ready': isSwiperReady }" class="swiper combo-swiper">
              <div class="swiper-wrapper">
                <article v-for="(slideItems, slideIndex) in comboSlides" :key="`combo-slide-${slideIndex}`"
                  class="swiper-slide suggest-slide">
                  <div class="suggest-slide__column">
                    <div v-for="item in slideItems" :key="item.title" class="list-option__item">
                      <div class="item-wrapper">
                        <div class="image">
                          <img :src="item.image" :alt="item.title" />
                        </div>

                        <div class="info">
                          <a v-if="item.link" :href="item.link" class="info__name">
                            {{ item.title }}
                          </a>
                          <p v-else class="info__name">
                            {{ item.title }}
                          </p>

                          <div class="item-action">
                            <div v-if="item.price && (item.price.value > 0 || !item.price.value && item.price)"
                              class="block-box-price">
                              <div class="box-info__box-price">
                                <p class="product__price--show">{{ item.price?.formatted || item.price }}</p>
                                <p v-if="item.oldPrice && (item.oldPrice.value > 0 || !item.oldPrice.value && item.oldPrice)"
                                  class="product__price--through">
                                  {{ item.oldPrice?.formatted || item.oldPrice }}
                                </p>
                              </div>
                            </div>

                            <p v-else class="info__percent">{{ item.badge }}</p>

                            <button type="button" class="button button-select">
                              <span>{{ $t('common.comboSelect') }}</span>
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3.33325V12.6666" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round"
                                  stroke-linejoin="round" />
                                <path d="M3.3335 8H12.6668" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round"
                                  stroke-linejoin="round" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <div class="swiper-pagination"></div>

              <div class="swiper-button-next button-navigate-thumbnail__next" tabindex="0" role="button"
                aria-label="Next slide" aria-disabled="false">
                <div class="icon">
                  <ArrowIcon direction="right" />
                </div>
              </div>
              <div class="swiper-button-prev button-navigate-thumbnail__prev" tabindex="0" role="button"
                aria-label="Previous slide" aria-disabled="false">
                <div class="icon">
                  <ArrowIcon direction="left" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="accessoryDeals.length" id="boxUpsell" class="my-3">
      <p class="upsell-title">{{ $t('cart.comboAccessory') }}</p>
      <div class="upsell-block-product">
        <div v-if="isSwiperMounted" :class="{ 'swiper--ready': isSwiperReady }" class="swiper accessory-swiper">
          <div class="swiper-wrapper">
            <article v-for="(slideItems, slideIndex) in accessorySlides" :key="`accessory-slide-${slideIndex}`"
              class="swiper-slide suggest-slide">
              <div class="suggest-slide__column">
                <div v-for="item in slideItems" :key="item.title" class="upsell-item">
                  <div class="upsell-item-wrapper">
                    <img :src="item.image" :alt="item.title" class="upsell-item-image" />

                    <div class="upsell-item-info">
                      <div class="upsell-item-text">
                        <a v-if="item.link" :href="item.link">
                          <p class="upsell-item-name">{{ item.title }}</p>
                        </a>
                        <p v-else class="upsell-item-name">{{ item.title }}</p>
                        <p class="upsell-item-member" v-if="item.memberDiscount">
                          Smember giảm thêm đến
                          <span>{{ item.memberDiscount?.formatted || item.memberDiscount }}</span>
                        </p>
                      </div>

                      <div class="item-action">
                        <div class="block-box-price"
                          v-if="item.price && (item.price.value > 0 || !item.price.value && item.price)">
                          <div class="box-info__box-price">
                            <p class="product__price--show">{{ item.price?.formatted || item.price }}</p>
                            <p class="product__price--through"
                              v-if="item.oldPrice && (item.oldPrice.value > 0 || !item.oldPrice.value && item.oldPrice)">
                              {{ item.oldPrice?.formatted || item.oldPrice }}
                            </p>
                          </div>
                        </div>

                        <button type="button" class="button button-add-cart" :disabled="cartBusy" @click="handleAccessoryAdd(item)">
                          <span>{{ $t('product.addToCart') }}</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 3.33325V12.6666" stroke="#D70018" stroke-width="1.5" stroke-linecap="round"
                              stroke-linejoin="round" />
                            <path d="M3.3335 8H12.6668" stroke="#D70018" stroke-width="1.5" stroke-linecap="round"
                              stroke-linejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div class="swiper-pagination"></div>

          <div class="swiper-button-next button-navigate-thumbnail__next" tabindex="0" role="button"
            aria-label="Next slide" aria-disabled="false">
            <div class="icon">
              <ArrowIcon direction="right" />
            </div>
          </div>
          <div class="swiper-button-prev button-navigate-thumbnail__prev" tabindex="0" role="button"
            aria-label="Previous slide" aria-disabled="false">
            <div class="icon">
              <ArrowIcon direction="left" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, computed, watch } from "vue";
import { useProductStore } from "@/stores/productStore";
import { useCartActions } from "@/composables/useCartActions";
import ArrowIcon from "@/components/Icons/ArrowIcon.vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const productStore = useProductStore();
const { cartBusy, addProductToCart } = useCartActions();

const rootEl = ref(null);
const isSwiperMounted = ref(false);
const isSwiperReady = ref(false);
let comboSwiper = null;
let accessorySwiper = null;

const chunkItems = (items, size = 2) => {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

const comboDeals = computed(() => productStore.productSuggestions?.comboDeals || []);
const accessoryDeals = computed(() => productStore.productSuggestions?.accessoryDeals || []);

const comboSlides = computed(() => chunkItems(comboDeals.value, 2));
const accessorySlides = computed(() => chunkItems(accessoryDeals.value, 2));

const handleAccessoryAdd = async (item) => {
  if (!item?.id) return;

  await addProductToCart(item);
};

const destroySwiper = (instance) => {
  if (instance && !instance.destroyed) {
    instance.destroy(true, true);
  }
};

const createProductSwiper = (selector) => {
  const el = rootEl.value?.querySelector(selector);
  if (!el) return null;

  return import("swiper").then(async ({ default: Swiper }) => {
    const { Navigation, Pagination } = await import("swiper/modules");

    return new Swiper(el, {
      modules: [Navigation, Pagination],
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 12,
      navigation: {
        nextEl: el.querySelector(".swiper-button-next"),
        prevEl: el.querySelector(".swiper-button-prev"),
      },
      pagination: {
        el: el.querySelector(".swiper-pagination"),
        clickable: true,
      },
      observer: true,
      observeParents: true,
      breakpoints: {
        0: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 10,
        },
        576: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 12,
        },
      },
    });
  });
};

const initSwipers = async () => {
  if (!import.meta.client || !rootEl.value) return;

  destroySwiper(comboSwiper);
  destroySwiper(accessorySwiper);

  comboSwiper = await createProductSwiper(".combo-swiper");
  accessorySwiper = await createProductSwiper(".accessory-swiper");
};

onMounted(async () => {
  isSwiperMounted.value = true;
  await nextTick();
  if (comboDeals.value.length || accessoryDeals.value.length) {
    await initSwipers();
    isSwiperReady.value = true;
  }
});

watch(() => productStore.productSuggestions, async (newVal) => {
  if (newVal && (comboDeals.value.length || accessoryDeals.value.length)) {
    isSwiperMounted.value = false;
    isSwiperReady.value = false;
    await nextTick();
    isSwiperMounted.value = true;
    await nextTick();
    await initSwipers();
    isSwiperReady.value = true;
  }
}, { deep: true });

onBeforeUnmount(() => {
  isSwiperReady.value = false;
  destroySwiper(comboSwiper);
  destroySwiper(accessorySwiper);
});
</script>

<style scoped>
.product-suggest {
  --suggest-card-gap: 12px;
  --suggest-row-gap: 12px;
  --combo-card-height: 132px;
  --accessory-card-height: 132px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.combov2 {
  color: #444;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  width: 100%;
}

.combov2__wrapper,
.upsell-block-product {
  width: 100%;
}

.list-option {
  overflow: hidden;
}

.list-option__head {
  align-items: center;
  background-clip: padding-box, border-box;
  background-image:
    linear-gradient(90deg, #fff7d5, #fffdf1),
    linear-gradient(90deg, #ffe48a, #fff2b8);
  background-origin: border-box;
  border: 1px solid transparent;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 12px 16px;
}

.option__title {
  align-items: center;
  color: #1d1d20;
  display: flex;
  font-size: 18px;
  font-weight: 700;
  gap: 8px;
}

.icon-fire {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.icon-fire img {
  height: 100%;
  object-fit: contain;
  width: 100%;
}

.option__action button {
  align-items: center;
  background: transparent;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  padding: 0;
}

.list-option__body--combo,
#boxUpsell {
  background: #fff;
  border-radius: 16px;
  position: relative;
}

#boxUpsell {
  background: #f7f7f8;
  padding: 16px 12px 12px;
}

.upsell-title {
  color: #18181b;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
}

.combo-swiper,
.accessory-swiper {
  overflow: hidden;
  padding-bottom: 30px;
  position: relative;
}

.combo-swiper:not(.swiper--ready),
.accessory-swiper:not(.swiper--ready) {
  visibility: hidden;
}

.suggest-slide {
  box-sizing: border-box;
  height: auto;
}

.suggest-slide__column {
  display: flex;
  flex-direction: column;
  gap: var(--suggest-row-gap);
}

.list-option__item,
.upsell-item {
  min-width: 0;
}

.list-option__item {
  overflow: hidden;
}

.item-wrapper,
.upsell-item-wrapper {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-sizing: border-box;
  display: flex;
  gap: var(--suggest-card-gap);
  overflow: hidden;
  padding: 12px;
}

.item-wrapper {
  align-items: flex-start;
  min-height: var(--combo-card-height);
  max-width: 100%;
  width: 108%;
}

.upsell-item-wrapper {
  min-height: var(--accessory-card-height);
  width: 100%;
}

.image {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  width: 72px;
}

.image img {
  display: block;
  max-width: 64px;
  width: 100%;
}

.upsell-item-image {
  align-self: flex-start;
  aspect-ratio: 1;
  border-radius: 10px;
  display: block;
  flex-shrink: 0;
  height: 64px;
  object-fit: cover;
  width: 64px;
}

.info,
.upsell-item-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  justify-content: space-between;
  min-width: 0;
}

.info {
  padding-top: 2px;
}

.info__name,
.upsell-item-text a {
  color: inherit;
  text-decoration: none;
}

.info__name,
.upsell-item-name {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #18181b;
  display: -webkit-box;
  font-weight: 600;
  line-clamp: 2;
  overflow: hidden;
}

.info__name {
  font-size: 14px;
  line-height: 1.35;
  min-height: 38px;
}

.upsell-item-name {
  font-size: 13px;
  line-height: 1.35;
  margin: 0 0 6px;
  min-height: 34px;
}

.upsell-item-member,
.info__percent {
  color: #d70018;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
  margin: 0;
}

.upsell-item-member {
  color: #52525b;
  font-size: 12px;
  font-weight: 400;
}

.upsell-item-member span {
  color: #d70018;
  font-weight: 700;
}

.item-action {
  align-items: flex-end;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  min-height: 42px;
}

.block-box-price,
.info__percent {
  flex: 1;
  min-width: 0;
}

.info__percent {
  overflow: hidden;
  text-overflow: ellipsis;
}

.box-info__box-price {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product__price--show {
  color: #d70018;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
}

.product__price--through {
  color: #71717a;
  font-size: 12px;
  line-height: 1.2;
  margin: 0;
  text-decoration: line-through;
}

.button {
  align-items: center;
  background: #fff;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 600;
  gap: 4px;
  justify-content: center;
  line-height: 1;
  padding: 8px 5px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
  white-space: nowrap;
}

.button-select {
  border: 1px solid #d8e7ff;
  color: #3b82f6;
  min-width: 96px;
  padding-left: 10px;
  padding-right: 10px;
}

.button-select:hover {
  background: #eff6ff;
}

.button-add-cart {
  border: 1px solid #fecaca;
  color: #d70018;
}

.button-add-cart:hover {
  background: #fff1f2;
}

.combo-swiper :deep(.swiper-pagination),
.accessory-swiper :deep(.swiper-pagination) {
  bottom: 4px;
}

.combo-swiper :deep(.swiper-pagination-bullet),
.accessory-swiper :deep(.swiper-pagination-bullet) {
  background: #d4d4d8;
  border-radius: 999px;
  height: 3px;
  margin: 0 2px;
  opacity: 1;
  transition: all 0.2s ease;
  width: 10px;
}

.combo-swiper :deep(.swiper-pagination-bullet-active),
.accessory-swiper :deep(.swiper-pagination-bullet-active) {
  background: #d70018;
  width: 18px;
}

.combo-swiper :deep(.swiper-button-next),
.combo-swiper :deep(.swiper-button-prev),
.accessory-swiper :deep(.swiper-button-next),
.accessory-swiper :deep(.swiper-button-prev) {
  align-items: center;
  background: #fff;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
  display: flex;
  height: 34px;
  justify-content: center;
  margin: 0;
  opacity: 1;
  top: 40%;
  transition: opacity 0.2s ease;
  width: 22px;
}

.combo-swiper :deep(.swiper-button-next),
.accessory-swiper :deep(.swiper-button-next) {
  border-radius: 999px 0 0 999px;
  padding-right: 2px;
  right: -2px;
}

.combo-swiper :deep(.swiper-button-prev),
.accessory-swiper :deep(.swiper-button-prev) {
  border-radius: 0 999px 999px 0;
  left: -2px;
  padding-left: 2px;
}

.combo-swiper :deep(.swiper-button-next:after),
.combo-swiper :deep(.swiper-button-prev:after),
.accessory-swiper :deep(.swiper-button-next:after),
.accessory-swiper :deep(.swiper-button-prev:after) {
  display: none;
}

.combo-swiper :deep(.swiper-button-disabled),
.accessory-swiper :deep(.swiper-button-disabled) {
  opacity: 0;
  pointer-events: none;
}

.combo-swiper :deep(.icon),
.accessory-swiper :deep(.icon) {
  align-items: center;
  color: #707070;
  display: flex;
  justify-content: center;
}

.combo-swiper :deep(.icon svg),
.accessory-swiper :deep(.icon svg) {
  fill: #707070;
}

.my-3 {
  margin-bottom: 0.75rem;
  margin-top: 0.75rem;
}

@media screen and (max-width: 540px) {

  .list-option__head,
  #boxUpsell {
    padding-left: 12px;
    padding-right: 12px;
  }

  .option__title,
  .upsell-title {
    font-size: 16px;
  }

  .option__action button {
    font-size: 13px;
  }

  .list-option__body--combo {
    padding: 10px;
  }

  .item-wrapper,
  .upsell-item-wrapper {
    padding: 10px;
  }

  .image {
    width: 64px;
  }

  .image img {
    max-width: 56px;
  }

  .upsell-item-image {
    height: 56px;
    width: 56px;
  }

  .button {
    font-size: 12px;
    min-width: 0;
    padding: 7px 10px;
  }

  .item-action {
    gap: 12px;
  }

  .button-select {
    min-width: 88px;
  }

  .product__price--show {
    font-size: 14px;
  }
}
</style>
