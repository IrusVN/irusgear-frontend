<template>
  <div class="cart-sticky-checkout">
    <div class="cart-sticky-checkout__meta">
      <span class="cart-sticky-checkout__label">{{ $t('cart.subtotal') }}</span>
      <strong class="cart-sticky-checkout__value">{{ subtotal?.formatted || "0đ" }}</strong>
      <span v-if="savings?.value > 0" class="cart-sticky-checkout__hint">
        {{ $t('cart.hintSave', { amount: savings.formatted }) }}
      </span>
    </div>

    <button
      type="button"
      class="cart-sticky-checkout__cta"
      :disabled="busy || !hasItems"
      @click="$emit('checkout')"
    >
      {{ buttonLabel }}
    </button>
  </div>
</template>

<script setup>
defineEmits(["checkout"]);

defineProps({
  subtotal: {
    type: Object,
    default: () => ({
      value: 0,
      formatted: "0đ",
    }),
  },
  savings: {
    type: Object,
    default: () => ({
      value: 0,
      formatted: "0đ",
    }),
  },
  busy: {
    type: Boolean,
    default: false,
  },
  hasItems: {
    type: Boolean,
    default: false,
  },
  buttonLabel: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.cart-sticky-checkout {
  align-items: center;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(228, 228, 231, 0.95);
  border-radius: 22px 22px 0 0;
  bottom: 0;
  box-shadow: 0 -10px 28px rgba(15, 23, 42, 0.1);
  display: none;
  gap: 12px;
  inset-inline: 0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  position: fixed;
  z-index: 120;
}

.cart-sticky-checkout__meta {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.cart-sticky-checkout__label,
.cart-sticky-checkout__hint {
  color: #71717a;
  font-size: 12px;
  line-height: 1.4;
}

.cart-sticky-checkout__value {
  color: var(--irus-color-accent);
  font-size: 18px;
  font-weight: 800;
  line-height: 1.2;
}

.cart-sticky-checkout__cta {
  align-items: center;
  background: var(--irus-color-surface-strong);
  border: 1px solid var(--irus-color-surface-strong);
  border-radius: 16px;
  color: #fff;
  display: inline-flex;
  font-size: 14px;
  font-weight: 800;
  justify-content: center;
  min-height: 50px;
  min-width: 148px;
  padding: 0 18px;
}

.cart-sticky-checkout__cta:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (max-width: 991.98px) {
  .cart-sticky-checkout {
    display: flex;
    bottom: 88px; /* Đẩy lên trên mobile bottom nav (88px) */
  }
}
</style>
