<template>
  <div class="voucher-card" :class="{ 'voucher-card--applied': applied }">
    <div class="voucher-card__icon">
      <i class="bi bi-ticket-perforated"></i>
    </div>
    <div class="voucher-card__content">
      <div class="voucher-card__header">
        <span class="voucher-card__code">{{ voucher.code }}</span>
        <span v-if="voucher.discountType === 'percent'" class="voucher-card__badge voucher-card__badge--percent">
          {{ voucher.discountValue }}%
        </span>
        <span v-else class="voucher-card__badge">
          {{ formatMoney(voucher.discountValue) }}
        </span>
      </div>
      <p class="voucher-card__desc">{{ voucher.description || voucher.name }}</p>
      <p v-if="voucher.condition" class="voucher-card__condition">
        {{ voucher.condition }}
      </p>
      <p v-if="voucher.expiredAt" class="voucher-card__expiry">
        <i class="bi bi-clock"></i>
        {{ $t("checkout.expires") }}: {{ formatDate(voucher.expiredAt) }}
      </p>
    </div>
    <button
      type="button"
      class="voucher-card__action"
      :disabled="applied"
      @click="$emit('use', voucher.code)"
    >
      {{ applied ? $t("checkout.applied") : $t("checkout.use") }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  voucher: {
    type: Object,
    required: true,
  },
  applied: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["use"]);

const formatMoney = (value) => {
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
  align-items: center;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 12px;
  display: flex;
  gap: 10px;
  padding: 12px;
  transition: border-color 0.15s ease;
}

.voucher-card--applied {
  border-color: #15803d;
  background: #f0fdf4;
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

.voucher-card--applied .voucher-card__icon {
  background: #dcfce7;
  color: #15803d;
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
  background: #d70018;
  border-radius: 6px;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
}

.voucher-card__badge--percent {
  background: #b91c1c;
}

.voucher-card__desc {
  color: #52525b;
  font-size: 12px;
  margin: 2px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.voucher-card__condition {
  color: #71717a;
  font-size: 11px;
  margin: 2px 0 0;
}

.voucher-card__expiry {
  color: #a1a1aa;
  font-size: 11px;
  margin: 4px 0 0;
}

.voucher-card__expiry i {
  margin-right: 2px;
}

.voucher-card__action {
  background: #fff;
  border: 1.5px solid #d70018;
  border-radius: 8px;
  color: #d70018;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 14px;
  transition: background 0.15s ease, color 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.voucher-card__action:hover:not(:disabled) {
  background: #d70018;
  color: #fff;
}

.voucher-card__action:disabled {
  background: #f0fdf4;
  border-color: #15803d;
  color: #15803d;
  cursor: default;
}
</style>
