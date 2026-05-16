<template>
  <aside class="checkout-summary" :style="summaryStyle">
    <div class="d-flex flex-column gap-1">
      <p class="checkout-summary__eyebrow">{{ $t("checkout.orderSummary") }}</p>
      <h2 class="checkout-summary__title">
        {{ $t("checkout.orderCount", { count: cartStore.selectedItemCount }) }}
      </h2>
    </div>

    <button
      class="checkout-summary__toggle"
      type="button"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      <span>{{ $t("checkout.viewDetails") }}</span>
      <i :class="expanded ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
    </button>

    <div class="checkout-summary__items" :class="{ 'checkout-summary__items--expanded': expanded }">
      <div
        v-for="item in cartStore.selectedItems"
        :key="item.id"
        class="d-flex gap-2 align-items-start pt-2"
      >
        <div class="checkout-summary__item-image position-relative">
          <img
            :src="item.thumbnail || fallbackImage"
            :alt="item.productName"
            loading="lazy"
            @error="handleImageError"
          />
          <span class="checkout-summary__item-qty">{{ item.quantity }}</span>
        </div>
        <div class="flex-grow-1 minw-0">
          <p class="checkout-summary__item-name">{{ item.productName }}</p>
          <p v-if="getSelectedOptionsText(item)" class="checkout-summary__item-options">
            {{ getSelectedOptionsText(item) }}
          </p>
        </div>
        <div class="checkout-summary__item-price">
          {{ item.lineTotal?.formatted || item.currentLineTotal?.formatted || "0đ" }}
        </div>
      </div>

      <div v-if="cartStore.selectedItems.length === 0" class="checkout-summary__empty">
        {{ $t("checkout.noItems") }}
      </div>
    </div>

    <div class="border-top my-1"></div>

    <dl class="d-flex flex-column gap-2 m-0">
      <div class="d-flex justify-content-between align-items-center">
        <dt class="text-secondary m-0">{{ $t("checkout.subtotal") }}</dt>
        <dd class="m-0">{{ checkoutStore.subtotal?.formatted || "0đ" }}</dd>
      </div>

      <div v-if="checkoutStore.savings?.value > 0" class="d-flex justify-content-between align-items-center">
        <dt class="text-secondary m-0">{{ $t("checkout.discount") }}</dt>
        <dd class="m-0 text-success">-{{ checkoutStore.savings?.formatted || "0đ" }}</dd>
      </div>

      <div v-if="checkoutStore.selectedVoucherCodes.length > 0" class="d-flex justify-content-between align-items-center">
        <dt class="text-secondary m-0">{{ $t("checkout.voucher") }}</dt>
        <dd class="m-0 checkout-summary__voucher">-{{ checkoutStore.voucherDiscount?.formatted || "0đ" }}</dd>
      </div>

      <div v-if="checkoutStore.finalDeliveryFee > 0" class="d-flex justify-content-between align-items-center">
        <dt class="text-secondary m-0">{{ $t("checkout.deliveryFee") }}</dt>
        <dd class="m-0">+{{ formatMoneyValue(checkoutStore.finalDeliveryFee) }}</dd>
      </div>

      <div v-if="checkoutStore.finalDeliveryFee === 0" class="d-flex justify-content-between align-items-center">
        <dt class="text-secondary m-0">{{ $t("checkout.deliveryFee") }}</dt>
        <dd class="m-0 checkout-summary__free">{{ $t("checkout.free") }}</dd>
      </div>

      <div v-if="checkoutStore.insuranceFee?.value > 0" class="d-flex justify-content-between align-items-center">
        <dt class="text-secondary m-0">{{ $t("checkout.insurance") }}</dt>
        <dd class="m-0">+{{ checkoutStore.insuranceFee?.formatted }}</dd>
      </div>
    </dl>

    <div class="border-top my-1"></div>

    <div class="d-flex justify-content-between align-items-center">
      <span class="fw-semibold">{{ $t("checkout.total") }}</span>
      <span class="checkout-summary__total-value">{{ checkoutStore.finalTotal?.formatted || "0đ" }}</span>
    </div>

    <label class="d-flex gap-2 align-items-start cursor-pointer">
      <input
        type="checkbox"
        v-model="checkoutStore.agreedToTerms"
        :aria-invalid="agreedError"
        class="checkout-summary__checkbox"
      />
      <span class="checkout-summary__agreement-text">
        {{ $t("checkout.agreeTerms") }}
        <a :href="$t('checkout.termsUrl')" target="_blank" rel="noopener noreferrer">{{ $t("checkout.terms") }}</a>
        {{ $t("checkout.and") }}
        <a :href="$t('checkout.shippingPolicyUrl')" target="_blank" rel="noopener noreferrer">{{ $t("checkout.shippingPolicy") }}</a>
      </span>
    </label>
    <p v-if="agreedError" class="checkout-summary__agreement-error" role="alert">
      {{ $t("checkout.agreeRequired") }}
    </p>

    <button
      type="button"
      class="checkout-summary__cta"
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
  </aside>

  <!-- Mobile sticky order summary bar -->
  <div class="order-summary-mobile">
    <div class="order-summary-mobile__toggle" @click="mobileExpanded = !mobileExpanded">
      <div class="order-summary-mobile__preview">
        <span>{{ $t("checkout.orderSummary") }}</span>
        <strong class="text-danger">{{ checkoutStore.finalTotal?.formatted || "0đ" }}</strong>
      </div>
      <i :class="mobileExpanded ? 'bi bi-chevron-down' : 'bi bi-chevron-up'"></i>
    </div>

    <div v-if="mobileExpanded" class="order-summary-mobile__body">
      <dl class="order-summary-mobile__pricing">
        <div class="order-summary-mobile__row">
          <dt>{{ $t("checkout.subtotal") }}</dt>
          <dd>{{ checkoutStore.subtotal?.formatted || "0đ" }}</dd>
        </div>
        <div v-if="checkoutStore.savings?.value > 0" class="order-summary-mobile__row">
          <dt>{{ $t("checkout.discount") }}</dt>
          <dd class="text-success">-{{ checkoutStore.savings?.formatted || "0đ" }}</dd>
        </div>
        <div v-if="checkoutStore.selectedVoucherCodes.length > 0" class="order-summary-mobile__row">
          <dt>{{ $t("checkout.voucher") }}</dt>
          <dd class="text-success">-{{ checkoutStore.voucherDiscount?.formatted || "0đ" }}</dd>
        </div>
        <div class="order-summary-mobile__row">
          <dt>{{ $t("checkout.deliveryFee") }}</dt>
          <dd>{{ checkoutStore.finalDeliveryFee > 0 ? formatMoneyValue(checkoutStore.finalDeliveryFee) : $t("checkout.free") }}</dd>
        </div>
        <div class="order-summary-mobile__total">
          <strong>{{ $t("checkout.total") }}</strong>
          <strong class="text-danger">{{ checkoutStore.finalTotal?.formatted || "0đ" }}</strong>
        </div>
      </dl>
      <button
        type="button"
        class="order-summary-mobile__cta"
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";

