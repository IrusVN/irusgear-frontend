<template>
  <section class="payment-page">
    <div class="container-xl">
      <CheckoutProgress :current-step="3" />

      <div v-if="!checkoutStore.preparedSessionId" class="payment-page__no-order">
        <i class="bi bi-exclamation-triangle"></i>
        <p>{{ $t("payment.noPreparedOrder") }}</p>
        <button type="button" class="btn-back" @click="navigateTo('/cart/checkout')">
          <i class="bi bi-arrow-left"></i>
          {{ $t("common.back") }}
        </button>
      </div>

      <div v-else class="d-flex flex-column flex-lg-row gap-4">
        <div class="flex-grow-1 minw-0">
          <div class="payment-page__section">
            <h2 class="payment-page__title">
              <i class="bi bi-credit-card-2-front"></i>
              {{ $t("payment.title") }}
            </h2>

            <PaymentMethodList
              :methods="paymentMethods"
              :selected-method="selectedMethod"
              @select="handleSelectMethod"
            />
          </div>
        </div>

        <div class="payment-page__summary-col">
          <div class="payment-page__summary">
            <p class="payment-page__summary-eyebrow">{{ $t("checkout.orderSummary") }}</p>

            <div class="payment-page__summary-items">
              <div
                v-for="item in cartStore.selectedItems"
                :key="item.id"
                class="payment-page__summary-item"
              >
                <img
                  :src="item.thumbnail || fallbackImage"
                  :alt="item.productName"
                  class="payment-page__summary-img"
                  loading="lazy"
                />
                <div class="payment-page__summary-info">
                  <p class="payment-page__summary-name">{{ item.productName }}</p>
                  <p class="payment-page__summary-meta">
                    {{ item.quantity }} × {{ item.unitPrice?.formatted || "0đ" }}
                  </p>
                </div>
                <span class="payment-page__summary-price">
                  {{ item.currentLineTotal?.formatted || "0đ" }}
                </span>
              </div>
            </div>

            <div class="payment-page__summary-divider"></div>

            <dl class="payment-page__summary-pricing">
              <div class="payment-page__summary-row">
                <dt>{{ $t("checkout.subtotal") }}</dt>
                <dd>{{ checkoutStore.subtotal?.formatted || "0đ" }}</dd>
              </div>
              <div v-if="checkoutStore.savings?.value > 0" class="payment-page__summary-row">
                <dt>{{ $t("checkout.discount") }}</dt>
                <dd class="text-success">-{{ checkoutStore.savings?.formatted }}</dd>
              </div>
              <div v-if="checkoutStore.voucherDiscount?.value > 0" class="payment-page__summary-row">
                <dt>{{ $t("checkout.voucher") }}</dt>
                <dd class="text-success">-{{ checkoutStore.voucherDiscount?.formatted }}</dd>
              </div>
              <div class="payment-page__summary-row">
                <dt>{{ $t("checkout.deliveryFee") }}</dt>
                <dd>
                  {{
                    checkoutStore.finalDeliveryFee > 0
                      ? formatMoney(checkoutStore.finalDeliveryFee)
                      : $t("checkout.free")
                  }}
                </dd>
              </div>
              <div v-if="checkoutStore.insuranceFee?.value > 0" class="payment-page__summary-row">
                <dt>{{ $t("checkout.insurance") }}</dt>
                <dd>+{{ checkoutStore.insuranceFee?.formatted }}</dd>
              </div>
              <div class="payment-page__summary-total">
                <strong>{{ $t("checkout.total") }}</strong>
                <strong class="payment-page__summary-total-value">
                  {{ checkoutStore.finalTotal?.formatted || "0đ" }}
                </strong>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile sticky checkout bar — thay cho summary-col bị ẩn -->
    <aside
      v-if="checkoutStore.preparedSessionId"
      class="payment-page__sticky-bar"
      role="complementary"
      :aria-label="$t('checkout.orderSummary')"
    >
      <!-- Row 0: horizontal scroll product list -->
      <div v-if="cartStore.selectedItems.length" class="payment-page__sticky-products">
        <div
          v-for="item in cartStore.selectedItems"
          :key="item.id"
          class="payment-page__sticky-product"
        >
          <img
            :src="item.thumbnail || fallbackImage"
            :alt="item.productName"
            class="payment-page__sticky-product-img"
            loading="lazy"
          >
          <div class="payment-page__sticky-product-info">
            <span class="payment-page__sticky-product-name">{{ item.productName }}</span>
            <span class="payment-page__sticky-product-meta">
              {{ item.quantity }} × {{ item.unitPrice?.formatted || "0đ" }}
            </span>
          </div>
        </div>
      </div>

      <!-- Row 1: chips info -->
      <div v-if="hasInfoRow" class="payment-page__sticky-info">
        <span class="payment-page__sticky-chip">
          <i class="bi bi-bag-check"></i>
          {{ $t("cart.products") }}: <strong>{{ cartStore.selectedItems.length }}</strong>
        </span>

        <span
          v-if="(checkoutStore.savings?.value || 0) > 0"
          class="payment-page__sticky-chip payment-page__sticky-chip--saving"
        >
          <i class="bi bi-tag"></i>
          {{ $t("cart.saving", { amount: checkoutStore.savings.formatted }) }}
        </span>
      </div>

      <!-- Row 2: meta + CTA -->
      <div class="payment-page__sticky-row">
        <div class="payment-page__sticky-meta">
          <span class="payment-page__sticky-label">{{ $t("checkout.total") }}</span>
          <strong class="payment-page__sticky-value">
            {{ checkoutStore.finalTotal?.formatted || "0đ" }}
          </strong>
          <span v-if="checkoutStore.finalDeliveryFee > 0" class="payment-page__sticky-hint">
            {{ $t("checkout.deliveryFee") }}: {{ formatMoney(checkoutStore.finalDeliveryFee) }}
          </span>
          <span v-else class="payment-page__sticky-hint">
            {{ $t("checkout.deliveryFee") }}: {{ $t("checkout.free") }}
          </span>
        </div>

        <button
          type="button"
          class="payment-page__submit-btn"
          :disabled="!selectedMethod || loadingMethod"
          @click="handlePayment"
        >
          <span v-if="loadingMethod" class="payment-page__submit-btn-content">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ $t("payment.processing") }}
          </span>
          <span v-else class="payment-page__submit-btn-content">
            <i class="bi bi-shield-lock"></i>
            {{ $t("payment.proceedToPayment") }}
          </span>
        </button>
      </div>

      <!-- Row 3: footer link (mobile only) -->
      <div class="payment-page__sticky-footer">
        <button
          type="button"
          class="payment-page__sticky-back"
          @click="navigateTo('/cart/checkout')"
        >
          <i class="bi bi-arrow-left"></i>
          {{ $t("common.back") }}
        </button>

        <span v-if="!selectedMethod" class="payment-page__sticky-helper">
          {{ $t("payment.selectMethodFirst") }}
        </span>
      </div>
    </aside>

    <QrPaymentModal
      :show="showQrModal"
      :pay-url="selectedPayUrl"
      :method="selectedMethod || ''"
      :amount="checkoutStore.finalTotal?.value"
      :order-id="selectedPayData?.orderId || checkoutStore.preparedOrderId"
      :session-id="checkoutStore.preparedSessionId"
      :expires-at="selectedExpiresAt"
      :popup="paymentPopup"
      @close="showQrModal = false"
      @cancel="handleQrCancel"
      @expired="handleQrExpired"
      @success="handleQrSuccess"
      @failed="handleQrFailed"
      @retry="handleQrRetry"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { toast } from "vue-sonner";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";
