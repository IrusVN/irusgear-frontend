<template>
  <section class="payment-page">
    <div class="container-xl">
      <CheckoutProgress :current-step="3" />

      <div v-if="!checkoutStore.preparedOrderId" class="payment-page__no-order">
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
                v-for="item in cartStore.items"
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

    <div v-if="checkoutStore.preparedOrderId" class="payment-page__sticky-bar">
      <div class="container-xl">
        <button
          type="button"
          class="payment-page__submit-btn"
          :disabled="!selectedMethod || loadingMethod"
          @click="handlePayment"
        >
          <span v-if="loadingMethod">
            <i class="bi bi-arrow-repeat spin"></i>
            {{ $t("payment.processing") }}
          </span>
          <span v-else>
            <i class="bi bi-shield-lock"></i>
            {{ $t("payment.proceedToPayment") }}
          </span>
        </button>
      </div>
    </div>

    <QrPaymentModal
      :show="showQrModal"
      :pay-url="selectedPayUrl"
      :method="selectedMethod"
      :amount="checkoutStore.finalTotal?.value"
      :order-id="checkoutStore.preparedOrderId"
      :expires-at="selectedExpiresAt"
      @close="showQrModal = false"
      @cancel="handleQrCancel"
      @expired="handleQrExpired"
      @success="handleQrSuccess"
      @failed="handleQrFailed"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";
import { useDeviceDetection } from "@/composables/useDeviceDetection";
import { useGlobalToast } from "@/composables/useGlobalToast";
import CheckoutProgress from "@/components/Checkout/CheckoutProgress.vue";
import PaymentMethodList from "@/components/Checkout/PaymentMethodList.vue";
import QrPaymentModal from "@/components/Checkout/QrPaymentModal.vue";

definePageMeta({
  layout: "default",
});

const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();
const toast = useGlobalToast();
const { isMobile } = useDeviceDetection();

const selectedMethod = ref(null);
const loadingMethod = ref(false);
const showQrModal = ref(false);
const selectedPayUrl = ref("");
const selectedPayData = ref(null);
const selectedExpiresAt = ref(null);

// Mobile: trạng thái chờ thanh toán khi quay lại từ gateway
const mobileWaiting = ref(false);
const mobilePollResult = ref(null);
const mobilePollLoading = ref(false);

const fallbackImage = "https://placehold.co/56x56/f4f4f5/d4d4d8?text=%20";

const paymentMethods = computed(() => [
  {
    id: "cod",
    name: "Thanh toán khi nhận hàng (COD)",
    description: "Trả tiền mặt khi nhận được hàng",
  },
  {
    id: "momo",
    name: "Ví MoMo",
    description: "Thanh toán qua ví MoMo - Nhanh chóng và an toàn",
  },
  {
    id: "vnpay",
    name: "VNPay",
    description: "Thanh toán qua cổng VNPay - Hỗ trợ 40+ ngân hàng",
  },
]);

const handleSelectMethod = (method) => {
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
      await navigateTo("/cart/payment/success");
      return;
    }

    const data = await checkoutStore.createPayment(selectedMethod.value);
    selectedPayData.value = data;
    selectedPayUrl.value = data.payUrl;
    selectedExpiresAt.value = data.expiresAt || null;

    if (isMobile()) {
      window.location.href = data.payUrl;
    } else {
      showQrModal.value = true;
    }
  } catch (e) {
    toast.error(e?.data?.message || "Tạo thanh toán thất bại");
    selectedMethod.value = null;
  } finally {
    loadingMethod.value = false;
  }
};

const handleQrCancel = () => {
  showQrModal.value = false;
  selectedPayUrl.value = "";
  selectedPayData.value = null;
  selectedExpiresAt.value = null;
};

const handleQrExpired = () => {
  showQrModal.value = false;
  toast.warning("Mã thanh toán đã hết hạn. Vui lòng tạo mã mới.");
  selectedPayUrl.value = "";
  selectedPayData.value = null;
  selectedExpiresAt.value = null;
  selectedMethod.value = null;
};

const handleQrSuccess = async (paymentData) => {
  showQrModal.value = false;
  selectedPayUrl.value = "";
  selectedPayData.value = null;
  selectedExpiresAt.value = null;
  await navigateTo(`/cart/payment/success?order_id=${paymentData.orderId || checkoutStore.preparedOrderId}`);
};

const handleQrFailed = (reason) => {
  showQrModal.value = false;
  toast.error(reason || "Thanh toán không thành công");
  selectedPayUrl.value = "";
  selectedPayData.value = null;
  selectedExpiresAt.value = null;
};

// Mobile: kiểm tra xem có query params thanh toán không (user quay lại từ gateway)
const checkMobileReturn = async () => {
  const params = new URLSearchParams(window.location.search);
  const hasPaymentParams =
    params.has("vnp_TxnRef") ||
    params.has("orderId") ||
    params.has("resultCode") ||
    params.has("vnp_ResponseCode");

  if (!hasPaymentParams || !checkoutStore.preparedOrderId) return;

  mobileWaiting.value = true;
  mobilePollLoading.value = true;

  try {
    const result = await checkoutStore.pollOrderPaymentStatus(checkoutStore.preparedOrderId, {
      maxAttempts: 20,
      intervalMs: 3000,
    });

    if (result) {
      mobilePollResult.value = result;
      const orderId = result.orderId || checkoutStore.preparedOrderId;
      await navigateTo(`/cart/payment/success?order_id=${orderId}`);
    } else {
      mobilePollResult.value = { timeout: true };
    }
  } catch {
    mobilePollResult.value = { error: true };
  } finally {
    mobilePollLoading.value = false;
  }
};

const formatMoney = (value) => {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};

onMounted(() => {
  if (isMobile()) {
    checkMobileReturn();
  }
});

onUnmounted(() => {});
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
  color: #d70018;
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
  color: #d70018;
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
  color: #d70018 !important;
  font-size: 20px !important;
}

.payment-page__sticky-bar {
  background: #fff;
  border-top: 1px solid #ececf1;
  bottom: 0;
  left: 0;
  padding: 14px 0;
  position: fixed;
  right: 0;
  z-index: 100;
}

.payment-page__submit-btn {
  background: #d70018;
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
  transition: background 0.15s ease;
  width: 100%;
}

.payment-page__submit-btn:hover:not(:disabled) {
  background: #b80015;
}

.payment-page__submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 0.8s linear infinite;
}

@media (max-width: 991.98px) {
  .payment-page {
    padding-bottom: 120px;
  }

  .payment-page__summary-col {
    width: 100%;
  }
}
</style>
