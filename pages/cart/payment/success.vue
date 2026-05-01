<template>
  <section class="order-success-page">
    <div class="container">
      <div class="order-success-page__card">
        <div class="order-success-page__icon" :class="statusClass">
          <i :class="statusIcon"></i>
        </div>

        <h1 class="order-success-page__title">{{ title }}</h1>
        <p class="order-success-page__message">{{ message }}</p>

        <div v-if="orderNumber" class="order-success-page__order-number">
          <span class="order-success-page__label">{{ $t("orderSuccess.orderNumber") }}</span>
          <strong>{{ orderNumber }}</strong>
        </div>

        <div v-if="paymentMethod" class="order-success-page__payment-info">
          <div class="order-success-page__info-row">
            <span>{{ $t("orderSuccess.paymentMethod") }}</span>
            <span class="order-success-page__payment-method">{{ paymentMethodName }}</span>
          </div>
          <div class="order-success-page__info-row">
            <span>{{ $t("orderSuccess.paymentStatus") }}</span>
            <span :class="paymentStatusClass">
              <i :class="paymentStatusIcon"></i>
              {{ paymentStatusText }}
            </span>
          </div>
        </div>

        <div class="order-success-page__cod-note" v-if="isCodUnpaid">
          <i class="bi bi-info-circle"></i>
          {{ $t("orderSuccess.codNote") }}
        </div>

        <div class="order-success-page__next-steps">
          <h2 class="order-success-page__section-title">{{ $t("orderSuccess.nextSteps") }}</h2>
          <ul class="order-success-page__steps-list">
            <li
              v-for="(step, index) in nextSteps"
              :key="index"
              class="order-success-page__step"
            >
              <span class="order-success-page__step-num">{{ index + 1 }}</span>
              <span>{{ step }}</span>
            </li>
          </ul>
        </div>

        <div class="order-success-page__actions">
          <button type="button" class="order-success-page__btn order-success-page__btn--secondary" @click="navigateTo('/')">
            <i class="bi bi-house"></i>
            {{ $t("orderSuccess.continueShopping") }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "#imports";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";

definePageMeta({
  layout: "default",
});

const { t } = useI18n();
const route = useRoute();
const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();

const status = computed(() => route.query.status || "success");
const orderNumber = computed(() => route.query.order_id || checkoutStore.preparedOrderId || "");
const paymentMethod = computed(() => route.query.payment_method || null);
const paymentStatus = computed(() => route.query.payment_status || "pending");
const transactionId = computed(() => route.query.transaction_id || "");

const isSuccess = computed(() => status.value === "success" || status.value === "paid");

const statusClass = computed(() =>
  isSuccess.value ? "order-success-page__icon--success" : "order-success-page__icon--failed"
);

const statusIcon = computed(() =>
  isSuccess.value ? "bi bi-check-circle-fill" : "bi bi-x-circle-fill"
);

const title = computed(() =>
  isSuccess.value ? t("orderSuccess.title") : t("orderSuccess.titleFailed")
);

const message = computed(() =>
  isSuccess.value ? t("orderSuccess.orderPlaced") : t("payment.failed")
);

const nextSteps = computed(() => {
  return [
    "Chúng tôi sẽ liên hệ xác nhận đơn hàng qua điện thoại",
    "Đơn hàng sẽ được giao trong 1-3 ngày làm việc",
    "Nhận hàng và thanh toán (COD)",
  ];
});

const paymentMethodName = computed(() => {
  switch (paymentMethod.value) {
    case "momo":
      return "MoMo";
    case "vnpay":
      return "VNPay";
    case "cod":
      return "COD";
    default:
      return paymentMethod.value || "-";
  }
});

const paymentStatusClass = computed(() =>
  isSuccess.value || paymentStatus.value === "paid"
    ? "order-success-page__status--paid"
    : "order-success-page__status--unpaid"
);

const paymentStatusIcon = computed(() =>
  isSuccess.value || paymentStatus.value === "paid"
    ? "bi bi-check-circle-fill"
    : "bi bi-clock-fill"
);

const paymentStatusText = computed(() =>
  isSuccess.value || paymentStatus.value === "paid"
    ? t("orderSuccess.paid")
    : t("orderSuccess.unpaid")
);

const isCodUnpaid = computed(
  () => paymentMethod.value === "cod" && paymentStatus.value !== "paid"
);

onMounted(() => {
  if (isSuccess.value) {
    cartStore.clearCart();
    checkoutStore.resetCheckout();
  }
});
</script>

<style scoped>
.order-success-page {
  padding: 40px 0 80px;
}

.order-success-page__card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 20px;
  max-width: 520px;
  margin: 0 auto;
  overflow: hidden;
  padding: 40px 32px;
  text-align: center;
}

