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
    <div class="payment-card__icon" :class="{ 'payment-card__icon--cod': method === 'cod' }">
      <img
        v-if="method === 'momo'"
        src="https://homepage.momocdn.net/fileuploads/svg/momo-file-240411162904.svg"
        alt="MoMo"
        class="payment-card__logo"
      />
      <img
        v-else-if="method === 'vnpay'"
        src="https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg"
        alt="VNPay"
        class="payment-card__logo"
      />
      <i v-else :class="iconClass"></i>
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
    case "cod":
      return "bi bi-truck";
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
  background: #a50064;
  padding: 8px;
}

.payment-card__icon--vnpay {
  background: #f0f7ff;
  padding: 6px;
}

.payment-card__icon--cod {
  background: #f0fdf4;
  color: #15803d;
}

.payment-card__logo {
  height: 32px;
  object-fit: contain;
  width: 32px;
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
