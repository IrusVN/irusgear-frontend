<template>
  <aside class="cart-summary">
    <div class="cart-summary__head">
      <p class="cart-summary__eyebrow">Tóm tắt</p>
      <h2 class="cart-summary__title">Thông tin giỏ hàng</h2>
    </div>

    <div v-if="savings?.value > 0" class="cart-summary__saving-pill">
      Bạn đang tiết kiệm <strong>{{ savings.formatted }}</strong> so với mức giá đã lưu trước đó.
    </div>

    <dl class="cart-summary__rows">
      <div class="cart-summary__row">
        <dt>Sản phẩm</dt>
        <dd>{{ summary.itemCount || 0 }}</dd>
      </div>

      <div class="cart-summary__row">
        <dt>Dòng hàng</dt>
        <dd>{{ summary.lineCount || 0 }}</dd>
      </div>

      <div v-if="savings?.value > 0" class="cart-summary__row">
        <dt>Tiết kiệm</dt>
        <dd class="cart-summary__saving">{{ savings.formatted }}</dd>
      </div>

      <div class="cart-summary__row">
        <dt>Giao hàng</dt>
        <dd class="cart-summary__muted">Tính ở bước tiếp theo</dd>
      </div>

      <div class="cart-summary__row cart-summary__row--total">
        <dt>Tạm tính</dt>
        <dd>{{ summary.subtotal?.formatted || "0đ" }}</dd>
      </div>
    </dl>

    <p v-if="summary.hasWarnings" class="cart-summary__warning">
      Một vài sản phẩm đang thay đổi về giá hoặc tồn kho. Bạn nên kiểm tra lại trước khi tiếp tục.
    </p>

    <ul class="cart-summary__trust">
      <li>Giữ nguyên giỏ khi đăng nhập và chuyển thiết bị.</li>
      <li>Giá và tồn kho sẽ được đồng bộ ngay trên giỏ.</li>
      <li>Phù hợp với phong cách mua sắm retail điện tử hiện tại của site.</li>
    </ul>

    <div class="cart-summary__actions">
      <button
        type="button"
        :class="[
          'cart-summary__cta',
          'cart-summary__cta--primary',
          { 'cart-summary__cta--attention': !canCheckout },
        ]"
        :disabled="busy || !hasItems"
        @click="$emit('checkout')"
      >
        {{ primaryActionLabel }}
      </button>

      <NuxtLink :to="localePath('/products')" class="cart-summary__cta cart-summary__cta--secondary">
        Tiếp tục mua
      </NuxtLink>

      <button
        type="button"
        class="cart-summary__cta cart-summary__cta--ghost"
        :disabled="busy || !hasItems"
        @click="$emit('clear')"
      >
        Xóa tất cả
      </button>
    </div>

    <p v-if="helperText" class="cart-summary__helper">
      {{ helperText }}
    </p>
  </aside>
</template>

<script setup>
import { useLocalePath } from "#imports";

defineProps({
  summary: {
    type: Object,
    required: true,
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
  canCheckout: {
    type: Boolean,
    default: true,
  },
  primaryActionLabel: {
    type: String,
    default: "Tiến hành đặt hàng",
  },
  helperText: {
    type: String,
    default: "",
  },
});

defineEmits(["clear", "checkout"]);

const localePath = useLocalePath();
</script>

<style scoped>
.cart-summary {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px;
  position: sticky;
  top: calc(var(--customer-sidebar-offset, 90px) + 16px);
}

.cart-summary__head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-summary__eyebrow {
  color: #d70018;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0;
  text-transform: uppercase;
}

.cart-summary__title {
  color: #18181b;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.cart-summary__saving-pill {
  background: linear-gradient(135deg, #fff7ed, #fff1f2);
  border: 1px solid #fed7aa;
  border-radius: 18px;
  color: #9a3412;
  font-size: 13px;
  line-height: 1.55;
  padding: 12px 14px;
}

.cart-summary__saving-pill strong {
  color: #d70018;
}

.cart-summary__rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
}

.cart-summary__row {
  align-items: center;
  color: #52525b;
  display: flex;
  justify-content: space-between;
}

.cart-summary__row dt,
.cart-summary__row dd {
  margin: 0;
}

.cart-summary__row dd {
  color: #18181b;
  font-weight: 700;
}

.cart-summary__muted {
  color: #71717a !important;
  font-weight: 600 !important;
}

.cart-summary__saving {
  color: #15803d !important;
}

.cart-summary__row--total {
  border-top: 1px solid #ececf1;
  padding-top: 12px;
}

.cart-summary__row--total dt,
.cart-summary__row--total dd {
  color: #18181b;
  font-size: 16px;
}

.cart-summary__row--total dd {
  color: #d70018;
  font-size: 24px;
}

.cart-summary__warning {
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 18px;
  color: #c2410c;
  font-size: 13px;
  line-height: 1.55;
  margin: 0;
  padding: 12px 14px;
}

.cart-summary__trust {
  color: #52525b;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding-left: 18px;
}

.cart-summary__trust li {
  font-size: 13px;
  line-height: 1.5;
}

.cart-summary__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-summary__cta {
  align-items: center;
  border-radius: 16px;
  display: inline-flex;
  font-weight: 800;
  justify-content: center;
  min-height: 50px;
  text-decoration: none;
}

.cart-summary__cta--primary {
  background: #d70018;
  border: 1px solid #d70018;
  color: #fff;
}

.cart-summary__cta--attention {
  background: #fff7ed;
  border-color: #fdba74;
  color: #c2410c;
}

.cart-summary__cta--secondary {
  background: #18181b;
  border: 1px solid #18181b;
  color: #fff;
}

.cart-summary__cta--ghost {
  background: #fff;
  border: 1px solid #e4e4e7;
  color: #18181b;
}

.cart-summary__cta:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.cart-summary__helper {
  color: #71717a;
  font-size: 12px;
  line-height: 1.6;
  margin: 0;
}
</style>
