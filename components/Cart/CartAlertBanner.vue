<template>
  <div
    :class="['cart-alert', `cart-alert--${tone}`]"
    role="status"
    aria-live="polite"
  >
    <div class="cart-alert__icon" aria-hidden="true">
      <i :class="iconClass"></i>
    </div>

    <div class="cart-alert__content">
      <p class="cart-alert__title">{{ title }}</p>
      <p v-if="description" class="cart-alert__description">{{ description }}</p>
    </div>

    <div v-if="actionLabel || dismissible" class="cart-alert__actions">
      <button
        v-if="actionLabel"
        type="button"
        class="cart-alert__action"
        @click="$emit('action')"
      >
        {{ actionLabel }}
      </button>

      <button
        v-if="dismissible"
        type="button"
        class="cart-alert__dismiss"
        aria-label="Đóng thông báo"
        @click="$emit('dismiss')"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

defineEmits(["action", "dismiss"]);

const props = defineProps({
  tone: {
    type: String,
    default: "info",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  actionLabel: {
    type: String,
    default: "",
  },
  dismissible: {
    type: Boolean,
    default: false,
  },
});

const iconClass = computed(() => {
  switch (props.tone) {
    case "warning":
      return "bi bi-exclamation-triangle-fill";
    case "success":
      return "bi bi-check-circle-fill";
    default:
      return "bi bi-info-circle-fill";
  }
});
</script>

<style scoped>
.cart-alert {
  align-items: flex-start;
  border: 1px solid transparent;
  border-radius: 22px;
  display: flex;
  gap: 14px;
  margin-bottom: 16px;
  padding: 14px 16px;
}

.cart-alert--info {
  background: #f8fafc;
  border-color: #dbe3f0;
  color: #0f172a;
}

.cart-alert--warning {
  background: #fff7ed;
  border-color: #fed7aa;
  color: #9a3412;
}

.cart-alert--success {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}

.cart-alert__icon {
  align-items: center;
  border-radius: 14px;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 20px;
  height: 38px;
  justify-content: center;
  width: 38px;
}

.cart-alert--info .cart-alert__icon {
  background: #e2e8f0;
}

.cart-alert--warning .cart-alert__icon {
  background: #ffedd5;
}

.cart-alert--success .cart-alert__icon {
  background: #dcfce7;
}

.cart-alert__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.cart-alert__title {
  color: currentColor;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
}

.cart-alert__description {
  color: inherit;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
  opacity: 0.92;
}

.cart-alert__actions {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  gap: 8px;
}

.cart-alert__action,
.cart-alert__dismiss {
  align-items: center;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  color: currentColor;
  display: inline-flex;
  font-size: 12px;
  font-weight: 700;
  justify-content: center;
  min-height: 36px;
}

.cart-alert__action {
  padding: 0 14px;
}

.cart-alert__dismiss {
  width: 36px;
}

@media (max-width: 767.98px) {
  .cart-alert {
    flex-wrap: wrap;
  }

  .cart-alert__actions {
    margin-left: 52px;
  }
}
</style>
