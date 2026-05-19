<template>
  <div class="checkout-sticky-bar">
    <div class="container-xl checkout-sticky-bar__inner">
      <button
        class="checkout-sticky-bar__toggle"
        type="button"
        @click="expanded = !expanded"
      >
        <div class="checkout-sticky-bar__summary">
          <span class="checkout-sticky-bar__count">
            {{ $t("checkout.itemCount", { count: cartStore.selectedItemCount }) }}
          </span>
          <span class="checkout-sticky-bar__total">
            {{ checkoutStore.finalTotal?.formatted || "0đ" }}
          </span>
        </div>
        <i :class="expanded ? 'bi bi-chevron-down' : 'bi bi-chevron-up'"></i>
      </button>

      <div v-if="expanded" class="checkout-sticky-bar__details">
        <!-- Items list: thumbnail + name (clamp 2 lines) + qty.
             Field name: cart store normalize sang camelCase (productName), không phải snake_case. -->
        <div v-if="cartStore.selectedItems.length" class="checkout-sticky-bar__items">
          <div
            v-for="item in cartStore.selectedItems.slice(0, 3)"
            :key="item.id"
            class="checkout-sticky-bar__item"
          >
            <img
              :src="item.thumbnail || item.image || '/placeholder.png'"
              :alt="item.productName"
              class="checkout-sticky-bar__item-thumb"
            />
            <div class="checkout-sticky-bar__item-info">
              <span class="checkout-sticky-bar__item-name">{{ item.productName || item.product_name || item.name }}</span>
              <span v-if="item.variantName || item.meta?.variant_name" class="checkout-sticky-bar__item-variant">
                {{ item.variantName || item.meta?.variant_name }}
              </span>
            </div>
            <span class="checkout-sticky-bar__item-qty">x{{ item.quantity }}</span>
          </div>
          <div v-if="cartStore.selectedItems.length > 3" class="checkout-sticky-bar__more">
            +{{ cartStore.selectedItems.length - 3 }} {{ $t("cart.moreItems") }}
          </div>
        </div>

        <div class="checkout-sticky-bar__detail-row">
          <span>{{ $t("checkout.subtotal") }}</span>
          <span>{{ checkoutStore.subtotal?.formatted || "0đ" }}</span>
        </div>
        <div v-if="checkoutStore.savings?.value > 0" class="checkout-sticky-bar__detail-row">
          <span>{{ $t("checkout.discount") }}</span>
          <span class="checkout-sticky-bar__discount">-{{ checkoutStore.savings?.formatted }}</span>
        </div>
        <div v-if="checkoutStore.voucherDiscount?.value > 0" class="checkout-sticky-bar__detail-row">
          <span>{{ $t("checkout.voucher") }}</span>
          <span class="checkout-sticky-bar__discount">-{{ checkoutStore.voucherDiscount?.formatted }}</span>
        </div>
        <div class="checkout-sticky-bar__detail-row">
          <span>{{ $t("checkout.deliveryFee") }}</span>
          <span v-if="checkoutStore.finalDeliveryFee > 0">
            +{{ formatMoneyValue(checkoutStore.finalDeliveryFee) }}
          </span>
          <span v-else class="checkout-sticky-bar__free">{{ $t("checkout.free") }}</span>
        </div>
        <div class="checkout-sticky-bar__total-row">
          <strong>{{ $t("checkout.total") }}</strong>
          <strong>{{ checkoutStore.finalTotal?.formatted || "0đ" }}</strong>
        </div>
      </div>

      <label class="checkout-sticky-bar__agreement">
        <input
          type="checkbox"
          v-model="checkoutStore.agreedToTerms"
          class="checkout-sticky-bar__checkbox"
        />
        <span class="checkout-sticky-bar__agreement-text">
          {{ $t("checkout.agreeTerms") }}
          <a :href="$t('checkout.termsUrl')" target="_blank" rel="noopener noreferrer" @click.stop>{{ $t("checkout.terms") }}</a>
          {{ $t("checkout.and") }}
          <a :href="$t('checkout.shippingPolicyUrl')" target="_blank" rel="noopener noreferrer" @click.stop>{{ $t("checkout.shippingPolicy") }}</a>
        </span>
      </label>

      <button
        type="button"
        class="checkout-sticky-bar__cta"
        :disabled="!checkoutStore.canSubmit || checkoutStore.isSubmitting"
        @click="$emit('submit')"
      >
        <span v-if="checkoutStore.isSubmitting">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{ $t("checkout.processing") }}
        </span>
        <span v-else>
          <i class="bi bi-credit-card-2-front"></i>
          {{ $t("checkout.placeOrder") }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";

defineEmits(["submit"]);

const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();

// Mở sẵn details mỗi lần mount; user có thể bấm nút toggle để đóng.
const expanded = ref(true);

const formatMoneyValue = (value) => {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};

// Đánh dấu body khi sticky bar đang hiển thị → ChatbotWidget có thể đọc
// class này để tự đẩy chatbox lên trên sticky bar (tránh visual overlap
// ở mobile). Class chỉ ảnh hưởng ở < 992px vì sticky bar mặc định display:none ở desktop.
onMounted(() => {
  if (typeof document !== "undefined") {
    document.body.classList.add("has-checkout-sticky-bar");
  }
});

onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.body.classList.remove("has-checkout-sticky-bar");
  }
});
</script>

