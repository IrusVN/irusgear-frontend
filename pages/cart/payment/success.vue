<template>
  <section class="order-success-page">
    <div class="container">
      <!-- Loading skeleton -->
      <div v-if="verifyLoading" class="order-success-page__loading">
        <div class="order-success-page__spinner">
          <i class="bi bi-arrow-repeat spin"></i>
        </div>
        <p>{{ $t("orderSuccess.verifying") }}</p>
      </div>

      <!-- Main card -->
      <div v-else class="order-success-page__card">
        <!-- Header: icon + title + message -->
        <div class="order-success-page__icon" :class="isSuccess ? 'order-success-page__icon--success' : 'order-success-page__icon--failed'">
          <i :class="isSuccess ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
        </div>

        <h1 class="order-success-page__title">
          {{ isSuccess ? $t("orderSuccess.title") : $t("orderSuccess.titleFailed") }}
        </h1>
        <p class="order-success-page__message">
          {{ isSuccess ? $t("orderSuccess.orderPlaced") : $t("orderSuccess.transactionFailed") }}
        </p>

        <!-- Order number -->
        <div v-if="orderNumber" class="order-success-page__order-number">
          <span class="order-success-page__label">{{ $t("orderSuccess.orderNumber") }}</span>
          <strong>{{ orderNumber }}</strong>
        </div>

        <!-- Transaction details panel -->
        <div v-if="paymentMethod !== 'cod' || !isSuccess" class="order-success-page__details">
          <h2 class="order-success-page__details-title">
            <i class="bi bi-receipt"></i>
            {{ $t("orderSuccess.transactionDetails") }}
          </h2>

          <!-- VNPay details -->
          <template v-if="isVNPay && vnpayData">
            <div class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.amount") }}</span>
              <span class="order-success-page__detail-val order-success-page__detail-val--highlight">{{ vnpayData.amount }}</span>
            </div>
            <div class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.bank") }}</span>
              <span class="order-success-page__detail-val">{{ vnpayData.bankName }}</span>
            </div>
            <div v-if="vnpayData.cardType !== 'N/A'" class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.cardType") }}</span>
              <span class="order-success-page__detail-val">{{ vnpayData.cardType }}</span>
            </div>
            <div class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.transactionNo") }}</span>
              <span class="order-success-page__detail-val">{{ vnpayData.transactionNo }}</span>
            </div>
            <div v-if="vnpayData.payDate" class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.transactionDate") }}</span>
              <span class="order-success-page__detail-val">{{ vnpayData.payDate }}</span>
            </div>
          </template>

          <!-- MoMo details -->
          <template v-else-if="isMoMo && momoData">
            <div class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.amount") }}</span>
              <span class="order-success-page__detail-val order-success-page__detail-val--highlight">{{ momoData.amount }}</span>
            </div>
            <div class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.momoTransactionId") }}</span>
              <span class="order-success-page__detail-val">{{ momoData.transactionId }}</span>
            </div>
          </template>

          <!-- COD note -->
          <template v-else-if="paymentMethod === 'cod'">
            <div class="order-success-page__cod-note">
              <i class="bi bi-truck"></i>
              {{ $t("orderSuccess.codNote") }}
            </div>
          </template>
        </div>

        <!-- Failure reason banner -->
        <div v-if="!isSuccess && failureReason" class="order-success-page__failure-banner">
          <div class="order-success-page__failure-banner-icon">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>
          <div class="order-success-page__failure-banner-content">
            <strong>{{ $t("orderSuccess.errorReason") }}</strong>
            <span>{{ failureReason }}</span>
          </div>
        </div>

        <!-- Verify error warning -->
        <div v-if="verifyError && !isSuccess" class="order-success-page__verify-warning">
          <i class="bi bi-exclamation-circle"></i>
          {{ $t("orderSuccess.verifyFailed") }}
        </div>

        <!-- Next steps (success only) -->
        <div v-if="isSuccess" class="order-success-page__next-steps">
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

        <!-- Action buttons -->
        <div class="order-success-page__actions">
          <button
            v-if="!isSuccess"
            type="button"
            class="order-success-page__btn order-success-page__btn--secondary"
            @click="navigateTo('/cart')"
          >
            <i class="bi bi-cart3"></i>
            {{ $t("orderSuccess.backToCart") }}
          </button>
          <button
            type="button"
            class="order-success-page__btn order-success-page__btn--primary"
            @click="navigateTo('/')"
          >
            <i class="bi bi-house"></i>
            {{ $t("orderSuccess.gotoHome") }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
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

// ── Data maps ────────────────────────────────────────────────
const bankNameMap = {
  NCB: "Ngân hàng Quốc Dân (NCB)",
  VISA: "Thẻ Visa / Mastercard",
  ATM: "Thẻ ATM",
  MB: "MB Bank",
  VPB: "VPBank",
  VCB: "Vietcombank",
  TCB: "Techcombank",
  CTG: "VietinBank",
  BIDV: "BIDV",
  ACB: "ACB",
  SHB: "SHB",
  HDB: "HDBank",
  MSB: "MSB",
  OCB: "OCB",
  TPB: "TPBank",
  VIB: "VIB",
};

const vnpayResponseCodeMap = {
  "00": "Giao dịch thành công",
  "07": "Giao dịch bị nghi ngờ (liên quan đến hack)",
  "09": "Thẻ chưa đăng ký Internet Banking",
  "10": "Xác thực sai OTP",
  "11": "Hết hạn chọn thanh toán",
  "12": "Thẻ không đủ số dư",
  "13": "Sai mật khẩu thanh toán",
  "24": "Khách hàng hủy giao dịch",
  "51": "Tài khoản không đủ tiền",
  "65": "Vượt quá hạn mức giao dịch",
  "75": "Ngân hàng đang bảo trì",
  "79": "Sai mật khẩu thanh toán (lần thứ 3)",
  "99": "Lỗi không xác định",
};

const momoResultCodeMap = {
  "0": "Giao dịch thành công",
  "1006": "Hủy giao dịch bởi người dùng",
  "1003": "Giao dịch đang xử lý",
  "1001": "Giao dịch bị từ chối",
  "1002": "Sai thông tin thanh toán",
  "1009": "Đơn hàng không tồn tại",
};

// ── Helpers ──────────────────────────────────────────────────
const formatVnpayDate = (dateStr) => {
  if (!dateStr || dateStr.length !== 14) return dateStr || "";
  const y = dateStr.slice(0, 4);
  const m = dateStr.slice(4, 6);
  const d = dateStr.slice(6, 8);
  const h = dateStr.slice(8, 10);
  const min = dateStr.slice(10, 12);
  const s = dateStr.slice(12, 14);
  return `${d}/${m}/${y} ${h}:${min}:${s}`;
};

// ── Gateway detection ────────────────────────────────────────
const isVNPay = computed(() => !!route.query.vnp_TxnRef);
const isMoMo = computed(() => !!route.query.orderId || !!route.query.resultCode);
// ── Parsed gateway data ──────────────────────────────────────
const vnpayData = computed(() => {
  if (!isVNPay.value) return null;
  const code = route.query.vnp_ResponseCode;
  return {
    amount: route.query.vnp_Amount
      ? Number(route.query.vnp_Amount).toLocaleString("vi-VN") + "đ"
      : null,
    bankCode: route.query.vnp_BankCode,
    bankName: bankNameMap[route.query.vnp_BankCode] || route.query.vnp_BankCode || "N/A",
    cardType: route.query.vnp_CardType || "N/A",
    transactionNo: route.query.vnp_TransactionNo || "N/A",
    payDate: formatVnpayDate(route.query.vnp_PayDate),
    responseCode: code,
    isSuccess: code === "00",
    orderInfo: route.query.vnp_OrderInfo || "",
  };
});

const momoData = computed(() => {
  if (!isMoMo.value) return null;
  const code = String(route.query.resultCode || "");
  return {
    amount: route.query.amount
      ? Number(route.query.amount).toLocaleString("vi-VN") + "đ"
      : null,
    transactionId: route.query.transId || route.query.transactionId || "N/A",
    resultCode: code,
    isSuccess: code === "0",
    orderId: route.query.orderId || "N/A",
  };
});

// ── Unified status ───────────────────────────────────────────
const isSuccess = computed(() => {
  if (isVNPay.value) return vnpayData.value?.isSuccess;
  if (isMoMo.value) return momoData.value?.isSuccess;
  return route.query.status === "success" || route.query.status === "paid";
});

const orderNumber = computed(() => {
  if (isVNPay.value) return route.query.vnp_TxnRef;
  if (isMoMo.value) return route.query.orderId;
  return route.query.order_id || checkoutStore.preparedOrderId || "";
});

const paymentMethod = computed(() => {
  if (isVNPay.value) return "vnpay";
  if (isMoMo.value) return "momo";
  return route.query.payment_method || "cod";
});

const failureReason = computed(() => {
  if (isVNPay.value && !vnpayData.value?.isSuccess) {
    return (
      vnpayResponseCodeMap[route.query.vnp_ResponseCode] ||
      `Mã lỗi: ${route.query.vnp_ResponseCode}`
    );
  }
  if (isMoMo.value && !momoData.value?.isSuccess) {
    return (
      momoResultCodeMap[String(route.query.resultCode)] ||
      `Mã lỗi: ${route.query.resultCode}`
    );
  }
  return route.query.message || route.query.error || null;
});

const nextSteps = computed(() => {
  const steps = [
    t("orderSuccess.stepConfirm"),
    t("orderSuccess.stepDelivery"),
  ];
  if (paymentMethod.value === "cod") {
    steps.push(t("orderSuccess.stepCod"));
  }
  return steps;
});

// ── Backend verify ───────────────────────────────────────────
const verifyLoading = ref(true);
const verifyError = ref(false);

onMounted(async () => {
  verifyLoading.value = true;
  try {
    const params = { order_id: orderNumber.value, gateway: paymentMethod.value };
    if (isVNPay.value) {
      Object.entries(route.query).forEach(([k, v]) => {
        if (k.startsWith("vnp_")) params[k] = v;
      });
    } else if (isMoMo.value) {
      ["orderId", "resultCode", "transId", "amount", "message"].forEach((k) => {
        if (route.query[k]) params[k] = route.query[k];
      });
    }
    await checkoutStore.verifyPayment(params);
  } catch {
    verifyError.value = true;
  } finally {
    verifyLoading.value = false;
  }

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

/* Loading */
.order-success-page__loading {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.order-success-page__spinner {
  font-size: 40px;
  color: #71717a;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 0.8s linear infinite;
}

/* Card */
.order-success-page__card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 20px;
  max-width: 560px;
  margin: 0 auto;
  overflow: hidden;
  padding: 40px 32px;
  text-align: center;
}

/* Icon */
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

/* Title & message */
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

/* Order number */
.order-success-page__order-number {
  background: #f9f9fb;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
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

/* Details panel */
.order-success-page__details {
  background: #f9f9fb;
  border-radius: 14px;
  margin-bottom: 16px;
  padding: 16px 18px;
  text-align: left;
}

.order-success-page__details-title {
  align-items: center;
  color: #18181b;
  display: flex;
  font-size: 14px;
  font-weight: 700;
  gap: 6px;
  margin: 0 0 12px;
}

.order-success-page__details-title i {
  color: #d70018;
}

.order-success-page__detail-row {
  align-items: center;
  display: flex;
  font-size: 13px;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f2;
}

.order-success-page__detail-row:last-child {
  border-bottom: none;
}

.order-success-page__detail-key {
  color: #71717a;
  flex-shrink: 0;
}

.order-success-page__detail-val {
  color: #18181b;
  font-weight: 600;
  text-align: right;
  word-break: break-all;
}

.order-success-page__detail-val--highlight {
  color: #d70018;
  font-size: 14px;
}

/* COD note */
.order-success-page__cod-note {
  align-items: center;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  color: #92400e;
  display: flex;
  font-size: 13px;
  gap: 8px;
  padding: 12px 14px;
  text-align: left;
}

.order-success-page__cod-note i {
  flex-shrink: 0;
  font-size: 18px;
}

/* Failure banner */
.order-success-page__failure-banner {
  align-items: flex-start;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 12px;
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 14px 16px;
  text-align: left;
}

.order-success-page__failure-banner-icon {
  color: #be123c;
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 1px;
}

.order-success-page__failure-banner-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.order-success-page__failure-banner-content strong {
  color: #be123c;
  font-size: 14px;
}

.order-success-page__failure-banner-content span {
  color: #9f1239;
  font-size: 13px;
}

/* Verify warning */
.order-success-page__verify-warning {
  align-items: center;
  background: #fffbeb;
  border-radius: 8px;
  color: #d97706;
  display: flex;
  font-size: 12px;
  gap: 6px;
  margin-bottom: 16px;
  padding: 8px 12px;
  text-align: left;
}

/* Next steps */
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

/* Actions */
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