defineEmits(["submit"]);

const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();

const expanded = ref(false);
const mobileExpanded = ref(false);
const progressExtraOffset = ref(0);

const fallbackImage = "https://placehold.co/56x56/f4f4f5/d4d4d8?text=%20";

const summaryStyle = computed(() => ({
  "--summary-offset-top": `${16 + progressExtraOffset.value}px`,
}));

const agreedError = computed(() => {
  return false;
});

const handleImageError = (e) => {
  e.target.src = fallbackImage;
};

const formatMoneyValue = (value) => {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};

const getSelectedOptionsText = (item) => {
  if (!item?.selectedOptions) return null;
  return Object.values(item.selectedOptions).join(", ");
};

const handleProgressStickyChange = ({ detail }) => {
  progressExtraOffset.value = detail.isSticky ? detail.stickyHeight : detail.normalHeight;
};

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("checkout-progress:sticky-change", handleProgressStickyChange);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("checkout-progress:sticky-change", handleProgressStickyChange);
  }
});
</script>

<style scoped>
.checkout-summary {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px;
  position: sticky;
  top: calc(var(--customer-sidebar-offset, 90px) + var(--summary-offset-top, 16px));
  width: 100%;
}

.checkout-summary__eyebrow {
  color: var(--irus-color-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0;
  text-transform: uppercase;
}

.checkout-summary__title {
  color: #18181b;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.checkout-summary__toggle {
  align-items: center;
  background: #f7f7f8;
  border: none;
  border-radius: 12px;
  color: #71717a;
  cursor: pointer;
  display: flex;
  font-size: 13px;
  font-weight: 500;
  gap: 6px;
  justify-content: space-between;
  padding: 10px 14px;
  transition: background 0.15s ease;
  width: 100%;
}

.checkout-summary__toggle:hover {
  background: #f0f0f2;
}

.checkout-summary__items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
}

