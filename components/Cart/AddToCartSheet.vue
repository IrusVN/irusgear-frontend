<template>
  <BottomSheet ref="sheetRef" @close="handleClose">
    <div class="cart-sheet">
      <div class="cart-sheet__header">
        <p class="cart-sheet__eyebrow">Giỏ hàng</p>
        <h3 class="cart-sheet__title">Đã thêm sản phẩm vào giỏ</h3>
      </div>

      <div v-if="lastAddedItem" class="cart-sheet__item">
        <img
          :src="lastAddedItem.thumbnail || fallbackImage"
          :alt="lastAddedItem.productName"
          class="cart-sheet__image"
        >

        <div class="cart-sheet__content">
          <h4 class="cart-sheet__name">{{ lastAddedItem.productName }}</h4>

          <div v-if="optionEntries.length" class="cart-sheet__options">
            <span
              v-for="[key, value] in optionEntries"
              :key="`${key}-${value}`"
              class="cart-sheet__option"
            >
              {{ key }}: {{ value }}
            </span>
          </div>

          <div class="cart-sheet__meta">
            <span>Số lượng: {{ lastAddedItem.quantity }}</span>
            <strong>{{ lastAddedItem.currentLineTotal?.formatted || lastAddedItem.lineTotal?.formatted }}</strong>
          </div>
        </div>
      </div>

      <div class="cart-sheet__summary">
        <div class="cart-sheet__summary-row">
          <span>{{ itemCount || 0 }} sản phẩm trong giỏ</span>
          <strong>{{ subtotal?.formatted || "0đ" }}</strong>
        </div>

        <p v-if="savings?.value > 0" class="cart-sheet__summary-note">
          Bạn đang tiết kiệm {{ savings.formatted }} so với mức giá đã lưu trước đó.
        </p>

        <p class="cart-sheet__summary-note">
          Giỏ của bạn sẽ được giữ lại khi đăng nhập hoặc quay lại trên cùng trình duyệt.
        </p>
      </div>

      <div class="cart-sheet__actions">
        <button type="button" class="cart-sheet__btn cart-sheet__btn--ghost" @click="handleClose">
          Mua tiếp
        </button>

        <NuxtLink
          :to="localePath('/cart')"
          class="cart-sheet__btn cart-sheet__btn--primary"
          @click="handleGoToCart"
        >
          Xem giỏ hàng
        </NuxtLink>
      </div>
    </div>
  </BottomSheet>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useLocalePath } from "#imports";
import BottomSheet from "@/components/Common/BottomSheet.vue";
import { useCartStore } from "@/stores/cartStore";

const fallbackImage = "https://placehold.co/80x80/f4f4f5/d4d4d8?text=%20";
const sheetRef = ref(null);
const cartStore = useCartStore();
const { lastAddedItem, isAddToCartSheetOpen, itemCount, subtotal, savings } = storeToRefs(cartStore);
const localePath = useLocalePath();

const optionEntries = computed(() => {
  const options = lastAddedItem.value?.selectedOptions || {};

  return Object.entries(options).filter(([, value]) => Boolean(value));
});

watch(isAddToCartSheetOpen, (open) => {
  if (open) {
    sheetRef.value?.open();
    return;
  }

  sheetRef.value?.close();
});

const handleClose = () => {
  cartStore.closeAddToCartSheet();
};

const handleGoToCart = () => {
  cartStore.closeAddToCartSheet();
};
</script>

<style scoped>
.cart-sheet {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 20px 24px;
}

.cart-sheet__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-sheet__eyebrow {
  color: #d70018;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0;
  text-transform: uppercase;
}

.cart-sheet__title {
  color: #18181b;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.cart-sheet__item,
.cart-sheet__summary {
  background: #f7f7f8;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 14px;
}

.cart-sheet__item {
  align-items: center;
  display: flex;
  gap: 14px;
}

.cart-sheet__image {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  flex-shrink: 0;
  height: 80px;
  object-fit: cover;
  width: 80px;
}

.cart-sheet__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.cart-sheet__name {
  color: #18181b;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.45;
  margin: 0;
}

.cart-sheet__options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cart-sheet__option {
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 999px;
  color: #52525b;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
}

.cart-sheet__meta,
.cart-sheet__summary-row {
  align-items: center;
  color: #52525b;
  display: flex;
  font-size: 13px;
  gap: 12px;
  justify-content: space-between;
}

.cart-sheet__meta strong,
.cart-sheet__summary-row strong {
  color: #d70018;
  font-size: 16px;
}

.cart-sheet__summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cart-sheet__summary-note {
  color: #71717a;
  font-size: 12px;
  line-height: 1.55;
  margin: 0;
}

.cart-sheet__actions {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.cart-sheet__btn {
  align-items: center;
  border-radius: 14px;
  display: inline-flex;
  font-size: 14px;
  font-weight: 700;
  justify-content: center;
  min-height: 48px;
  text-decoration: none;
}

.cart-sheet__btn--ghost {
  background: #fff;
  border: 1px solid #d4d4d8;
  color: #18181b;
}

.cart-sheet__btn--primary {
  background: #d70018;
  border: 1px solid #d70018;
  color: #fff;
}
</style>
