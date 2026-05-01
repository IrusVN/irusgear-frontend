<template>
  <div
    class="voucher-card"
    :class="{
      'voucher-card--selected': selected,
      'voucher-card--suggested': suggested,
      'voucher-card--disabled': disabled,
    }"
  >
    <label class="voucher-card__main">
      <input
        type="checkbox"
        :checked="selected"
        :disabled="disabled"
        class="voucher-card__checkbox"
        @change="$emit('toggle', voucher.code)"
      />

      <div class="voucher-card__icon">
        <i v-if="voucher.discountType === 'freeship'" class="bi bi-truck"></i>
        <i v-else class="bi bi-ticket-perforated"></i>
      </div>

      <div class="voucher-card__content">
        <div class="voucher-card__header">
          <span class="voucher-card__code">{{ voucher.code }}</span>
          <span v-if="suggested" class="voucher-card__badge voucher-card__badge--suggested">
            <i class="bi bi-star-fill"></i>
            {{ $t("checkout.voucherSuggestion") }}
          </span>
          <span v-else-if="voucher.discountType === 'percent'" class="voucher-card__badge voucher-card__badge--percent">
            {{ voucher.discountValue }}%
          </span>
          <span v-else-if="voucher.discountType === 'freeship'" class="voucher-card__badge voucher-card__badge--freeship">
            {{ $t("checkout.freeship") }}
          </span>
          <span v-else class="voucher-card__badge">
            {{ formatMoney(voucher.discountValue) }}
          </span>
        </div>

        <p class="voucher-card__desc">{{ voucher.description || voucher.name }}</p>

        <div class="voucher-card__meta">
          <p v-if="voucher.condition" class="voucher-card__condition">
            {{ voucher.condition }}
          </p>
          <p v-if="savingsPreview > 0" class="voucher-card__savings">
            <i class="bi bi-piggy-bank"></i>
            {{ $t("checkout.savingsAmount", { amount: formatMoney(savingsPreview) }) }}
          </p>
          <p v-if="rejectionReason" class="voucher-card__reject-reason">
            <i class="bi bi-exclamation-circle"></i>
            {{ rejectionReason }}
          </p>
          <p v-if="voucher.expiredAt" class="voucher-card__expiry">
            <i class="bi bi-clock"></i>
            {{ $t("checkout.expires") }}: {{ formatDate(voucher.expiredAt) }}
          </p>
        </div>
      </div>
    </label>

    <div v-if="voucher.isStackable === false && !disabled" class="voucher-card__stack-warn">
      <i class="bi bi-info-circle"></i>
      {{ $t("checkout.voucherNotStackable") }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  voucher: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  suggested: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  savingsPreview: {
    type: Number,
    default: 0,
  },
  rejectionReason: {
    type: String,
    default: null,
  },
});

defineEmits(["toggle"]);

const formatMoney = (value) => {
  if (!value && value !== 0) return "0đ";
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr));
};
</script>

<style scoped>
.voucher-card {
  background: #fff;
  border: 1.5px solid #ececf1;
  border-radius: 12px;
  transition: border-color 0.15s ease, opacity 0.15s ease;
}

.voucher-card--selected {
  border-color: #15803d;
  background: #f0fdf4;
}

.voucher-card--suggested {
  border-color: #d97706;
  background: #fffbeb;
}

.voucher-card--disabled {
  opacity: 0.6;
}

.voucher-card__main {
  align-items: flex-start;
  cursor: pointer;
  display: flex;
  gap: 10px;
  padding: 12px;
}

.voucher-card--disabled .voucher-card__main {
  cursor: not-allowed;
}

.voucher-card__checkbox {
  margin-top: 2px;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  accent-color: #15803d;
  cursor: pointer;
}

.voucher-card--disabled .voucher-card__checkbox {
  cursor: not-allowed;
}

.voucher-card__icon {
  align-items: center;
  background: #fff7f7;
  border-radius: 10px;
  color: #d70018;
  display: inline-flex;
  font-size: 24px;
  height: 44px;
  justify-content: center;
  width: 44px;
  flex-shrink: 0;
}

.voucher-card--selected .voucher-card__icon {
  background: #dcfce7;
  color: #15803d;
}

.voucher-card--suggested .voucher-card__icon {
  background: #fef3c7;
  color: #d97706;
}

.voucher-card__content {
  flex: 1;
  min-width: 0;
}

.voucher-card__header {
  align-items: center;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.voucher-card__code {
  color: #18181b;
  font-size: 13px;
  font-weight: 700;
}

.voucher-card__badge {
  border-radius: 6px;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  background: #d70018;
}

.voucher-card__badge--percent {
  background: #b91c1c;
}

.voucher-card__badge--freeship {
  background: #0ea5e9;
}

.voucher-card__badge--suggested {
  background: #d97706;
  font-size: 10px;
  padding: 2px 6px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.voucher-card__desc {
  color: #52525b;
  font-size: 12px;
  margin: 2px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.voucher-card__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 2px;
}

.voucher-card__condition {
  color: #71717a;
  font-size: 11px;
  margin: 0;
}

.voucher-card__savings {
  color: #15803d;
  font-size: 11px;
  font-weight: 600;
  margin: 2px 0 0;
}

.voucher-card__savings i {
  margin-right: 2px;
}

.voucher-card__reject-reason {
  color: #be123c;
  font-size: 11px;
  margin: 2px 0 0;
}

.voucher-card__reject-reason i {
  margin-right: 2px;
}

.voucher-card__expiry {
  color: #a1a1aa;
  font-size: 11px;
  margin: 2px 0 0;
}

.voucher-card__expiry i {
  margin-right: 2px;
}

.voucher-card__stack-warn {
  border-top: 1px solid #f0f0f2;
  color: #d97706;
  font-size: 11px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