import { useDeviceDetection } from "@/composables/useDeviceDetection";
import CheckoutProgress from "@/components/Checkout/CheckoutProgress.vue";
import PaymentMethodList from "@/components/Checkout/PaymentMethodList.vue";
import QrPaymentModal from "@/components/Checkout/QrPaymentModal.vue";

definePageMeta({
  layout: "default",
  middleware: ['auth-guard'],
});

const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();
const { isMobile } = useDeviceDetection();

const selectedMethod = ref(null);
const loadingMethod = ref(false);
const showQrModal = ref(false);
const selectedPayUrl = ref("");
const selectedPayData = ref(null);
const selectedExpiresAt = ref(null);
const paymentPopup = ref(null);

const fallbackImage = "https://placehold.co/56x56/f4f4f5/d4d4d8?text=%20";

const paymentMethods = computed(() => [
  {
    id: "cod",
    name: "Thanh toán khi nhận hàng (COD)",
    description: "Trả tiền mặt khi nhận được hàng",
  },
  {
    id: "paypal",
    name: "Ví PayPal",
    description: "Thanh toán qua ví PayPal - Nhanh chóng và an toàn",
  },
  {
    id: "vnpay",
    name: "VNPay",
    description: "Thanh toán qua cổng VNPay - Hỗ trợ 40+ ngân hàng",
  },
]);

