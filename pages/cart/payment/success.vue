<template>
  <section class="order-success-page">
    <div class="container">

      <!-- ── Phase: confirming ── -->
      <div v-if="paymentPhase === 'confirming'" class="order-success-page__card">
        <div class="order-success-page__icon order-success-page__icon--confirming">
          <i class="bi bi-arrow-repeat spin"></i>
        </div>
        <h1 class="order-success-page__title">{{ $t("payment.confirmingPayment") }}</h1>
        <p class="order-success-page__message">{{ $t("payment.confirmingDesc") }}</p>

        <div v-if="resolvedOrderId" class="order-success-page__order-number">
          <span class="order-success-page__label">{{ $t("orderSuccess.orderNumber") }}</span>
          <strong>{{ resolvedOrderId }}</strong>
        </div>

        <div class="order-success-page__polling-bar">
          <div class="order-success-page__polling-dots">
            <span></span><span></span><span></span>
          </div>
          <span>{{ $t("payment.pollingIndicator") }}</span>
        </div>
      </div>

      <!-- ── Phase: no-info ── -->
      <div v-else-if="paymentPhase === 'no-info'" class="order-success-page__card">
        <div class="order-success-page__icon order-success-page__icon--failed">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h1 class="order-success-page__title">{{ $t("payment.noPaymentInfo") }}</h1>
        <p class="order-success-page__message">{{ $t("payment.noPaymentInfoDesc") }}</p>
        <div class="order-success-page__actions">
          <button
            type="button"
            class="order-success-page__btn order-success-page__btn--primary"
            @click="navigateTo('/')"
          >
            <i class="bi bi-house"></i>
            {{ $t("orderSuccess.gotoHome") }}
          </button>
          <button
            type="button"
            class="order-success-page__btn order-success-page__btn--secondary"
            @click="navigateTo('/cart')"
          >
            <i class="bi bi-cart3"></i>
            {{ $t("orderSuccess.backToCart") }}
          </button>
        </div>
      </div>

      <!-- ── Phase: confirmed ── -->
      <div v-else-if="paymentPhase === 'confirmed'" class="order-success-page__card">
        <div class="order-success-page__icon order-success-page__icon--success">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <h1 class="order-success-page__title">{{ $t("payment.confirmSuccess") }}</h1>
        <p class="order-success-page__message">{{ $t("orderSuccess.orderPlaced") }}</p>

        <div v-if="order" class="order-success-page__order-number">
          <span class="order-success-page__label">{{ $t("orderSuccess.orderNumber") }}</span>
          <strong>{{ order.orderNumber }}</strong>
        </div>

        <!-- Payment badge -->
        <div v-if="payment" class="order-success-page__payment-badge">
          <i :class="paymentMethod === 'vnpay' ? 'bi bi-credit-card-2-front-fill' : paymentMethod === 'momo' ? 'bi bi-wallet2' : 'bi bi-cash-coin'"></i>
          {{ paymentMethod === 'vnpay' ? 'VNPay' : paymentMethod === 'momo' ? 'MoMo' : 'COD' }}
          <span class="order-success-page__payment-badge-status">
            {{ payment.statusLabel || payment.status }}
          </span>
        </div>

        <!-- Bill: Items -->
        <div v-if="order?.items?.length" class="order-success-page__bill-section">
          <h2 class="order-success-page__bill-title">
            <i class="bi bi-box-seam"></i>
            {{ $t("payment.billItems") }}
          </h2>
          <div class="order-success-page__bill-items">
            <div
              v-for="(item, idx) in order.items"
              :key="idx"
              class="order-success-page__bill-item"
            >
              <img
                :src="item.thumbnail || fallbackImage"
                :alt="item.productName"
                class="order-success-page__bill-item-img"
                loading="lazy"
              />
              <div class="order-success-page__bill-item-info">
                <p class="order-success-page__bill-item-name">{{ item.productName }}</p>
                <p class="order-success-page__bill-item-meta">
                  {{ item.quantity }} × {{ formatMoney(item.price) }}
                </p>
              </div>
              <span class="order-success-page__bill-item-total">
                {{ formatMoney(item.price * item.quantity) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Bill: Pricing -->
        <div class="order-success-page__bill-section">
          <h2 class="order-success-page__bill-title">
            <i class="bi bi-receipt"></i>
            {{ $t("payment.billSummary") }}
          </h2>
          <dl class="order-success-page__bill-pricing">
            <div class="order-success-page__bill-pricing-row">
              <dt>{{ $t("checkout.subtotal") }}</dt>
              <dd>{{ formatMoney(order?.subtotal || 0) }}</dd>
            </div>
            <div v-if="order?.deliveryFee > 0" class="order-success-page__bill-pricing-row">
              <dt>{{ $t("checkout.deliveryFee") }}</dt>
              <dd>{{ formatMoney(order.deliveryFee) }}</dd>
            </div>
            <div v-if="order?.voucherDiscount > 0" class="order-success-page__bill-pricing-row order-success-page__bill-pricing-row--discount">
              <dt>{{ $t("checkout.voucher") }}</dt>
              <dd>-{{ formatMoney(order.voucherDiscount) }}</dd>
            </div>
            <div v-if="order?.freeshipDiscount > 0" class="order-success-page__bill-pricing-row order-success-page__bill-pricing-row--discount">
              <dt>{{ $t("checkout.freeship") }}</dt>
              <dd>-{{ formatMoney(order.freeshipDiscount) }}</dd>
            </div>
            <div class="order-success-page__bill-pricing-total">
              <dt>{{ $t("checkout.total") }}</dt>
              <dd>{{ formatMoney(order?.total || 0) }}</dd>
            </div>
          </dl>
        </div>

        <!-- Bill: Shipping address -->
        <div v-if="order?.shippingAddress" class="order-success-page__bill-section">
          <h2 class="order-success-page__bill-title">
            <i class="bi bi-geo-alt"></i>
            {{ $t("payment.billShipping") }}
          </h2>
          <div class="order-success-page__bill-address">
            <strong>{{ order.shippingAddress.name }}</strong>
            <span>{{ order.shippingAddress.phone }}</span>
            <p>{{ order.shippingAddress.address }}</p>
          </div>
        </div>

        <!-- Bill: Payment info from API -->
        <div v-if="payment" class="order-success-page__bill-section">
          <h2 class="order-success-page__bill-title">
            <i class="bi bi-credit-card"></i>
            {{ $t("payment.billPayment") }}
          </h2>
          <dl class="order-success-page__bill-pricing">
            <div class="order-success-page__bill-pricing-row">
              <dt>{{ $t("orderSuccess.amount") }}</dt>
              <dd class="order-success-page__bill-pricing-row--highlight">{{ formatMoney(payment.amount) }}</dd>
            </div>
            <div v-if="payment.gatewayTransactionId" class="order-success-page__bill-pricing-row">
              <dt>{{ $t("orderSuccess.transactionNo") }}</dt>
              <dd>{{ payment.gatewayTransactionId }}</dd>
            </div>
            <div v-if="payment.paidAt" class="order-success-page__bill-pricing-row">
              <dt>{{ $t("orderSuccess.transactionDate") }}</dt>
              <dd>{{ formatDate(payment.paidAt) }}</dd>
            </div>
          </dl>
        </div>

        <!-- Gateway redirect details (from query params) -->
        <div v-if="(isVNPay && vnpayData) || (isMoMo && momoData)" class="order-success-page__bill-section">
          <h2 class="order-success-page__bill-title">
            <i class="bi bi-info-circle"></i>
            {{ $t("orderSuccess.transactionDetails") }}
          </h2>
          <template v-if="isVNPay && vnpayData">
            <div class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.bank") }}</span>
              <span class="order-success-page__detail-val">{{ vnpayData.bankName }}</span>
            </div>
            <div v-if="vnpayData.cardType !== 'N/A'" class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.cardType") }}</span>
              <span class="order-success-page__detail-val">{{ vnpayData.cardType }}</span>
            </div>
            <div v-if="vnpayData.transactionNo !== 'N/A'" class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.transactionNo") }}</span>
              <span class="order-success-page__detail-val">{{ vnpayData.transactionNo }}</span>
            </div>
            <div v-if="vnpayData.payDate" class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.transactionDate") }}</span>
              <span class="order-success-page__detail-val">{{ vnpayData.payDate }}</span>
            </div>
          </template>
          <template v-else-if="isMoMo && momoData">
            <div class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.momoTransactionId") }}</span>
              <span class="order-success-page__detail-val">{{ momoData.transactionId }}</span>
            </div>
          </template>
        </div>

        <!-- Next steps -->
        <div class="order-success-page__next-steps">
          <h2 class="order-success-page__section-title">{{ $t("orderSuccess.nextSteps") }}</h2>
          <ul class="order-success-page__steps-list">
            <li class="order-success-page__step">
              <span class="order-success-page__step-num">1</span>
              <span>{{ $t("orderSuccess.stepConfirm") }}</span>
            </li>
            <li class="order-success-page__step">
              <span class="order-success-page__step-num">2</span>
              <span>{{ $t("orderSuccess.stepDelivery") }}</span>
            </li>
            <li v-if="paymentMethod === 'cod'" class="order-success-page__step">
              <span class="order-success-page__step-num">3</span>
              <span>{{ $t("orderSuccess.stepCod") }}</span>
            </li>
          </ul>
        </div>

        <div class="order-success-page__actions">
          <button
            type="button"
            class="order-success-page__btn order-success-page__btn--secondary"
            @click="navigateTo('/account/orders')"
          >
            <i class="bi bi-bag"></i>
            {{ $t("payment.viewOrders") }}
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

      <!-- ── Phase: failed ── -->
      <div v-else-if="paymentPhase === 'failed'" class="order-success-page__card">
        <div class="order-success-page__icon order-success-page__icon--failed">
          <i class="bi bi-x-circle-fill"></i>
        </div>
        <h1 class="order-success-page__title">{{ $t("orderSuccess.titleFailed") }}</h1>
        <p class="order-success-page__message">{{ $t("payment.confirmFailed") }}</p>

        <div v-if="resolvedOrderId" class="order-success-page__order-number">
          <span class="order-success-page__label">{{ $t("orderSuccess.orderNumber") }}</span>
          <strong>{{ resolvedOrderId }}</strong>
        </div>

        <div v-if="failureReason" class="order-success-page__failure-banner">
          <div class="order-success-page__failure-banner-icon">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>
          <div class="order-success-page__failure-banner-content">
            <strong>{{ $t("orderSuccess.errorReason") }}</strong>
            <span>{{ failureReason }}</span>
          </div>
        </div>

        <div v-if="(isVNPay && vnpayData) || (isMoMo && momoData)" class="order-success-page__details">
          <h2 class="order-success-page__details-title">
            <i class="bi bi-receipt"></i>
            {{ $t("orderSuccess.transactionDetails") }}
          </h2>
          <template v-if="isVNPay && vnpayData">
            <div class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.amount") }}</span>
              <span class="order-success-page__detail-val order-success-page__detail-val--highlight">{{ vnpayData.amount }}</span>
            </div>
            <div class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.bank") }}</span>
              <span class="order-success-page__detail-val">{{ vnpayData.bankName }}</span>
            </div>
            <div class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.transactionNo") }}</span>
              <span class="order-success-page__detail-val">{{ vnpayData.transactionNo }}</span>
            </div>
          </template>
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
        </div>

        <div v-if="verifyError" class="order-success-page__verify-warning">
          <i class="bi bi-exclamation-circle"></i>
          {{ $t("orderSuccess.verifyFailed") }}
        </div>

        <div class="order-success-page__actions">
          <button
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
            @click="retryVerify"
          >
            <i class="bi bi-arrow-repeat"></i>
            {{ $t("payment.retryConfirm") }}
          </button>
        </div>
      </div>

      <!-- ── Phase: timeout ── -->
      <div v-else-if="paymentPhase === 'timeout'" class="order-success-page__card">
        <div class="order-success-page__icon order-success-page__icon--timeout">
          <i class="bi bi-clock-fill"></i>
        </div>
        <h1 class="order-success-page__title">{{ $t("payment.confirmTimeout") }}</h1>
        <p class="order-success-page__message">{{ $t("payment.confirmTimeoutDesc") }}</p>

        <div v-if="resolvedOrderId" class="order-success-page__order-number">
          <span class="order-success-page__label">{{ $t("orderSuccess.orderNumber") }}</span>
          <strong>{{ resolvedOrderId }}</strong>
        </div>

        <div class="order-success-page__actions">
          <button
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
            @click="retryVerify"
          >
            <i class="bi bi-arrow-repeat"></i>
            {{ $t("payment.retryConfirm") }}
          </button>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "#imports";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";

definePageMeta({
  layout: "default",
});

const route = useRoute();
const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();

// ── State machine: confirming | confirmed | failed | timeout | no-info ──
const paymentPhase = ref("confirming");
const verifiedData = ref(null);
const verifyError = ref(false);
let pollTimer = null;
const MAX_POLLS = 20;
let pollCount = 0;

const fallbackImage = "https://placehold.co/56x56/f4f4f5/d4d4d8?text=%20";

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

const formatMoney = (value = 0) => {
  return `${new Intl.NumberFormat("vi-VN").format(Number(value))}đ`;
};

const formatDate = (isoStr) => {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoStr;
  }
};

// ── Gateway detection ────────────────────────────────────────
const isVNPay = computed(() => !!route.query.vnp_TxnRef);
const isMoMo = computed(() => !!route.query.orderId || !!route.query.resultCode);

// ── Parsed gateway data from redirect query params ──────────────
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

// ── Unified gateway status from query params ───────────────────
const gatewayStatusFromQuery = computed(() => {
  if (isVNPay.value) return vnpayData.value?.isSuccess ? "success" : "failed";
  if (isMoMo.value) return momoData.value?.isSuccess ? "success" : "failed";
  return route.query.status === "success" || route.query.status === "paid" ? "success" : null;
});

const paymentMethod = computed(() => {
  if (isVNPay.value) return "vnpay";
  if (isMoMo.value) return "momo";
  return route.query.payment_method || "cod";
});

// ── Order number resolution ──────────────────────────────────
const resolvedOrderId = computed(() => {
  if (isVNPay.value) return route.query.vnp_TxnRef;
  if (isMoMo.value) return route.query.orderId;
  return route.query.order_id || checkoutStore.preparedOrderId || null;
});

// ── Failure reason ─────────────────────────────────────────────
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

// ── Verified data helpers ────────────────────────────────────
const order = computed(() => verifiedData.value?.order || null);
const payment = computed(() => verifiedData.value?.payment || null);

// ── Polling: verify payment status ───────────────────────────
const doPoll = async () => {
  const orderId = resolvedOrderId.value;
  if (!orderId) return;

  pollCount++;
  try {
    const params = { order_id: orderId, gateway: paymentMethod.value };

    if (isVNPay.value) {
      Object.entries(route.query).forEach(([k, v]) => {
        if (k.startsWith("vnp_")) params[k] = v;
      });
    } else if (isMoMo.value) {
      ["orderId", "resultCode", "transId", "amount", "message"].forEach((k) => {
        if (route.query[k]) params[k] = route.query[k];
      });
    }

    const data = await checkoutStore.verifyPayment(params);

    if (!data) {
      if (pollCount >= MAX_POLLS) {
        paymentPhase.value = "timeout";
        stopPoll();
      }
      return;
    }

    verifiedData.value = data;
    const pStatus = data.payment?.status?.toLowerCase();

    if (pStatus === "completed" || pStatus === "paid" || pStatus === "confirmed") {
      paymentPhase.value = "confirmed";
      cartStore.clearCart();
      checkoutStore.resetCheckout();
      stopPoll();
      return;
    }

    if (pStatus === "failed" || pStatus === "cancelled" || pStatus === "expired") {
      paymentPhase.value = "failed";
      stopPoll();
      return;
    }

    if (pollCount >= MAX_POLLS) {
      paymentPhase.value = "timeout";
      stopPoll();
    }
  } catch {
    verifyError.value = true;
    if (pollCount >= MAX_POLLS) {
      paymentPhase.value = "timeout";
      stopPoll();
    }
  }
};

const startPoll = () => {
  pollTimer = setInterval(doPoll, 3000);
};

const stopPoll = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};