.checkout-summary__items--expanded {
  max-height: 600px;
  overflow-y: auto;
}

.checkout-summary__item-image {
  flex-shrink: 0;
}

.checkout-summary__item-image img {
  border-radius: 10px;
  height: 56px;
  object-fit: cover;
  width: 56px;
}

.checkout-summary__item-qty {
  align-items: center;
  background: #71717a;
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  font-size: 11px;
  font-weight: 700;
  height: 20px;
  justify-content: center;
  min-width: 20px;
  position: absolute;
  right: -6px;
  top: -6px;
}

.checkout-summary__item-name {
  color: #18181b;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.checkout-summary__item-options {
  color: #71717a;
  font-size: 12px;
  margin: 2px 0 0;
}

.checkout-summary__item-price {
  color: #18181b;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.checkout-summary__empty {
  color: #a1a1aa;
  font-size: 13px;
  text-align: center;
  padding: 12px 0;
}

.checkout-summary__free {
  color: #15803d !important;
  font-weight: 700 !important;
}

.checkout-summary__total-value {
  color: var(--irus-color-accent);
  font-size: 24px;
  font-weight: 700;
}

.checkout-summary__voucher {
  color: var(--irus-color-accent) !important;
}

.checkout-summary__checkbox {
  flex-shrink: 0;
  margin-top: 2px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkout-summary__agreement-text {
  font-size: 12px;
  line-height: 1.55;
  color: #52525b;
}

.checkout-summary__agreement-text a {
  color: var(--irus-color-accent);
  text-decoration: none;
}

.checkout-summary__agreement-text a:hover {
  text-decoration: underline;
}

.checkout-summary__agreement-error {
  color: #be123c;
  font-size: 12px;
  margin: -8px 0 0;
}

.checkout-summary__cta {
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
  transition: background 0.15s ease, transform 0.1s ease;
  width: 100%;
}

.checkout-summary__cta:hover:not(:disabled) {
  background: #1a1a1a;
  transform: scale(1.02);
}

.checkout-summary__cta:active:not(:disabled) {
  transform: scale(0.98);
}

.checkout-summary__cta:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@media (max-width: 991.98px) {
  .checkout-summary {
    display: none;
  }
}

/* ── Mobile Sticky Order Summary ─────────── */
.order-summary-mobile {
  display: none;
  position: fixed;
  bottom: 88px;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #ececf1;
  box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.08);
  z-index: 110;
}

@media (max-width: 991.98px) {
  .order-summary-mobile {
    display: block;
  }
}

.order-summary-mobile__toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  background: #fafafa;
}

.order-summary-mobile__preview {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #18181b;
}

.order-summary-mobile__body {
  padding: 12px 16px 16px;
  border-top: 1px solid #ececf1;
}

.order-summary-mobile__pricing {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 0 12px;
}

.order-summary-mobile__row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #71717a;
}

.order-summary-mobile__row dd {
  color: #18181b;
  font-weight: 600;
  margin: 0;
}

.order-summary-mobile__total {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  border-top: 1px solid #ececf1;
  padding-top: 8px;
  margin-top: 4px;
}

.order-summary-mobile__cta {
  width: 100%;
  background: var(--irus-color-surface-strong);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  min-height: 48px;
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.order-summary-mobile__cta:hover:not(:disabled) {
  background: #1a1a1a;
}

.order-summary-mobile__cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