.order-success-page__icon {
  align-items: center;
  border-radius: 50%;
  display: flex;
  font-size: 64px;
  height: 96px;
  justify-content: center;
  margin: 0 auto 20px;
  width: 96px;
}

.order-success-page__icon--success {
  background: #f0fdf4;
  color: #15803d;
}

.order-success-page__icon--failed {
  background: #fff1f2;
  color: #be123c;
}

.order-success-page__title {
  color: #18181b;
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 8px;
}

.order-success-page__message {
  color: #71717a;
  font-size: 15px;
  margin: 0 0 24px;
}

.order-success-page__order-number {
  background: #f9f9fb;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
  padding: 14px;
}

.order-success-page__label {
  color: #71717a;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.order-success-page__order-number strong {
  color: #18181b;
  font-size: 18px;
  font-weight: 800;
}

.order-success-page__payment-info {
  background: #f9f9fb;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
  padding: 14px;
  text-align: left;
}

.order-success-page__info-row {
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
}

.order-success-page__info-row > span:first-child {
  color: #71717a;
}

.order-success-page__payment-method {
  color: #18181b;
  font-weight: 700;
}

.order-success-page__status--paid {
  align-items: center;
  color: #15803d;
  display: flex;
  font-weight: 600;
  gap: 4px;
}

.order-success-page__status--unpaid {
  align-items: center;
  color: #d97706;
  display: flex;
  font-weight: 600;
  gap: 4px;
}

.order-success-page__cod-note {
  align-items: flex-start;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  color: #92400e;
  display: flex;
  font-size: 13px;
  gap: 8px;
  margin-bottom: 24px;
  padding: 12px 14px;
  text-align: left;
}

.order-success-page__cod-note i {
  flex-shrink: 0;
  margin-top: 2px;
}

.order-success-page__next-steps {
  background: #f9f9fb;
  border-radius: 14px;
  margin-bottom: 24px;
  padding: 20px;
  text-align: left;
}

.order-success-page__section-title {
  color: #18181b;
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 14px;
}

.order-success-page__steps-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.order-success-page__step {
  align-items: center;
  color: #52525b;
  display: flex;
  font-size: 13px;
  gap: 10px;
}

.order-success-page__step-num {
  align-items: center;
  background: #d70018;
  border-radius: 50%;
  color: #fff;
  display: flex;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  height: 20px;
  justify-content: center;
  width: 20px;
}

.order-success-page__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-success-page__btn {
  align-items: center;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  font-size: 15px;
  font-weight: 700;
  gap: 8px;
  justify-content: center;
  min-height: 48px;
  padding: 12px 24px;
  transition: background 0.15s ease;
}

.order-success-page__btn--primary {
  background: #d70018;
  border: none;
  color: #fff;
}

.order-success-page__btn--primary:hover {
  background: #b80015;
}

.order-success-page__btn--secondary {
  background: #f4f4f5;
  border: none;
  color: #52525b;
}

.order-success-page__btn--secondary:hover {
  background: #e4e4e7;
}
</style>