const hasInfoRow = computed(
  () => cartStore.selectedItems.length > 0 || (checkoutStore.savings?.value || 0) > 0,
);

const handleSelectMethod = (method) => {
  if (selectedMethod.value && selectedMethod.value !== method) {
    resetPaymentAttempt();
  }

  selectedMethod.value = method;
};

const handlePayment = async () => {
  if (!selectedMethod.value) {
    toast.warning("Vui lòng chọn phương thức thanh toán");
    return;
  }

  loadingMethod.value = selectedMethod.value;

  try {
    if (selectedMethod.value === "cod") {
      await checkoutStore.createOrder("cod");
      await navigateTo("/cart/success");
      return;
    }

    const data = await checkoutStore.createPayment(selectedMethod.value);
    selectedPayData.value = data;
    selectedPayUrl.value = data.payUrl;
    selectedExpiresAt.value = data.expiresAt || null;

    if (isMobile()) {
      window.location.href = data.payUrl;
    } else {
      openPaymentPopup(data.payUrl);
      showQrModal.value = true;
    }
  } catch (e) {
    toast.error(e?.data?.message || "Tạo thanh toán thất bại");
    resetPaymentAttempt();
  } finally {
    loadingMethod.value = false;
  }
};

/**
 * Mo VNPay/MoMo trong popup window.open.
 * Modal component tu dong phat hien popup dong va hien thi trang thai.
 */
