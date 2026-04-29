<template>
  <aside class="checkout-summary">
    <div class="checkout-summary__head">
      <p class="checkout-summary__eyebrow">{{ $t("checkout.orderSummary") }}</p>
      <h2 class="checkout-summary__title">
        {{ $t("checkout.orderCount", { count: cartStore.itemCount }) }}
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
        v-for="item in cartStore.items"
        :key="item.id"
        class="checkout-summary__item"
      >
        <div class="checkout-summary__item-image">
          <img
            :src="item.image || fallbackImage"
            :alt="item.productName"
            loading="lazy"
            @error="handleImageError"
          />
          <span class="checkout-summary__item-qty">{{ item.quantity }}</span>
        </div>
        <div class="checkout-summary__item-info">
          <p class="checkout-summary__item-name">{{ item.productName }}</p>
          <p v-if="item.selectedOptionsText" class="checkout-summary__item-options">
            {{ item.selectedOptionsText }}
          </p>
        </div>
        <div class="checkout-summary__item-price">
          {{ item.price?.formatted || item.subtotal?.formatted || "0đ" }}
        </div>
      </div>

      <div v-if="cartStore.items.length === 0" class="checkout-summary__empty">
        {{ $t("checkout.noItems") }}
      </div>
    </div>

    <div class="checkout-summary__divider"></div>

    <dl class="checkout-summary__pricing">
      <div class="checkout-summary__row">
        <dt>{{ $t("checkout.subtotal") }}</dt>
        <dd>{{ checkoutStore.subtotal?.formatted || "0đ" }}</dd>
      </div>

      <div v-if="checkoutStore.savings?.value > 0" class="checkout-summary__row checkout-summary__row--discount">
        <dt>{{ $t("checkout.discount") }}</dt>
        <dd>-{{ checkoutStore.savings?.formatted || "0đ" }}</dd>
      </div>

      <div v-if="checkoutStore.appliedVoucher" class="checkout-summary__row checkout-summary__row--voucher">
        <dt>{{ $t("checkout.voucher") }}</dt>
        <dd>-{{ checkoutStore.voucherDiscount?.formatted || "0đ" }}</dd>
      </div>

      <div v-if="checkoutStore.finalDeliveryFee > 0" class="checkout-summary__row">
        <dt>{{ $t("checkout.deliveryFee") }}</dt>
        <dd>+{{ formatMoneyValue(checkoutStore.finalDeliveryFee) }}</dd>
      </div>

      <div v-if="checkoutStore.finalDeliveryFee === 0" class="checkout-summary__row">
        <dt>{{ $t("checkout.deliveryFee") }}</dt>
        <dd class="checkout-summary__free">{{ $t("checkout.free") }}</dd>
      </div>

      <div v-if="checkoutStore.insuranceFee?.value > 0" class="checkout-summary__row">
        <dt>{{ $t("checkout.insurance") }}</dt>
        <dd>+{{ checkoutStore.insuranceFee?.formatted }}</dd>
      </div>
    </dl>

    <div class="checkout-summary__divider"></div>

    <div class="checkout-summary__total">
      <span>{{ $t("checkout.total") }}</span>
      <span class="checkout-summary__total-value">{{ checkoutStore.finalTotal?.formatted || "0đ" }}</span>
    </div>

    <label class="checkout-summary__agreement">
      <input
        type="checkbox"
        v-model="checkoutStore.agreedToTerms"
        :aria-invalid="agreedError"
      />
      <span>
        {{ $t("checkout.agreeTerms") }}
        <a :href="$t('checkout.termsUrl')" target="_blank" rel="noopener">{{ $t("checkout.terms") }}</a>
        {{ $t("checkout.and") }}
        <a :href="$t('checkout.shippingPolicyUrl')" target="_blank" rel="noopener">{{ $t("checkout.shippingPolicy") }}</a>
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
        <i class="bi bi-arrow-repeat spin"></i>
        {{ $t("checkout.processing") }}
      </span>
      <span v-else>
        <i class="bi bi-credit-card-2-front"></i>
        {{ $t("checkout.placeOrder") }}
      </span>
    </button>

    <div class="checkout-summary__trust">
      <div class="checkout-summary__trust-item">
        <i class="bi bi-shield-lock"></i>
        <span>{{ $t("checkout.securePayment") }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";

defineEmits(["submit"]);

const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();
const { agreedToTerms } = storeToRefs(checkoutStore);

const expanded = ref(false);

const fallbackImage = "https://placehold.co/56x56/f4f4f5/d4d4d8?text=%20";

const agreedError = computed(() => {
  return false;
});

const handleImageError = (e) => {
  e.target.src = fallbackImage;
};

const formatMoneyValue = (value) => {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};

const handleProgressStickyChange = ({ detail }) => {
  const extra = detail.isSticky ? detail.height : 0;
  document.documentElement.style.setProperty("--checkout-summary-offset", `${16 + extra}px`);
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
  top: calc(var(--customer-sidebar-offset, 90px) + var(--checkout-summary-offset, 16px));
}

.checkout-summary__head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.checkout-summary__eyebrow {
  color: #d70018;
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

.checkout-summary__item {
  align-items: flex-start;
  display: flex;
  gap: 12px;
}

.checkout-summary__item-image {
  flex-shrink: 0;
  position: relative;
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

.checkout-summary__item-info {
  flex: 1;
  min-width: 0;
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

.checkout-summary__divider {
  border-top: 1px solid #ececf1;
}

.checkout-summary__pricing {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
}

.checkout-summary__row {
  align-items: center;
  color: #52525b;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
}

.checkout-summary__row dt {
  margin: 0;
}

.checkout-summary__row dd {
  color: #18181b;
  font-weight: 600;
  margin: 0;
}

.checkout-summary__row--discount dd {
  color: #15803d;
}

.checkout-summary__row--voucher dd {
  color: #d70018;
}

.checkout-summary__free {
  color: #15803d !important;
  font-weight: 700 !important;
}

.checkout-summary__total {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.checkout-summary__total > span:first-child {
  color: #18181b;
  font-size: 16px;
  font-weight: 600;
}

.checkout-summary__total-value {
  color: #d70018;
  font-size: 24px;
  font-weight: 700;
}

.checkout-summary__agreement {
  align-items: flex-start;
  cursor: pointer;
  display: flex;
  gap: 10px;
  font-size: 12px;
  line-height: 1.55;
  color: #52525b;
}

.checkout-summary__agreement input[type="checkbox"] {
  margin-top: 2px;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkout-summary__agreement a {
  color: #d70018;
  text-decoration: none;
}

.checkout-summary__agreement a:hover {
  text-decoration: underline;
}

.checkout-summary__agreement-error {
  color: #be123c;
  font-size: 12px;
  margin: -8px 0 0;
}

.checkout-summary__cta {
  align-items: center;
  background: #d70018;
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
  background: #b80015;
  transform: scale(1.02);
}

.checkout-summary__cta:active:not(:disabled) {
  transform: scale(0.98);
}

.checkout-summary__cta:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.checkout-summary__trust {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.checkout-summary__trust-item {
  align-items: center;
  color: #71717a;
  display: flex;
  font-size: 12px;
  gap: 6px;
}

.checkout-summary__trust-item i {
  color: #15803d;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 0.8s linear infinite;
}

@media (max-width: 991.98px) {
  .checkout-summary {
    display: none;
  }
}
</style>
