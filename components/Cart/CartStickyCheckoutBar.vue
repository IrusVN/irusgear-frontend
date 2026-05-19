<template>
  <aside class="cart-sticky-checkout" role="complementary" :aria-label="$t('cart.cartSummary')">
    <!-- Row 1: info chips (selected count + savings) -->
    <div v-if="hasInfoRow" class="cart-sticky-checkout__info">
      <span v-if="totalCount > 0" class="cart-sticky-checkout__chip">
        <i class="bi bi-bag-check"></i>
        {{ $t('cart.selectedProducts') }}: <strong>{{ selectedCount }}/{{ totalCount }}</strong>
      </span>

      <span v-if="savings?.value > 0" class="cart-sticky-checkout__chip cart-sticky-checkout__chip--saving">
        <i class="bi bi-tag"></i>
        {{ $t('cart.saving', { amount: savings.formatted }) }}
      </span>
    </div>

    <!-- Row 2: main action -->
    <div class="cart-sticky-checkout__bar">
      <div class="cart-sticky-checkout__meta">
        <span class="cart-sticky-checkout__label">{{ $t('cart.subtotal') }}</span>
        <strong class="cart-sticky-checkout__value">{{ subtotal?.formatted || "0đ" }}</strong>
        <span class="cart-sticky-checkout__delivery">{{ $t('cart.deliveryNote') }}</span>
      </div>

      <button
        type="button"
        class="cart-sticky-checkout__clear"
        :disabled="busy || !hasItems"
        :aria-label="$t('cart.clearAll')"
        @click="$emit('clear')"
      >
        <i class="bi bi-trash3"></i>
      </button>

      <button
        type="button"
        class="cart-sticky-checkout__cta"
        :disabled="busy || !hasItems"
        @click="$emit('checkout')"
      >
        <i class="bi bi-arrow-right-circle"></i>
        <span>{{ buttonLabel }}</span>
      </button>
    </div>

    <!-- Row 3: helper / continue link -->
    <div v-if="helperText || true" class="cart-sticky-checkout__footer">
      <NuxtLink
        :to="localePath('/products')"
        class="cart-sticky-checkout__continue"
      >
        <i class="bi bi-arrow-left"></i>
        {{ $t('cart.continueBuy') }}
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useLocalePath } from "#imports";

defineEmits(["checkout", "clear"]);

const props = defineProps({
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
  // Mobile inline summary — replace CartSummary
  summary: {
    type: Object,
    default: () => ({
      itemCount: 0,
      lineCount: 0,
      hasWarnings: false,
    }),
  },
  selectedCount: {
    type: Number,
    default: 0,
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  helperText: {
    type: String,
    default: "",
  },
});

const localePath = useLocalePath();

const hasInfoRow = computed(() => props.totalCount > 0 || (props.savings?.value || 0) > 0);
</script>

<style scoped>
/* ─── Wrapper: chỉ hiển thị mobile ─── */
.cart-sticky-checkout {
  display: none;
}

@media (max-width: 767.98px) {
  .cart-sticky-checkout {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(228, 228, 231, 0.95);
    border-radius: 22px 22px 0 0;
    bottom: calc(88px + env(safe-area-inset-bottom));
    box-shadow: 0 -10px 28px rgba(15, 23, 42, 0.1);
    display: flex;
    flex-direction: column;
    gap: 8px;
    inset-inline: 0;
    padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
    position: fixed;
    z-index: 120;
  }
}

/* ─── Row 1: info chips ─── */
.cart-sticky-checkout__info {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cart-sticky-checkout__chip {
  align-items: center;
  background: #f7f7f8;
  border-radius: 999px;
  color: #52525b;
  display: inline-flex;
  font-size: 11px;
  font-weight: 600;
  gap: 6px;
  line-height: 1.3;
  padding: 4px 10px;
}

.cart-sticky-checkout__chip i {
  font-size: 12px;
}

.cart-sticky-checkout__chip strong {
  color: #18181b;
  font-weight: 700;
}

.cart-sticky-checkout__chip--saving {
  background: #fff7ed;
  border: 1px solid #fed7aa;
  color: #9a3412;
}

/* ─── Row 2: main action bar ─── */
.cart-sticky-checkout__bar {
  align-items: center;
  display: flex;
  gap: 10px;
}

.cart-sticky-checkout__meta {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.cart-sticky-checkout__label {
  color: #71717a;
  font-size: 11px;
  line-height: 1.3;
}

.cart-sticky-checkout__value {
  color: var(--irus-color-accent);
  font-size: 18px;
  font-weight: 800;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-sticky-checkout__delivery {
  color: #a1a1aa;
  font-size: 10px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-sticky-checkout__clear {
  align-items: center;
  background: #fff;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #b91c1c;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 16px;
  height: 44px;
  justify-content: center;
  width: 44px;
}

.cart-sticky-checkout__clear:hover {
  background: #fef2f2;
}

.cart-sticky-checkout__clear:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.cart-sticky-checkout__cta {
  align-items: center;
  background: var(--irus-color-surface-strong);
  border: 1px solid var(--irus-color-surface-strong);
  border-radius: 14px;
  color: #fff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 800;
  gap: 6px;
  justify-content: center;
  min-height: 44px;
  min-width: 140px;
  padding: 0 14px;
}

.cart-sticky-checkout__cta i {
  font-size: 16px;
}

.cart-sticky-checkout__cta:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* ─── Row 3: footer link + helper ─── */
.cart-sticky-checkout__footer {
  align-items: center;
  border-top: 1px solid #ececf1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
  padding-top: 6px;
}

.cart-sticky-checkout__continue {
  align-items: center;
  color: #18181b;
  display: inline-flex;
  font-size: 12px;
  font-weight: 700;
  gap: 4px;
  text-decoration: none;
}

.cart-sticky-checkout__continue:hover {
  color: var(--irus-color-accent);
}

.cart-sticky-checkout__helper {
  color: #71717a;
  font-size: 11px;
  line-height: 1.4;
  text-align: right;
}

/* ─── Smaller phones ─── */
@media (max-width: 575.98px) {
  .cart-sticky-checkout {
    border-radius: 18px 18px 0 0;
    gap: 6px;
    padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
  }

  .cart-sticky-checkout__chip {
    font-size: 10px;
    padding: 3px 8px;
  }

  .cart-sticky-checkout__value {
    font-size: 16px;
  }

  .cart-sticky-checkout__delivery {
    display: none;
  }

  .cart-sticky-checkout__clear {
    border-radius: 10px;
    height: 40px;
    width: 40px;
    font-size: 14px;
  }

  .cart-sticky-checkout__cta {
    border-radius: 12px;
    font-size: 12px;
    min-height: 40px;
    min-width: 120px;
    padding: 0 12px;
  }

  .cart-sticky-checkout__cta i {
    font-size: 14px;
  }

  .cart-sticky-checkout__continue {
    font-size: 11px;
  }
}

@media (max-width: 380px) {
  .cart-sticky-checkout {
    gap: 4px;
    padding: 6px 10px calc(6px + env(safe-area-inset-bottom));
  }

  .cart-sticky-checkout__bar {
    gap: 6px;
  }

  .cart-sticky-checkout__clear {
    height: 36px;
    width: 36px;
  }

  .cart-sticky-checkout__cta {
    min-height: 38px;
    min-width: 0;
    padding: 0 10px;
  }

  .cart-sticky-checkout__cta i {
    display: none;
  }

  .cart-sticky-checkout__helper {
    display: none;
  }
}
</style>
