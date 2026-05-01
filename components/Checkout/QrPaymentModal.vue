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
          <div class="qr-modal__qr-wrapper">
            <img
              v-if="payUrl"
              :src="qrCodeUrl"
              :alt="`QR ${methodName}`"
              class="qr-modal__qr"
              @error="qrError = true"
            />
            <div v-if="qrError || !payUrl" class="qr-modal__qr-error">
              <i class="bi bi-qr-code-scan"></i>
              <span>{{ $t("payment.qrLoadError") }}</span>
            </div>
          </div>

          <p class="qr-modal__scan-hint">
            {{ $t("payment.qrScanHint", { method: methodName }) }}
          </p>

          <div v-if="amount" class="qr-modal__amount">
            {{ formatMoney(amount) }}
          </div>

          <div class="qr-modal__timer">
            <span class="qr-modal__timer-label">
              <i class="bi bi-hourglass-split"></i>
              {{ $t("payment.qrWaiting") }}
            </span>
            <span class="qr-modal__timer-value">{{ formattedTime }}</span>
            <div class="qr-modal__timer-bar">
              <div
                class="qr-modal__timer-progress"
                :style="{ width: progressPercent + '%' }"
              ></div>
            </div>
          </div>

          <p class="qr-modal__tip">
            <i class="bi bi-lightbulb"></i>
            {{ $t("payment.qrTip", { method: methodName }) }}
          </p>
        </div>

        <div class="qr-modal__footer">
          <button type="button" class="qr-modal__cancel-btn" @click="handleCancel">
            {{ $t("payment.qrCancel") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  payUrl: {
    type: String,
    required: true,
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
});

const emit = defineEmits(["close", "cancel", "expired"]);

const qrError = ref(false);
const TOTAL_SECONDS = 300;
const remainingSeconds = ref(TOTAL_SECONDS);
let timer = null;

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

const qrCodeUrl = computed(() => {
  if (!props.payUrl) return "";
  const encoded = encodeURIComponent(props.payUrl);
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=${encoded}`;
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
  remainingSeconds.value = TOTAL_SECONDS;
  qrError.value = false;
  timer = setInterval(() => {
    remainingSeconds.value--;
    if (remainingSeconds.value <= 0) {
      clearTimer();
      emit("expired");
    }
  }, 1000);
};

const handleCancel = () => {
  clearTimer();
  emit("cancel");
};

watch(
  () => props.show,
  (val) => {
    if (val) {
      startTimer();
    } else {
      clearTimer();
    }
  }
);

onUnmounted(clearTimer);
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

.qr-modal__qr-wrapper {
  background: #fff;
  border: 1px solid #f0f0f2;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-modal__qr {
  border-radius: 8px;
  display: block;
  height: 250px;
  width: 250px;
}

.qr-modal__qr-error {
  align-items: center;
  color: #a1a1aa;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  gap: 8px;
  height: 250px;
  justify-content: center;
  width: 250px;
}

.qr-modal__qr-error i {
  font-size: 48px;
}

.qr-modal__scan-hint {
  color: #71717a;
  font-size: 14px;
  margin: 0;
  text-align: center;
}

.qr-modal__amount {
  color: #d70018;
  font-size: 24px;
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
  background: #d70018;
  border-radius: 4px;
  height: 100%;
  transition: width 1s linear;
}

.qr-modal__tip {
  align-items: center;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  color: #92400e;
  display: flex;
  font-size: 13px;
  gap: 8px;
  margin: 0;
  padding: 10px 14px;
  text-align: left;
}

.qr-modal__tip i {
  flex-shrink: 0;
}

.qr-modal__footer {
  border-top: 1px solid #f0f0f2;
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
  border-color: #d70018;
  color: #d70018;
}
</style>
