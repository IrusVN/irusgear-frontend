<template>
  <section class="voucher-section" aria-labelledby="voucher-heading">
    <div class="voucher-section__header">
      <h2 id="voucher-heading" class="voucher-section__title">
        <i class="bi bi-tag"></i>
        {{ $t("checkout.voucher") }}
      </h2>
      <span v-if="checkoutStore.availableVouchers.length > 0" class="voucher-section__count">
        ({{ checkoutStore.availableVouchers.length }})
      </span>
      <button
        v-if="checkoutStore.availableVouchers.length > 0"
        type="button"
        class="voucher-section__toggle"
        @click="checkoutStore.voucherExpanded = !checkoutStore.voucherExpanded"
      >
        <i :class="checkoutStore.voucherExpanded ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
      </button>
    </div>

    <!-- Applied voucher -->
    <div v-if="checkoutStore.appliedVoucher" class="voucher-section__applied">
      <div class="voucher-applied">
        <div class="voucher-applied__icon">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <div class="voucher-applied__content">
          <strong>{{ checkoutStore.appliedVoucher.code }}</strong>
          <span>{{ checkoutStore.appliedVoucher.description || checkoutStore.appliedVoucher.name }}</span>
          <span v-if="checkoutStore.appliedVoucher.condition" class="voucher-applied__condition">
            {{ checkoutStore.appliedVoucher.condition }}
          </span>
        </div>
        <button type="button" class="voucher-applied__remove" @click="checkoutStore.removeVoucher()">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>

    <!-- Input row -->
    <div v-else class="voucher-section__input-row">
      <div class="voucher-input-wrapper">
        <i class="bi bi-ticket-perforated"></i>
        <input
          v-model="checkoutStore.voucherInput"
          type="text"
          class="voucher-input"
          :placeholder="$t('checkout.enterVoucherCode')"
          :disabled="checkoutStore.voucherLoading"
          @keydown.enter="handleApply"
        />
      </div>
      <button
        type="button"
        class="voucher-apply-btn"
        :disabled="!checkoutStore.voucherInput.trim() || checkoutStore.voucherLoading"
        @click="handleApply"
      >
        <span v-if="checkoutStore.voucherLoading">
          <i class="bi bi-arrow-repeat spin"></i>
        </span>
        <span v-else>{{ $t("checkout.apply") }}</span>
      </button>
    </div>

    <!-- Error message -->
    <div v-if="checkoutStore.voucherError" class="voucher-section__error" role="alert">
      <i class="bi bi-exclamation-circle"></i>
      {{ checkoutStore.voucherError }}
    </div>

    <!-- Available vouchers list -->
    <div
      v-if="checkoutStore.voucherExpanded && checkoutStore.availableVouchers.length > 0"
      class="voucher-section__list"
    >
      <VoucherCard
        v-for="voucher in checkoutStore.availableVouchers"
        :key="voucher.code"
        :voucher="voucher"
        :applied="checkoutStore.appliedVoucher?.code === voucher.code"
        @use="handleApplyVoucher(voucher.code)"
      />
    </div>
  </section>
</template>

<script setup>
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useGlobalToast } from "@/composables/useGlobalToast";
import VoucherCard from "@/components/Checkout/VoucherCard.vue";

const checkoutStore = useCheckoutStore();
const toast = useGlobalToast();
const { t } = useI18n();

const handleApply = async () => {
  const code = checkoutStore.voucherInput.trim();
  if (!code) return;
  await checkoutStore.applyVoucher(code);
  if (checkoutStore.voucherError) {
    toast.warning(checkoutStore.voucherError);
  } else if (checkoutStore.appliedVoucher) {
    toast.success(t("checkout.voucherApplied"));
  }
};

const handleApplyVoucher = async (code) => {
  await checkoutStore.applyVoucher(code);
  if (!checkoutStore.voucherError) {
    checkoutStore.voucherExpanded = false;
    toast.success(t("checkout.voucherApplied"));
  }
};
</script>

<style scoped>
.voucher-section {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  overflow: hidden;
}

.voucher-section__header {
  align-items: center;
  border-bottom: 1px solid #f0f0f2;
  display: flex;
  gap: 6px;
  padding: 18px 20px 14px;
}

.voucher-section__title {
  align-items: center;
  color: #18181b;
  display: flex;
  font-size: 17px;
  font-weight: 700;
  gap: 8px;
  margin: 0;
}

.voucher-section__title i {
  color: #d70018;
}

.voucher-section__count {
  color: #71717a;
  font-size: 14px;
  font-weight: 500;
}

.voucher-section__toggle {
  background: none;
  border: none;
  color: #71717a;
  cursor: pointer;
  margin-left: auto;
  padding: 0;
}

.voucher-section__applied {
  padding: 14px 20px;
}

.voucher-applied {
  align-items: flex-start;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  display: flex;
  gap: 10px;
  padding: 12px 14px;
}

.voucher-applied__icon {
  color: #15803d;
  font-size: 20px;
  flex-shrink: 0;
}

.voucher-applied__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.voucher-applied__content strong {
  color: #15803d;
  font-size: 14px;
  font-weight: 700;
}

.voucher-applied__content span {
  color: #166534;
  font-size: 12px;
}

.voucher-applied__condition {
  color: #71717a !important;
  font-size: 11px !important;
}

.voucher-applied__remove {
  background: none;
  border: none;
  color: #71717a;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
}

.voucher-applied__remove:hover {
  color: #be123c;
}

.voucher-section__input-row {
  display: flex;
  gap: 10px;
  padding: 14px 20px;
}

.voucher-input-wrapper {
  align-items: center;
  background: #f7f7f8;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  display: flex;
  flex: 1;
  gap: 8px;
  padding: 0 12px;
  transition: border-color 0.15s ease;
}

.voucher-input-wrapper:focus-within {
  border-color: #d70018;
}

.voucher-input-wrapper > i {
  color: #71717a;
  flex-shrink: 0;
}

.voucher-input {
  border: none;
  background: transparent;
  flex: 1;
  font-size: 14px;
  min-height: 44px;
  outline: none;
  padding: 8px 0;
}

.voucher-input:disabled {
  opacity: 0.6;
}

.voucher-apply-btn {
  background: #d70018;
  border: none;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  min-height: 44px;
  padding: 8px 20px;
  transition: background 0.15s ease;
  white-space: nowrap;
}

.voucher-apply-btn:hover:not(:disabled) {
  background: #b80015;
}

.voucher-apply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.voucher-section__error {
  align-items: center;
  background: #fff1f2;
  border-top: 1px solid #fecdd3;
  color: #be123c;
  display: flex;
  font-size: 13px;
  gap: 8px;
  padding: 10px 20px;
}

.voucher-section__list {
  border-top: 1px solid #f0f0f2;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 20px 14px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 0.8s linear infinite;
}
</style>
