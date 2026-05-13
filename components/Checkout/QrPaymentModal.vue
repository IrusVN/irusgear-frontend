<template>
  <Teleport to="body">
    <div v-if="show" class="qr-modal-backdrop" @click.self="handleCancel">
      <div class="qr-modal" role="dialog" aria-modal="true">
        <button type="button" class="qr-modal__close" @click="handleCancel">
          <i class="bi bi-x-lg"></i>
        </button>

        <div class="qr-modal__header">
          <h3 class="qr-modal__title">
            <i :class="methodIcon"></i>
            {{ $t("payment.qrTitle", { method: methodName }) }}
          </h3>
        </div>

        <div class="qr-modal__body">
          <!-- Popup closed state -->
          <div v-if="popupClosed" class="qr-modal__popup-closed">
            <div class="qr-modal__popup-closed-icon">
              <i class="bi bi-exclamation-triangle-fill"></i>
            </div>
            <p class="qr-modal__popup-closed-title">Bạn đã đóng cửa sổ thanh toán</p>
            <p class="qr-modal__popup-closed-desc">
              Thanh toán có thể chưa hoàn tất. Bạn có muốn thử lại hoặc chọn phương thức khác?
            </p>
          </div>

          <!-- Default: đang chờ thanh toán -->
          <template v-else>
            <div class="qr-modal__icon-wrapper">
              <i :class="methodIcon" class="qr-modal__method-icon"></i>
            </div>

            <p class="qr-modal__amount-label">Số tiền thanh toán</p>
            <div class="qr-modal__amount">
              {{ formatMoney(amount) }}
            </div>

            <div class="qr-modal__timer">
              <span class="qr-modal__timer-label">
                <i class="bi bi-hourglass-split"></i>
                Hết hạn sau
              </span>
              <span class="qr-modal__timer-value">{{ formattedTime }}</span>
              <div class="qr-modal__timer-bar">
                <div
                  class="qr-modal__timer-progress"
                  :style="{ width: progressPercent + '%' }"
                ></div>
              </div>
            </div>

            <div v-if="pollingActive && !paymentConfirmed" class="qr-modal__polling-indicator">
              <i class="bi bi-arrow-repeat spin"></i>
              {{ $t("payment.pollingIndicator") }}
            </div>

            <div v-if="paymentConfirmed" class="qr-modal__confirmed-indicator">
              <i class="bi bi-check-circle-fill"></i>
              {{ $t("payment.confirmingPayment") }}
            </div>

            <div v-if="popupOpen" class="qr-modal__popup-open">
              <i class="bi bi-box-arrow-up-right"></i>
              Cửa sổ thanh toán đang mở — vui lòng thanh toán trên cửa sổ đó
            </div>
          </template>
        </div>

        <div class="qr-modal__footer">
          <button
            v-if="popupClosed"
            type="button"
            class="qr-modal__retry-btn"
            @click="$emit('retry')"
          >
            <i class="bi bi-arrow-repeat"></i>
            Thử lại
          </button>
          <button
            v-if="popupClosed"
            type="button"
            class="qr-modal__cancel-btn"
            @click="handleCancel"
          >
            Chọn phương thức khác
          </button>
          <button
            v-else
            type="button"
            class="qr-modal__cancel-btn"
            @click="handleCancel"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import { useCheckoutStore } from "@/stores/checkoutStore";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  payUrl: {
    type: String,
    default: "",
  },
  method: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
  orderId: {
    type: String,
    default: "",
  },
  sessionId: {
    type: String,
    default: "",
  },
  expiresAt: {
    type: String,
    default: null,
  },
  popup: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "cancel", "expired", "success", "failed", "retry"]);

const checkoutStore = useCheckoutStore();
const TOTAL_SECONDS = 300;
const remainingSeconds = ref(TOTAL_SECONDS);
const pollingActive = ref(false);
const paymentConfirmed = ref(false);
const popupClosed = ref(false);
const popupOpen = ref(false);
let timer = null;
let pollAbortController = null;
let popupWatchInterval = null;