const retryVerify = async () => {
  pollCount = 0;
  verifyError.value = false;
  paymentPhase.value = "confirming";
  await doPoll();
  if (paymentPhase.value === "confirming") {
    startPoll();
  }
};

// ── Lifecycle ────────────────────────────────────────────────
onMounted(async () => {
  // Neu page load trong popup (window.opener ton tai)
  // -> gui message cho main tab roi dong popup
  // Day la truong hop user thanh toan VNPay thanh cong tren desktop popup
  if (window.opener) {
    const queryString = window.location.search;
    if (queryString) {
      window.opener.postMessage({ type: "PAYMENT_DONE", queryString }, "*");
    }
    // Delay nho de message kip gui truoc khi dong
    setTimeout(() => window.close(), 500);
    return;
  }

  const orderId = resolvedOrderId.value;

  if (!orderId) {
    paymentPhase.value = "no-info";
    return;
  }

  if (gatewayStatusFromQuery.value === "failed") {
    paymentPhase.value = "failed";
    startPoll();
    return;
  }

  paymentPhase.value = "confirming";
  await doPoll();
  if (paymentPhase.value === "confirming") {
    startPoll();
  }
});

onUnmounted(stopPoll);
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

/* Icon states mới */
.order-success-page__icon--confirming {
  background: #fffbeb;
  color: #d97706;
}

