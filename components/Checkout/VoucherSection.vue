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
    </div>

    <!-- Applied vouchers banner -->
    <div v-if="activeAppliedVouchers.length > 0" class="voucher-section__applied">
      <div
        v-for="voucher in activeAppliedVouchers"
        :key="voucher.code"
        class="voucher-applied"
      >
        <div class="voucher-applied__icon">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <div class="voucher-applied__content">
          <strong>{{ voucher.code }}</strong>
          <span>{{ voucher.description || voucher.name }}</span>
          <span class="voucher-applied__discount">
            -{{ formatMoney(voucher.discount) }}
          </span>
        </div>
        <button
          type="button"
          class="voucher-applied__remove"
          @click="confirmRemoveVoucher(voucher.code)"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>

    <!-- Input row for manual code -->
    <div class="voucher-section__input-row">
      <div class="voucher-input-wrapper">
        <i class="bi bi-ticket-perforated"></i>
        <input
          v-model="checkoutStore.voucherInput"
          type="text"
          class="voucher-input"
          :placeholder="$t('checkout.enterVoucherCode')"
          :disabled="checkoutStore.voucherValidateLoading"
          @keydown.enter="checkoutStore.applyVoucherFromInput()"
        />
      </div>
    </div>

    <!-- Error message -->
    <div v-if="checkoutStore.voucherError && checkoutStore.appliedVouchers.length === 0" class="voucher-section__error" role="alert">
      <i class="bi bi-exclamation-circle"></i>
      {{ checkoutStore.voucherError }}
    </div>

    <!-- Rejected vouchers -->
    <div
      v-if="rejectedVouchers.length > 0"
      class="voucher-section__rejected"
    >
      <p class="voucher-section__rejected-title">
        <i class="bi bi-x-circle"></i>
        {{ $t("checkout.voucherRejected") }}
      </p>
      <div
        v-for="rejected in rejectedVouchers"
        :key="rejected.code"
        class="voucher-rejected-item"
      >
        <strong>{{ rejected.code }}</strong>
        <span>{{ rejected.message }}</span>
      </div>
    </div>

    <!-- Available vouchers list -->
    <div v-if="checkoutStore.availableVouchers.length > 0" class="voucher-section__list">
      <VoucherCard
        v-for="voucher in sortedAvailableVouchers"
        :key="voucher.code"
        :voucher="voucher"
        :selected="checkoutStore.selectedVoucherCodes.includes(voucher.code)"
        :suggested="voucher.code === suggestedVoucherCode"
        :disabled="isVoucherDisabled(voucher) || checkoutStore.voucherValidateLoading"
        :savings-preview="voucher.savingsPreview || 0"
        :rejection-reason="getVoucherRejectionReason(voucher.code)"
        @toggle="checkoutStore.toggleVoucher"
      />
    </div>

    <div v-else-if="checkoutStore.availableVouchers.length === 0" class="voucher-section__empty">
      {{ $t("checkout.noVouchersAvailable") }}
    </div>

    <!-- Status bar — auto-apply feedback -->
    <div
      v-if="checkoutStore.selectedVoucherCodes.length > 0"
      class="voucher-section__footer"
    >
      <div v-if="checkoutStore.voucherValidateLoading" class="voucher-section__footer-loading">
        <i class="bi bi-arrow-repeat spin"></i>
        {{ $t("checkout.applyingVoucher") }}
      </div>
      <div v-else-if="checkoutStore.voucherError && activeAppliedVouchers.length === 0" class="voucher-section__footer-error">
        <i class="bi bi-exclamation-circle"></i>
        {{ checkoutStore.voucherError }}
      </div>
      <div v-else class="voucher-section__footer-success">
        <i class="bi bi-check-circle-fill"></i>
        {{ $t("checkout.applyVouchers", { count: activeAppliedVouchers.length }) }}
        <span class="voucher-section__footer-count">
          ({{ checkoutStore.selectedVoucherCodes.length }})
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import VoucherCard from "@/components/Checkout/VoucherCard.vue";

const checkoutStore = useCheckoutStore();
const { t } = useI18n();

const suggestedVoucherCode = computed(() => {
  return checkoutStore.availableVouchers.find((v) => v.isAlreadyApplied)?.code || null;
});

const activeAppliedVouchers = computed(() => {
  return checkoutStore.appliedVouchers.filter((v) =>
    checkoutStore.selectedVoucherCodes.includes(v.code)
  );
});

const rejectedVouchers = computed(() => {
  if (!checkoutStore.voucherValidateResult) return [];
  return checkoutStore.voucherValidateResult.rejected || [];
});

const getVoucherRejectionReason = (code) => {
  const rejected = rejectedVouchers.value.find((r) => r.code === code);
  return rejected?.message || null;
};