const progressPercent = computed(() =>
  (remainingSeconds.value / TOTAL_SECONDS) * 100
);

const formattedTime = computed(() => {
  const m = Math.floor(remainingSeconds.value / 60);
  const s = remainingSeconds.value % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
});

const methodName = computed(() => {
  switch (props.method) {
    case "momo":
      return "MoMo";
    case "vnpay":
      return "VNPay";
    default:
      return props.method;
  }
});

const methodIcon = computed(() => {
  switch (props.method) {
    case "momo":
      return "bi bi-circle-fill qr-modal__icon--momo";
    case "vnpay":
      return "bi bi-credit-card-2-front-fill qr-modal__icon--vnpay";
    default:
      return "bi bi-wallet2";
  }
});

const formatMoney = (value) => {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};

const clearTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const startTimer = () => {
  clearTimer();
  if (props.expiresAt) {
    const expires = new Date(props.expiresAt);
    const diff = Math.floor((expires.getTime() - Date.now()) / 1000);
    remainingSeconds.value = Math.max(0, diff);
  } else {
    remainingSeconds.value = TOTAL_SECONDS;
  }
  timer = setInterval(() => {
    remainingSeconds.value--;
    if (remainingSeconds.value <= 0) {
      clearTimer();
      pollingActive.value = false;
      popupClosed.value = true;
    }
  }, 1000);
};

const startPolling = async () => {
  if (!props.sessionId || pollingActive.value) return;
  pollingActive.value = true;
  pollAbortController = new AbortController();

  try {
    const result = await checkoutStore.pollOrderPaymentStatus(
      props.sessionId,
      {
        maxAttempts: Math.ceil(TOTAL_SECONDS / 5),
        intervalMs: 5000,
      },
      pollAbortController,
    );

    if (!pollingActive.value) return;

    if (result) {
      paymentConfirmed.value = true;
      pollingActive.value = false;
      if (result.status === "completed" || result.status === "paid") {
        emit("success", result);
      } else {
        emit("failed", "Thanh toán không thành công");
      }
    }
  } catch (e) {
    // Chi cho phep continue polling khi bi abort; cac loi khac thi dung lai
    if (pollAbortController?.signal.aborted) return;
    pollingActive.value = false;
  }
};

const watchPopupClosed = () => {
  if (popupWatchInterval) {
    clearInterval(popupWatchInterval);
    popupWatchInterval = null;
  }
  popupWatchInterval = setInterval(() => {
    if (props.popup && props.popup.closed) {
      clearInterval(popupWatchInterval);
      popupWatchInterval = null;
      popupOpen.value = false;
      pollingActive.value = false;
      popupClosed.value = true;
      clearTimer();
      if (pollAbortController) {
        pollAbortController.abort();
        pollAbortController = null;
      }
    }
  }, 500);
};

const handleCancel = () => {
  pollingActive.value = false;
  popupClosed.value = false;
  clearTimer();
  if (pollAbortController) {
    pollAbortController.abort();
    pollAbortController = null;
  }
  if (popupWatchInterval) {
    clearInterval(popupWatchInterval);
    popupWatchInterval = null;
  }
  emit("cancel");
};

watch(
  () => props.show,
  (val) => {
    if (val) {
      paymentConfirmed.value = false;
      pollingActive.value = false;
      popupClosed.value = false;
      popupOpen.value = !!props.popup;
      // Clean up any stale intervals from previous session before starting fresh
      if (pollAbortController) {
        pollAbortController.abort();
        pollAbortController = null;
      }
      if (popupWatchInterval) {
        clearInterval(popupWatchInterval);
        popupWatchInterval = null;
      }
      startTimer();
      startPolling();
      watchPopupClosed();
    } else {
      // Modal đóng (popup auto-close hoặc postMessage) — abort polling ngay
      pollingActive.value = false;
      if (pollAbortController) {
        pollAbortController.abort();
        pollAbortController = null;
      }
      if (popupWatchInterval) {
        clearInterval(popupWatchInterval);
        popupWatchInterval = null;
      }
    }
  }
);

