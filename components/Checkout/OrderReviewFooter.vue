<template>
  <div class="review-footer">
    <button
      type="button"
      class="review-footer__btn review-footer__btn--back"
      @click="$emit('back')"
    >
      <i class="bi bi-arrow-left"></i>
      {{ $t("checkout.back") }}
    </button>

    <button
      type="button"
      class="review-footer__btn review-footer__btn--confirm"
      :disabled="disabled"
      @click="$emit('confirm')"
    >
      <span v-if="submitting" class="review-footer__btn-content">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        {{ $t("checkout.processing") }}
      </span>
      <span v-else class="review-footer__btn-content">
        <i class="bi bi-check-circle"></i>
        {{ $t("checkout.confirmOrder") }}
      </span>
    </button>
  </div>
</template>

<script setup>
defineEmits(["back", "confirm"]);

defineProps({
  submitting: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
</script>

<style scoped>
.review-footer {
  display: flex;
  gap: 10px;
}

.review-footer__btn {
  align-items: center;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  font-size: 15px;
  font-weight: 700;
  gap: 6px;
  justify-content: center;
  min-height: 48px;
  padding: 10px 20px;
  transition: background 0.15s ease;
}

.review-footer__btn--back {
  background: #f4f4f5;
  border: 0;
  color: #52525b;
  flex: 1;
}

.review-footer__btn--back:hover {
  background: #e4e4e7;
}

.review-footer__btn--confirm {
  background: var(--irus-color-surface-strong);
  border: 0;
  color: #fff;
  flex: 2;
}

.review-footer__btn--confirm:hover:not(:disabled) {
  background: #1a1a1a;
}

.review-footer__btn--confirm:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.review-footer__btn-content {
  align-items: center;
  display: inline-flex;
  gap: 6px;
}

@media (max-width: 575.98px) {
  .review-footer__btn {
    font-size: 14px;
    min-height: 44px;
    padding: 8px 14px;
  }
}
</style>