const openPaymentPopup = (payUrl) => {
  // Dong popup cu (neu co)
  closePaymentPopup();

  const popupWidth = 500;
  const popupHeight = 700;
  const left = window.screenX + (window.outerWidth - popupWidth) / 2;
  const top = window.screenY + (window.outerHeight - popupHeight) / 2;

  paymentPopup.value = window.open(
    payUrl,
    "paymentPopup",
    `width=${popupWidth},height=${popupHeight},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
  );

  // Neu popup bi block boi browser (tra ve null), khong lam gi ca
  // Modal van hien thi trang thai cho user
  startPopupClosedWatcher();
};

// Watcher detect khi popup bị đóng (user tự đóng HOẶC backend gọi window.close()).
// Cần thiết vì cross-origin popup (api.irusgear.me → irusgear.me) có thể bị COOP block
// → postMessage không reach FE → handler không fire → FE stuck tại /cart/payment.
// Fallback: khi popup closed mà chưa nhận PAYMENT_DONE, query verify API để biết status.
let popupClosedInterval = null;
let paymentDoneHandled = false;

const startPopupClosedWatcher = () => {
  stopPopupClosedWatcher();
  paymentDoneHandled = false;
  if (!paymentPopup.value) return;

  popupClosedInterval = window.setInterval(async () => {
    if (!paymentPopup.value || paymentPopup.value.closed) {
      stopPopupClosedWatcher();
      if (paymentDoneHandled) return; // postMessage đã xử lý xong → bỏ qua
      await verifyAndNavigateAfterPopupClosed();
    }
  }, 800);
};

const stopPopupClosedWatcher = () => {
  if (popupClosedInterval !== null) {
    window.clearInterval(popupClosedInterval);
    popupClosedInterval = null;
  }
};

const verifyAndNavigateAfterPopupClosed = async () => {
  const orderRef = checkoutStore.preparedIdemKey
    || checkoutStore.preparedOrderId
    || selectedPayData.value?.orderId;
  if (!orderRef) {
    showQrModal.value = false;
    selectedMethod.value = null;
    return;
  }

  try {
    const result = await checkoutStore.verifyPayment({
      order_id: orderRef,
      gateway: selectedMethod.value || "paypal",
    });
    const status = result?.payment?.status;
    const orderNumber = result?.order?.orderNumber;

    if (status === "completed" || status === "paid") {
      showQrModal.value = false;
      await navigateTo(
        `/cart/success?order_id=${orderNumber || orderRef}&payment_method=${selectedMethod.value || "paypal"}`
      );
    } else if (status === "failed" || status === "cancelled") {
      showQrModal.value = false;
      toast.error("Thanh toán không thành công hoặc đã bị huỷ.");
      selectedMethod.value = null;
    } else {
      // Vẫn pending — backend webhook chưa confirm xong; cho user retry
      showQrModal.value = false;
      toast.warning("Chưa nhận được xác nhận từ cổng thanh toán. Vui lòng thử lại hoặc kiểm tra đơn hàng.");
      selectedMethod.value = null;
    }
  } catch (e) {
    showQrModal.value = false;
    toast.error(e?.data?.message || "Không thể xác minh trạng thái thanh toán.");
    selectedMethod.value = null;
  }
};

const closePaymentPopup = () => {
  stopPopupClosedWatcher();
  if (paymentPopup.value && !paymentPopup.value.closed) {
    paymentPopup.value.close();
  }
  paymentPopup.value = null;
};

const resetPaymentAttempt = () => {
  showQrModal.value = false;
  selectedPayUrl.value = "";
  selectedPayData.value = null;
  selectedExpiresAt.value = null;
  closePaymentPopup();
};

const handleQrCancel = () => {
  resetPaymentAttempt();
};

const handleQrExpired = () => {
  resetPaymentAttempt();
  toast.warning("Mã thanh toán đã hết hạn. Vui lòng tạo mã mới.");
  selectedMethod.value = null;
};

const handleQrSuccess = async (paymentData) => {
  resetPaymentAttempt();
  await navigateTo(`/cart/success?order_id=${paymentData.orderId || checkoutStore.preparedOrderId}`);
};

const handleQrFailed = (reason) => {
  resetPaymentAttempt();
  toast.error(reason || "Thanh toán không thành công");
};

const handleQrRetry = async () => {
  showQrModal.value = false;
  closePaymentPopup();
  if (selectedPayUrl.value) {
    openPaymentPopup(selectedPayUrl.value);
    showQrModal.value = true;
  } else {
    await handlePayment();
  }
};

// Nhận postMessage từ popup khi thanh toán thành công.
// Backend vnpayReturn trả HTML page gửi message rồi đóng popup.
// Gateway chỉ redirect khi payment đã confirmed → navigate ngay, không cần poll.
const handlePopupMessage = async (event) => {
  const data = event.data;
  if (data?.type !== "PAYMENT_DONE") return;

  // Đánh dấu đã xử lý để popup-closed watcher không gọi verify lần nữa (tránh double navigate)
  paymentDoneHandled = true;
  stopPopupClosedWatcher();

  showQrModal.value = false;
  closePaymentPopup();

  if (data.status === "failed") {
    toast.error("Thanh toán không thành công.");
    selectedMethod.value = null;
    return;
  }

  if (data.status === "cancelled") {
    toast.warning("Bạn đã huỷ thanh toán.");
    selectedMethod.value = null;
    return;
  }

  const orderId = data.orderId || checkoutStore.preparedOrderId;
  if (orderId) {
    // Dùng paymentMethod từ backend (không hardcode vnpay) — đúng cho mọi gateway
    const method = data.paymentMethod || selectedMethod.value || "vnpay";
    await navigateTo(`/cart/success?order_id=${orderId}&payment_method=${method}`);
  } else {
    selectedMethod.value = null;
  }
};

const formatMoney = (value) => {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};

onMounted(() => {
  window.addEventListener("message", handlePopupMessage);
});

onUnmounted(() => {
  closePaymentPopup();
  window.removeEventListener("message", handlePopupMessage);
});
</script>

<style scoped>
.payment-page {
  padding: 18px 0 140px;
}

.payment-page__no-order {
  align-items: center;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 16px;
  color: #71717a;
  display: flex;
  flex-direction: column;
  font-size: 15px;
  gap: 16px;
  padding: 60px 20px;
  text-align: center;
}

.payment-page__no-order i {
  font-size: 48px;
  color: var(--irus-color-accent);
}

.btn-back {
  background: #f4f4f5;
  border: none;
  border-radius: 10px;
  color: #52525b;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 20px;
  transition: background 0.15s ease;
}

.btn-back:hover {
  background: #e4e4e7;
}

.payment-page__section {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 20px;
}

.payment-page__title {
  align-items: center;
  color: #18181b;
  display: flex;
  font-size: 18px;
  font-weight: 700;
  gap: 10px;
  margin: 0 0 16px;
}

.payment-page__title i {
  color: var(--irus-color-accent);
}

.payment-page__summary-col {
  flex-shrink: 0;
  width: 380px;
}

.payment-page__summary {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 20px;
  position: sticky;
  top: 20px;
}

.payment-page__summary-eyebrow {
  color: #71717a;
  font-size: 12px;
  font-weight: 600;
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.payment-page__summary-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.payment-page__summary-item {
  align-items: center;
  display: flex;
  gap: 10px;
}

.payment-page__summary-img {
  border-radius: 8px;
  flex-shrink: 0;
  height: 48px;
  object-fit: cover;
  width: 48px;
}

.payment-page__summary-info {
  flex: 1;
  min-width: 0;
}

.payment-page__summary-name {
  color: #18181b;
  font-size: 13px;
  font-weight: 500;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.payment-page__summary-meta {
  color: #71717a;
  font-size: 12px;
  margin: 2px 0 0;
}

.payment-page__summary-price {
  color: #18181b;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.payment-page__summary-divider {
  border-top: 1px solid #f0f0f2;
  margin: 14px 0;
}

.payment-page__summary-pricing {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.payment-page__summary-row {
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
}

.payment-page__summary-row dt {
  color: #71717a;
  margin: 0;
}

.payment-page__summary-row dd {
  color: #18181b;
  font-weight: 600;
  margin: 0;
}

.payment-page__summary-total {
  align-items: center;
  border-top: 2px solid #18181b;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  margin-top: 4px;
  padding-top: 10px;
}

.payment-page__summary-total strong:first-child {
  color: #18181b;
}

.payment-page__summary-total-value {
  color: var(--irus-color-accent) !important;
  font-size: 20px !important;
}

/* ──────────────────────────────────────────
 * Desktop sticky bar (full-width CTA)
 * ────────────────────────────────────────── */
.payment-page__sticky-bar {
  background: #fff;
  border-top: 1px solid #ececf1;
  bottom: 0;
  display: block;
  left: 0;
  padding: 14px 16px;
  position: fixed;
  right: 0;
  z-index: 100;
}

.payment-page__sticky-info {
  display: none;
}

.payment-page__sticky-products {
  display: none;
}

.payment-page__sticky-row {
  display: flex;
  gap: 12px;
  margin: 0 auto;
  max-width: 1200px;
}

.payment-page__sticky-meta {
  display: none;
}

.payment-page__sticky-footer {
  display: none;
}

.payment-page__submit-btn {
  background: var(--irus-color-surface-strong);
  border: none;
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  gap: 8px;
  justify-content: center;
  min-height: 52px;
  padding: 12px 24px;
  transition: background 0.15s ease, transform 0.15s ease;
  width: 100%;
}

.payment-page__submit-btn-content {
  align-items: center;
  display: inline-flex;
  gap: 8px;
}

.payment-page__submit-btn:hover:not(:disabled) {
  background: #1a1a1a;
  transform: translateY(-1px);
}

.payment-page__submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ──────────────────────────────────────────
 * Tablet
 * ────────────────────────────────────────── */
@media (max-width: 991.98px) {
  .payment-page {
    padding-bottom: 170px;
  }

  .payment-page__summary-col {
    width: 100%;
  }
}

/* ──────────────────────────────────────────
 * Mobile: ẩn summary-col, hiện sticky bar 3 row giống Cart
 * ────────────────────────────────────────── */
@media (max-width: 767.98px) {
  .payment-page {
    padding-bottom: 240px;
  }

  /* Ẩn sidebar summary-col — đã có sticky bar bên dưới */
  .payment-page__summary-col {
    display: none;
  }

  .payment-page__section {
    border-radius: 14px;
    padding: 16px;
  }

  .payment-page__title {
    font-size: 16px;
    margin-bottom: 14px;
  }

  .payment-page__no-order {
    border-radius: 14px;
    padding: 48px 16px;
  }

  /* Sticky bar 3 hàng */
  .payment-page__sticky-bar {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(228, 228, 231, 0.95);
    border-radius: 22px 22px 0 0;
    bottom: calc(88px + env(safe-area-inset-bottom));
    box-shadow: 0 -10px 28px rgba(15, 23, 42, 0.1);
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
  }

  /* Row 0: horizontal product list */
  .payment-page__sticky-products {
    -webkit-overflow-scrolling: touch;
    display: flex;
    gap: 8px;
    margin: 0 -14px;
    overflow-x: auto;
    padding: 0 14px 4px;
    scrollbar-width: none;
  }

  .payment-page__sticky-products::-webkit-scrollbar {
    display: none;
  }

  .payment-page__sticky-product {
    align-items: center;
    background: #f7f7f8;
    border: 1px solid #ececf1;
    border-radius: 12px;
    display: flex;
    flex-shrink: 0;
    gap: 8px;
    max-width: 200px;
    min-width: 120px;
    padding: 6px 10px 6px 6px;
  }

  .payment-page__sticky-product-img {
    background: #fff;
    border: 1px solid #ececf1;
    border-radius: 8px;
    flex-shrink: 0;
    height: 36px;
    object-fit: cover;
    width: 36px;
  }

  .payment-page__sticky-product-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .payment-page__sticky-product-name {
    color: #18181b;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .payment-page__sticky-product-meta {
    color: #71717a;
    font-size: 10px;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Row 1: chips */
  .payment-page__sticky-info {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .payment-page__sticky-chip {
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

  .payment-page__sticky-chip i {
    font-size: 12px;
  }

  .payment-page__sticky-chip strong {
    color: #18181b;
    font-weight: 700;
  }

  .payment-page__sticky-chip--saving {
    background: #fff7ed;
    border: 1px solid #fed7aa;
    color: #9a3412;
  }

  /* Row 2: meta + CTA */
  .payment-page__sticky-row {
    align-items: center;
    display: flex;
    gap: 10px;
    justify-content: space-between;
    margin: 0;
    max-width: none;
    width: 100%;
  }

  .payment-page__sticky-meta {
    display: flex;
    flex: 0 1 auto;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .payment-page__sticky-label {
    color: #71717a;
    font-size: 11px;
    line-height: 1.3;
  }

  .payment-page__sticky-value {
    color: var(--irus-color-accent);
    font-size: 18px;
    font-weight: 800;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .payment-page__sticky-hint {
    color: #a1a1aa;
    font-size: 10px;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .payment-page__submit-btn {
    border-radius: 14px;
    flex-shrink: 0;
    font-size: 13px;
    min-height: 44px;
    min-width: 140px;
    padding: 0 14px;
    width: auto;
  }

  /* Row 3: footer link + helper */
  .payment-page__sticky-footer {
    align-items: center;
    border-top: 1px solid #ececf1;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: space-between;
    padding-top: 6px;
  }

  .payment-page__sticky-back {
    align-items: center;
    background: none;
    border: 0;
    color: #18181b;
    cursor: pointer;
    display: inline-flex;
    font-size: 12px;
    font-weight: 700;
    gap: 4px;
    padding: 0;
  }

  .payment-page__sticky-back:hover {
    color: var(--irus-color-accent);
  }

  .payment-page__sticky-helper {
    color: #71717a;
    font-size: 11px;
    line-height: 1.4;
    text-align: right;
  }
}

/* ──────────────────────────────────────────
 * Smaller phones
 * ────────────────────────────────────────── */
@media (max-width: 575.98px) {
  .payment-page {
    padding-bottom: 220px;
  }

  .payment-page__section {
    border-radius: 12px;
    padding: 14px;
  }

  .payment-page__title {
    font-size: 15px;
    gap: 8px;
  }

  .payment-page__title i {
    font-size: 16px;
  }

  .payment-page__sticky-bar {
    border-radius: 18px 18px 0 0;
    gap: 6px;
    padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
  }

  .payment-page__sticky-products {
    margin: 0 -12px;
    padding: 0 12px 4px;
  }

  .payment-page__sticky-product {
    border-radius: 10px;
    max-width: 180px;
    min-width: 110px;
    padding: 4px 8px 4px 4px;
  }

  .payment-page__sticky-product-img {
    border-radius: 6px;
    height: 32px;
    width: 32px;
  }

  .payment-page__sticky-product-name {
    font-size: 10px;
  }

  .payment-page__sticky-product-meta {
    font-size: 9px;
  }

  .payment-page__sticky-chip {
    font-size: 10px;
    padding: 3px 8px;
  }

  .payment-page__sticky-value {
    font-size: 16px;
  }

  .payment-page__sticky-hint {
    display: none;
  }

  .payment-page__submit-btn {
    border-radius: 12px;
    font-size: 12px;
    min-height: 40px;
    min-width: 120px;
    padding: 0 12px;
  }

  .payment-page__sticky-back {
    font-size: 11px;
  }

  .btn-back {
    border-radius: 8px;
    font-size: 13px;
    padding: 8px 16px;
  }

  .payment-page__no-order {
    border-radius: 12px;
    padding: 40px 14px;
    font-size: 14px;
  }

  .payment-page__no-order i {
    font-size: 40px;
  }
}

@media (max-width: 480px) {
  .payment-page {
    padding-bottom: 200px;
  }

  .payment-page__section {
    border-radius: 12px;
    padding: 12px;
  }

  .payment-page__title {
    font-size: 14px;
    margin-bottom: 12px;
  }

  .payment-page__sticky-bar {
    gap: 4px;
    padding: 6px 10px calc(6px + env(safe-area-inset-bottom));
  }

  .payment-page__sticky-row {
    gap: 6px;
  }

  .payment-page__submit-btn {
    min-height: 38px;
    min-width: 0;
    padding: 0 10px;
  }

  .payment-page__sticky-helper {
    display: none;
  }
}
</style>