onUnmounted(() => {
  pollingActive.value = false;
  popupClosed.value = false;
  clearTimer();
  if (pollAbortController) {
    pollAbortController.abort();
    pollAbortController = null;
  }
  if (popupWatchInterval) {
    clearInterval(popupWatchInterval);
    popupWatchInterval = null;
  }
});
</script>

<style scoped>
.qr-modal-backdrop {
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 200;
  padding: 20px;
}

.qr-modal {
  background: #fff;
  border-radius: 20px;
  max-width: 380px;
  overflow: hidden;
  width: 100%;
  animation: slideUp 0.25s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.qr-modal__close {
  background: none;
  border: none;
  color: #71717a;
  cursor: pointer;
  padding: 12px 16px 0;
  display: block;
  margin-left: auto;
}

.qr-modal__header {
  padding: 0 20px 8px;
}

.qr-modal__title {
  align-items: center;
  color: #18181b;
  display: flex;
  font-size: 17px;
  font-weight: 700;
  gap: 8px;
  margin: 0;
}

.qr-modal__icon--momo {
  color: #a50064;
}

.qr-modal__icon--vnpay {
  color: #004f9f;
}

.qr-modal__body {
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.qr-modal__icon-wrapper {
  background: #f9f9fb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
}

.qr-modal__method-icon {
  font-size: 36px;
}

.qr-modal__amount-label {
  color: #71717a;
  font-size: 13px;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.qr-modal__amount {
  color: var(--irus-color-surface-strong);
  font-size: 28px;
  font-weight: 800;
}

.qr-modal__timer {
  align-items: center;
  background: #f9f9fb;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  width: 100%;
}

.qr-modal__timer-label {
  align-items: center;
  color: #71717a;
  display: flex;
  font-size: 13px;
  gap: 6px;
}

.qr-modal__timer-value {
  color: #18181b;
  font-size: 28px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.qr-modal__timer-bar {
  background: #e4e4e7;
  border-radius: 4px;
  height: 4px;
  overflow: hidden;
  width: 100%;
}

.qr-modal__timer-progress {
  background: var(--irus-color-surface-strong);
  border-radius: 4px;
  height: 100%;
  transition: width 1s linear;
}

.qr-modal__polling-indicator {
  align-items: center;
  color: #71717a;
  display: flex;
  font-size: 13px;
  gap: 6px;
}

.qr-modal__polling-indicator .spin {
  animation: spin 1s linear infinite;
}

.qr-modal__confirmed-indicator {
  align-items: center;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #15803d;
  display: flex;
  font-size: 13px;
  font-weight: 600;
  gap: 6px;
  padding: 8px 14px;
}

.qr-modal__popup-open {
  align-items: center;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  color: #1d4ed8;
  display: flex;
  font-size: 13px;
  font-weight: 600;
  gap: 6px;
  padding: 8px 14px;
  text-align: center;
}

.qr-modal__popup-closed {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px 0;
  text-align: center;
}

.qr-modal__popup-closed-icon {
  font-size: 48px;
  color: #d97706;
}

.qr-modal__popup-closed-title {
  color: #18181b;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.qr-modal__popup-closed-desc {
  color: #71717a;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

.qr-modal__footer {
  border-top: 1px solid #f0f0f2;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 20px 16px;
}

.qr-modal__cancel-btn {
  background: none;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  color: #71717a;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  min-height: 44px;
  padding: 8px 20px;
  transition: border-color 0.15s ease, color 0.15s ease;
  width: 100%;
}

.qr-modal__cancel-btn:hover {
  border-color: var(--irus-color-accent);
  color: var(--irus-color-accent);
}

.qr-modal__retry-btn {
  background: var(--irus-color-surface-strong);
  border: none;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  min-height: 44px;
  padding: 8px 20px;
  transition: background 0.15s ease;
  width: 100%;
}

.qr-modal__retry-btn:hover {
  background: var(--irus-color-surface-dark);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
