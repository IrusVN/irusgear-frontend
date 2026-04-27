<template>
  <div v-if="productDetail" class="block-order-desktop" :class="{ show: visible }">
    <div class="block-order-shell">
      <div class="cps-block-order-button-desktop show">
        <div class="cta-product-info">
          <img
            :src="productImage"
            width="56"
            height="56"
            :alt="productName"
            :title="productName"
            loading="lazy"
            class="cta-product-image"
          />
          <div class="d-flex flex-column">
            <p class="cta-product-name">{{ productName }}</p>
          </div>
        </div>

        <div class="cta-action">
          <div class="cta-product-price">
            <p class="sale-price">
              <span>{{ salePrice }}</span>
            </p>
            <del v-if="showBasePrice" class="base-price">
              {{ basePrice }}
            </del>
          </div>

          <button type="button" class="button-desktop button-desktop-installment">
            <p>Trả góp 0%</p>
          </button>

          <button
            type="button"
            class="button-desktop button-desktop-order"
            :disabled="cartBusy"
            @click="buyCurrentProductNow"
          >
            <p>Mua Ngay</p>
          </button>

          <button
            type="button"
            class="button-desktop button-add-to-cart"
            aria-label="Thêm vào giỏ hàng"
            :disabled="cartBusy"
            @click="addCurrentProductToCart()"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse
                cx="4.99992"
                cy="15.8334"
                rx="1.66667"
                ry="1.66667"
                stroke="#D70018"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                cx="14.1667"
                cy="15.8334"
                r="1.66667"
                stroke="#D70018"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.1666 14.1667H4.99992V2.5H3.33325"
                stroke="#D70018"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.05344 3.41865C4.64028 3.38914 4.28142 3.70014 4.25191 4.1133C4.22239 4.52646 4.5334 4.88533 4.94656 4.91484L5.05344 3.41865ZM9.95072 5.27234C10.3639 5.30186 10.7227 4.99085 10.7523 4.57769C10.7818 4.16453 10.4708 3.80567 10.0576 3.77615L9.95072 5.27234ZM16.6949 10.1081C16.7537 9.6981 16.4689 9.31808 16.0589 9.25933C15.6489 9.20058 15.2688 9.48534 15.2101 9.89537L16.6949 10.1081ZM15.8333 10.8334V11.5834C16.2065 11.5834 16.5228 11.3091 16.5758 10.9398L15.8333 10.8334ZM5 10.0834C4.58579 10.0834 4.25 10.4192 4.25 10.8334C4.25 11.2476 4.58579 11.5834 5 11.5834V10.0834ZM4.94656 4.91484L9.95072 5.27234L10.0576 3.77615L5.05344 3.41865L4.94656 4.91484ZM15.2101 9.89537L15.0909 10.727L16.5758 10.9398L16.6949 10.1081L15.2101 9.89537ZM15.8333 10.0834H5V11.5834H15.8333V10.0834Z"
                fill="#D70018"
              />
              <path
                d="M12.5 4.25C12.0858 4.25 11.75 4.58579 11.75 5C11.75 5.41421 12.0858 5.75 12.5 5.75V4.25ZM17.5 5.75C17.9142 5.75 18.25 5.41421 18.25 5C18.25 4.58579 17.9142 4.25 17.5 4.25V5.75ZM15.75 2.5C15.75 2.08579 15.4142 1.75 15 1.75C14.5858 1.75 14.25 2.08579 14.25 2.5H15.75ZM14.25 7.5C14.25 7.91421 14.5858 8.25 15 8.25C15.4142 8.25 15.75 7.91421 15.75 7.5H14.25ZM12.5 5.75H17.5V4.25H12.5V5.75ZM14.25 2.5V7.5H15.75V2.5H14.25Z"
                fill="#D70018"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores/productStore";
import { useCartActions } from "@/composables/useCartActions";

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const productStore = useProductStore();
const { cartBusy, addCurrentProductToCart, buyCurrentProductNow } = useCartActions();
const { productDetail } = storeToRefs(productStore);

const productName = computed(() => productDetail.value?.name || "");

const productImage = computed(() => {
  return (
    productDetail.value?.activeColor?.thumbnail ||
    productDetail.value?.gallery?.[0]?.thumbnail ||
    productDetail.value?.gallery?.[0]?.image ||
    "https://placehold.co/56x56/f4f4f5/d4d4d8?text=%20"
  );
});

const salePrice = computed(() => productDetail.value?.pricing?.salePrice?.formatted || "");
const basePrice = computed(() => productDetail.value?.pricing?.basePrice?.formatted || "");

const showBasePrice = computed(() => {
  const saleValue = Number(productDetail.value?.pricing?.salePrice?.value || 0);
  const baseValue = Number(productDetail.value?.pricing?.basePrice?.value || 0);

  return baseValue > saleValue && Boolean(basePrice.value);
});
</script>

<style scoped>
.block-order-desktop {
  bottom: 10px;
  left: 0;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  right: 0;
  transform: translateY(18px);
  transition: opacity 0.28s ease, transform 0.28s ease, visibility 0.28s ease;
  visibility: hidden;
  z-index: 103;
}

.block-order-desktop.show {
  opacity: 1;
  transform: translateY(0);
  visibility: visible;
}

.block-order-shell {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 920px;
  padding: 0 16px;
}

.cps-block-order-button-desktop {
  align-items: center;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 18px 46px -26px rgba(0, 0, 0, 0.22), 0 8px 18px rgba(0, 0, 0, 0.05);
  color: #18181b;
  display: flex;
  flex: 1 1 auto;
  gap: 20px;
  justify-content: space-between;
  max-width: 880px;
  min-height: 80px;
  padding: 10px 18px;
  pointer-events: auto;
}

.cta-product-info {
  align-items: center;
  display: flex;
  flex: 1 1 0;
  gap: 12px;
  min-width: 0;
}

.cta-product-image {
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  display: block;
  flex-shrink: 0;
  height: 56px;
  object-fit: cover;
  width: 56px;
}

.cta-product-name {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  color: #1f2937;
  display: -webkit-box;
  font-size: 14px;
  font-weight: 600;
  line-clamp: 1;
  line-height: 1.45;
  margin: 0;
  overflow: hidden;
}

.cta-action {
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  gap: 8px;
}

.cta-product-price {
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 4px;
  min-width: 132px;
}

.sale-price {
  color: #d70018;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  white-space: nowrap;
}

.base-price {
  color: #a1a1aa;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  margin-top: 3px;
  text-decoration: line-through;
  white-space: nowrap;
}

.button-desktop {
  align-items: center;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  height: 40px;
  justify-content: center;
  padding: 0 14px;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  white-space: nowrap;
}

.button-desktop p {
  margin: 0;
}

.button-desktop:hover,
.button-add-to-cart:hover {
  transform: translateY(-1px);
}

.button-desktop-installment {
  background-color: #fff;
  border-color: #3b82f6;
  color: #3b82f6;
  min-width: 104px;
}

.button-desktop-order {
  background-color: #d70018;
  color: #fff;
  min-width: 100px;
}

.button-add-to-cart {
  align-items: center;
  background-color: #fff;
  border: 1px solid #d70018;
  border-radius: 10px;
  display: inline-flex;
  height: 40px;
  justify-content: center;
  padding: 0;
  width: 42px;
}

@media only screen and (max-width: 1199px) {
  .cps-block-order-button-desktop {
    gap: 14px;
  }

  .cta-product-price {
    min-width: 118px;
  }
}

@media only screen and (max-width: 990px) {
  .block-order-desktop {
    display: none;
  }
}
</style>