<style scoped>
.checkout-sticky-bar {
  background: #fff;
  border-top: 1px solid #ececf1;
  bottom: 0;
  display: none;
  left: 0;
  padding-bottom: env(safe-area-inset-bottom, 0);
  position: fixed;
  right: 0;
  z-index: 120;
  box-shadow: 0 -10px 28px rgba(15, 23, 42, 0.1);
}

/* Tablet (768-991px): không có mobile bottom nav (.d-md-none) → sticky bar nằm sát đáy.
   Mobile (< 768px): mobile bottom nav cao ~88px → đẩy sticky bar lên trên. */
@media (max-width: 991.98px) {
  .checkout-sticky-bar {
    display: block;
    bottom: 0;
  }
}

@media (max-width: 767.98px) {
  .checkout-sticky-bar {
    bottom: 88px;
  }
}

.checkout-sticky-bar__inner {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-top: 10px;
  padding-bottom: 10px;
}

.checkout-sticky-bar__toggle {
  align-items: center;
  background: #f7f7f8;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  font-size: 13px;
  font-weight: 500;
  gap: 8px;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 8px 14px;
  width: 100%;
  color: #71717a;
}

.checkout-sticky-bar__summary {
  align-items: center;
  display: flex;
  gap: 12px;
}

.checkout-sticky-bar__count {
  color: #71717a;
}

.checkout-sticky-bar__total {
  color: var(--irus-color-accent);
  font-weight: 700;
}

.checkout-sticky-bar__details {
  background: #fafafa;
  border-radius: 12px;
  margin-bottom: 8px;
  max-height: 50vh;
  overflow-y: auto;
  padding: 12px 14px;
}

.checkout-sticky-bar__items {
  border-bottom: 1px dashed #e4e4e7;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 8px;
}

.checkout-sticky-bar__item {
  align-items: center;
  display: flex;
  gap: 10px;
}

.checkout-sticky-bar__item-thumb {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 8px;
  flex-shrink: 0;
  height: 40px;
  object-fit: cover;
  width: 40px;
}

.checkout-sticky-bar__item-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.checkout-sticky-bar__item-name {
  color: #18181b;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.checkout-sticky-bar__item-variant {
  color: #71717a;
  font-size: 11px;
  line-height: 1.3;
}

.checkout-sticky-bar__item-qty {
  color: #52525b;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
}

.checkout-sticky-bar__more {
  color: #71717a;
  font-size: 12px;
  font-style: italic;
  padding-left: 50px;
}

.checkout-sticky-bar__detail-row {
  align-items: center;
  color: #71717a;
  display: flex;
  font-size: 13px;
  justify-content: space-between;
  padding: 4px 0;
}

.checkout-sticky-bar__discount {
  color: #15803d;
  font-weight: 600;
}

.checkout-sticky-bar__free {
  color: #15803d;
  font-weight: 700;
}

.checkout-sticky-bar__total-row {
  align-items: center;
  border-top: 1px solid #ececf1;
  display: flex;
  font-size: 15px;
  justify-content: space-between;
  margin-top: 6px;
  padding-top: 6px;
}

.checkout-sticky-bar__total-row strong:last-child {
  color: var(--irus-color-accent);
}

.checkout-sticky-bar__cta {
  align-items: center;
  background: var(--irus-color-surface-strong);
  border: none;
  border-radius: 16px;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  font-weight: 800;
  gap: 8px;
  justify-content: center;
  min-height: 52px;
  transition: background 0.15s ease, transform 0.15s ease;
  width: 100%;
}

.checkout-sticky-bar__cta:hover:not(:disabled) {
  background: #1a1a1a;
  transform: translateY(-1px);
}

.checkout-sticky-bar__cta:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.checkout-sticky-bar__agreement {
  align-items: flex-start;
  cursor: pointer;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  padding: 0 4px;
}

.checkout-sticky-bar__checkbox {
  accent-color: var(--irus-color-accent);
  cursor: pointer;
  flex-shrink: 0;
  height: 16px;
  margin-top: 2px;
  width: 16px;
}

.checkout-sticky-bar__agreement-text {
  color: #52525b;
  font-size: 12px;
  line-height: 1.4;
}

.checkout-sticky-bar__agreement-text a {
  color: var(--irus-color-accent);
  text-decoration: none;
}

.checkout-sticky-bar__agreement-text a:hover {
  text-decoration: underline;
}

/* ── Responsive nhỏ hơn để khít các device folded / small phones ── */
/* Galaxy Z Fold 5 (344px), Samsung S8+ (360px), iPhone SE (375px) */
@media (max-width: 380px) {
  .checkout-sticky-bar__inner {
    padding-left: 12px;
    padding-right: 12px;
  }

  .checkout-sticky-bar__toggle {
    font-size: 12px;
    padding: 7px 12px;
  }

  .checkout-sticky-bar__total {
    font-size: 13px;
  }

  .checkout-sticky-bar__agreement-text {
    font-size: 11px;
  }

  .checkout-sticky-bar__cta {
    font-size: 14px;
    min-height: 46px;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 0.8s linear infinite;
  display: inline-block;
}
</style>
