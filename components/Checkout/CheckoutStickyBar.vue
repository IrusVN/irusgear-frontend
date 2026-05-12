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
            {{ $t("checkout.itemCount", { count: cartStore.itemCount }) }}
          </span>
          <span class="checkout-sticky-bar__total">
            {{ checkoutStore.finalTotal?.formatted || "0đ" }}
          </span>
        </div>
        <i :class="expanded ? 'bi bi-chevron-down' : 'bi bi-chevron-up'"></i>
      </button>

      <div v-if="expanded" class="checkout-sticky-bar__details">
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

      <button
        type="button"
        class="checkout-sticky-bar__cta"
        :disabled="!checkoutStore.canSubmit || checkoutStore.isSubmitting"
        @click="$emit('submit')"
      >
        <span v-if="checkoutStore.isSubmitting">
          <i class="bi bi-arrow-repeat spin"></i>
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
import { ref } from "vue";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";

defineEmits(["submit"]);

const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();

const expanded = ref(false);

const formatMoneyValue = (value) => {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};
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

@media (max-width: 991.98px) {
  .checkout-sticky-bar {
    display: block;
    bottom: 88px; /* Đẩy lên trên mobile bottom nav (88px) */
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
  overflow: hidden;
  padding: 12px 14px;
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
  transition: background 0.15s ease;
  width: 100%;
}

.checkout-sticky-bar__cta:hover:not(:disabled) {
  background: var(--irus-color-surface-dark);
}

.checkout-sticky-bar__cta:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 0.8s linear infinite;
}
</style>