.order-success-page__icon--timeout {
  background: #fff7ed;
  color: #ea580c;
}

/* Polling bar */
.order-success-page__polling-bar {
  align-items: center;
  background: #f9f9fb;
  border-radius: 10px;
  color: #71717a;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  gap: 8px;
  padding: 16px;
  text-align: center;
}

.order-success-page__polling-dots {
  display: flex;
  gap: 6px;
}

.order-success-page__polling-dots span {
  background: #d70018;
  border-radius: 50%;
  display: block;
  height: 8px;
  width: 8px;
  animation: pollingPulse 1.4s ease-in-out infinite both;
}

.order-success-page__polling-dots span:nth-child(1) { animation-delay: -0.32s; }
.order-success-page__polling-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes pollingPulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

/* Payment badge */
.order-success-page__payment-badge {
  align-items: center;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #15803d;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  gap: 6px;
  margin-bottom: 12px;
  padding: 8px 14px;
}

.order-success-page__payment-badge-status {
  background: #dcfce7;
  border-radius: 20px;
  color: #15803d;
  font-size: 12px;
  font-weight: 600;
  margin-left: auto;
  padding: 2px 8px;
}

/* Bill sections */
.order-success-page__bill-section {
  background: #f9f9fb;
  border-radius: 14px;
  margin-bottom: 12px;
  padding: 16px;
  text-align: left;
}

