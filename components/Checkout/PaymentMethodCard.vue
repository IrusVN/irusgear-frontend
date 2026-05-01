<template>
  <button
    type="button"
    class="payment-card"
    :class="{
      'payment-card--selected': selected,
      [`payment-card--${method}`]: true,
    }"
    @click="$emit('select', method)"
  >
    <div class="payment-card__icon">
      <i :class="iconClass"></i>
    </div>
    <div class="payment-card__content">
      <span class="payment-card__name">{{ name }}</span>
      <span class="payment-card__desc">{{ description }}</span>
    </div>
    <div class="payment-card__check">
      <i class="bi bi-check-circle-fill"></i>
    </div>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  method: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["select"]);

const iconClass = computed(() => {
  switch (props.method) {
    case "momo":
      return "bi bi-circle-fill payment-card__icon--momo";
    case "vnpay":
      return "bi bi-credit-card-2-front-fill payment-card__icon--vnpay";
    case "cod":
      return "bi bi-truck payment-card__icon--cod";
    default:
      return "bi bi-wallet2";
  }
});
</script>

<style scoped>
.payment-card {
  align-items: center;
  background: #fff;
  border: 2px solid #e4e4e7;
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  gap: 14px;
  padding: 16px 18px;
  text-align: left;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  width: 100%;
}

.payment-card:hover {
  border-color: #d4d4d8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.payment-card--selected {
  border-color: #d70018;
  box-shadow: 0 0 0 3px rgba(215, 0, 24, 0.1);
}

.payment-card__icon {
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  height: 48px;
  width: 48px;
}

.payment-card__icon--momo {
  background: #fff0f0;
  color: #a50064;
}

.payment-card__icon--vnpay {
  background: #f0f7ff;
  color: #004f9f;
}

.payment-card__icon--cod {
  background: #f0fdf4;
  color: #15803d;
}

.payment-card__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.payment-card__name {
  color: #18181b;
  font-size: 15px;
  font-weight: 700;
}

.payment-card__desc {
  color: #71717a;
  font-size: 13px;
  margin-top: 2px;
}

.payment-card__check {
  color: #d4d4d8;
  font-size: 22px;
  flex-shrink: 0;
  transition: color 0.15s ease;
}

.payment-card--selected .payment-card__check {
  color: #d70018;
}
</style>