const isVoucherDisabled = (voucher) => {
  if (voucher.usageCount >= voucher.usageLimit) return true;
  if (voucher.expiredAt && new Date(voucher.expiredAt) < new Date()) return true;
  if (voucher.isActive === false) return true;
  return false;
};

const sortedAvailableVouchers = computed(() => {
  const vouchers = [...checkoutStore.availableVouchers];
  vouchers.sort((a, b) => {
    const aSuggested = a.code === suggestedVoucherCode.value;
    const bSuggested = b.code === suggestedVoucherCode.value;
    if (aSuggested && !bSuggested) return -1;
    if (!aSuggested && bSuggested) return 1;
    return (b.savingsPreview || 0) - (a.savingsPreview || 0);
  });
  return vouchers;
});

const formatMoney = (value) => {
  if (!value && value !== 0) return "0đ";
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};

const confirmRemoveVoucher = (code) => {
  toast(t('checkout.confirmRemoveVoucher', { code }), {
    cancel: { label: t('common.confirmNo'), onClick: () => {} },
    action: { label: t('common.confirmYes'), onClick: () => checkoutStore.removeVoucher(code) },
  });
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
  color: var(--irus-color-accent);
}

.voucher-section__count {
  color: #71717a;
  font-size: 14px;
  font-weight: 500;
}

.voucher-section__applied {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 20px 0;
}

.voucher-applied {
  align-items: flex-start;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  display: flex;
  gap: 8px;
  padding: 10px 12px;
}

.voucher-applied__icon {
  color: #15803d;
  font-size: 18px;
  flex-shrink: 0;
}

.voucher-applied__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.voucher-applied__content strong {
  color: #15803d;
  font-size: 13px;
  font-weight: 700;
}

.voucher-applied__content span {
  color: #166534;
  font-size: 12px;
}

.voucher-applied__discount {
  color: #15803d !important;
  font-size: 12px !important;
  font-weight: 600 !important;
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
  padding: 12px 20px;
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
  border-color: var(--irus-color-accent);
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
  text-transform: uppercase;
}

.voucher-input:disabled {
  opacity: 0.6;
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

.voucher-section__rejected {
  background: #fff1f2;
  border-top: 1px solid #fecdd3;
  padding: 10px 20px;
}

.voucher-section__rejected-title {
  align-items: center;
  color: #be123c;
  display: flex;
  font-size: 12px;
  font-weight: 600;
  gap: 4px;
  margin: 0 0 6px;
}

.voucher-section__rejected-title i {
  font-size: 14px;
}

.voucher-rejected-item {
  align-items: center;
  color: #be123c;
  display: flex;
  font-size: 12px;
  gap: 6px;
  padding: 4px 0;
}

.voucher-rejected-item strong {
  font-weight: 700;
}

.voucher-section__list {
  border-top: 1px solid #f0f0f2;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 20px 8px;
  max-height: 320px;
  overflow-y: auto;
}

.voucher-section__empty {
  border-top: 1px solid #f0f0f2;
  color: #a1a1aa;
  font-size: 13px;
  padding: 16px 20px;
  text-align: center;
}

.voucher-section__footer {
  border-top: 1px solid #f0f0f2;
  padding: 12px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.voucher-section__footer-error {
  align-items: center;
  background: #fff1f2;
  border-radius: 8px;
  color: #be123c;
  display: flex;
  font-size: 12px;
  gap: 6px;
  padding: 8px 12px;
}

.voucher-section__footer-loading {
  align-items: center;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  color: #0369a1;
  display: flex;
  font-size: 12px;
  font-weight: 600;
  gap: 6px;
  padding: 8px 12px;
}

.voucher-section__footer-success {
  align-items: center;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #15803d;
  display: flex;
  font-size: 12px;
  font-weight: 600;
  gap: 6px;
  padding: 8px 12px;
}

.voucher-section__footer-count {
  color: #166534;
  font-weight: 500;
}

.voucher-apply-btn:disabled {
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
  .voucher-section__list {
    max-height: 240px;
  }
}

@media (max-width: 767.98px) {
  .voucher-section__header {
    padding: 12px 16px 10px;
  }

  .voucher-section__title {
    font-size: 15px;
  }

  .voucher-section__applied {
    padding: 10px 16px 0;
  }

  .voucher-section__input-row {
    padding: 10px 16px;
  }

  .voucher-section__error,
  .voucher-section__rejected,
  .voucher-section__empty {
    padding: 8px 16px;
  }

  .voucher-section__list {
    padding: 10px 16px 8px;
  }

  .voucher-section__footer {
    padding: 10px 16px 14px;
  }
}

@media (max-width: 575.98px) {
  .voucher-section__list {
    max-height: 200px;
  }
}
</style>