.order-success-page__bill-title {
  align-items: center;
  color: #18181b;
  display: flex;
  font-size: 14px;
  font-weight: 700;
  gap: 6px;
  margin: 0 0 12px;
}

.order-success-page__bill-title i {
  color: #d70018;
}

.order-success-page__bill-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-success-page__bill-item {
  align-items: center;
  display: flex;
  gap: 10px;
}

.order-success-page__bill-item-img {
  border-radius: 8px;
  flex-shrink: 0;
  height: 48px;
  object-fit: cover;
  width: 48px;
}

.order-success-page__bill-item-info {
  flex: 1;
  min-width: 0;
}

.order-success-page__bill-item-name {
  color: #18181b;
  font-size: 13px;
  font-weight: 500;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-success-page__bill-item-meta {
  color: #71717a;
  font-size: 12px;
  margin: 2px 0 0;
}

.order-success-page__bill-item-total {
  color: #18181b;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.order-success-page__bill-pricing {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.order-success-page__bill-pricing-row {
  align-items: center;
  display: flex;
  font-size: 13px;
  justify-content: space-between;
}

.order-success-page__bill-pricing-row dt {
  color: #71717a;
  margin: 0;
}

.order-success-page__bill-pricing-row dd {
  color: #18181b;
  font-weight: 600;
  margin: 0;
}

.order-success-page__bill-pricing-row--discount dt,
.order-success-page__bill-pricing-row--discount dd {
  color: #15803d;
}

.order-success-page__bill-pricing-row--highlight {
  color: #d70018 !important;
  font-size: 15px !important;
}

.order-success-page__bill-pricing-total {
  align-items: center;
  border-top: 2px solid #18181b;
  display: flex;
  font-size: 16px;
  font-weight: 700;
  justify-content: space-between;
  margin-top: 4px;
  padding-top: 8px;
}

.order-success-page__bill-pricing-total dt {
  color: #18181b;
  margin: 0;
}

.order-success-page__bill-pricing-total dd {
  color: #d70018 !important;
  font-size: 18px !important;
  margin: 0;
}

.order-success-page__bill-address {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.order-success-page__bill-address strong {
  color: #18181b;
  font-size: 14px;
}

.order-success-page__bill-address span {
  color: #71717a;
  font-size: 13px;
}

.order-success-page__bill-address p {
  color: #52525b;
  font-size: 13px;
  margin: 4px 0 0;
}
</style>
