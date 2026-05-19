<template>
  <!-- Mobile: BottomSheet -->
  <BottomSheet v-if="isMobile" :open="open" @close="$emit('close')">
    <div class="order-review-sheet">
      <header class="order-review-sheet__header">
        <h3 class="order-review-sheet__title">
          <i class="bi bi-clipboard-check"></i>
          {{ $t("checkout.reviewOrder") }}
        </h3>
      </header>

      <div class="order-review-sheet__body">
        <ReviewContent
          :address="checkoutStore.selectedAddress"
          :delivery="checkoutStore.selectedDelivery"
          :delivery-fee="checkoutStore.finalDeliveryFee"
          :delivery-time="deliveryTime"
          :full-address="fullAddress"
          :items="cartStore.selectedItems"
          :pricing="pricingSummary"
          v-model:agreed="checkoutStore.agreedToTerms"
          @edit="$emit('close')"
        />
      </div>

      <footer class="order-review-sheet__footer">
        <ReviewFooterButtons
          :submitting="checkoutStore.isSubmitting"
          :disabled="!checkoutStore.agreedToTerms || checkoutStore.isSubmitting"
          @back="$emit('close')"
          @confirm="$emit('confirm')"
        />
      </footer>
    </div>
  </BottomSheet>

  <!-- Desktop: Modal centered dialog -->
  <Teleport v-else to="body">
    <Transition name="dialog-fade">
      <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
        <div class="order-review-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <header class="order-review-dialog__header">
            <h3 id="dialog-title" class="order-review-dialog__title">
              <i class="bi bi-clipboard-check"></i>
              {{ $t("checkout.reviewOrder") }}
            </h3>
            <button
              type="button"
              class="order-review-dialog__close"
              :aria-label="$t('common.close')"
              @click="$emit('close')"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </header>

          <div class="order-review-dialog__body">
            <ReviewContent
              :address="checkoutStore.selectedAddress"
              :delivery="checkoutStore.selectedDelivery"
              :delivery-fee="checkoutStore.finalDeliveryFee"
              :delivery-time="deliveryTime"
              :full-address="fullAddress"
              :items="cartStore.selectedItems"
              :pricing="pricingSummary"
              v-model:agreed="checkoutStore.agreedToTerms"
              @edit="$emit('close')"
            />
          </div>

          <footer class="order-review-dialog__footer">
            <ReviewFooterButtons
              :submitting="checkoutStore.isSubmitting"
              :disabled="!checkoutStore.agreedToTerms || checkoutStore.isSubmitting"
              @back="$emit('close')"
              @confirm="$emit('confirm')"
            />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from "vue";
import BottomSheet from "@/components/Common/BottomSheet.vue";
import ReviewContent from "@/components/Checkout/OrderReviewContent.vue";
import ReviewFooterButtons from "@/components/Checkout/OrderReviewFooter.vue";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";
import { useMediaQuery } from "@/composables/useMediaQuery";

defineProps({
  open: {
    type: Boolean,
    default: true,
  },
});

defineEmits(["close", "confirm"]);

const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();
const isMobile = useMediaQuery("(max-width: 767.98px)");

const fullAddress = computed(() => {
  const addr = checkoutStore.selectedAddress;
  if (!addr) return "";
  const ward = addr.ward?.label || addr.ward;
  const district = addr.district?.label || addr.district;
  const province = addr.province?.label || addr.province;
  const parts = [addr.detail, ward, district, province].filter(
    (p) => Boolean(p) && typeof p === "string",
  );
  return parts.join(", ");
});

const deliveryTime = computed(() => {
  const d = checkoutStore.selectedDelivery;
  if (!d) return "";
  return d.estimatedDays || d.estimatedHours || d.estimatedText || d.time || "";
});

const pricingSummary = computed(() => ({
  subtotal: checkoutStore.subtotal,
  savings: checkoutStore.savings,
  voucherDiscount: checkoutStore.voucherDiscount,
  deliveryFee: checkoutStore.finalDeliveryFee,
  insuranceFee: checkoutStore.insuranceFee,
  finalTotal: checkoutStore.finalTotal,
}));
</script>

<style scoped>
/* ──────────────────────────────────────────
 * Desktop modal
 * ────────────────────────────────────────── */
.modal-backdrop {
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  padding: 20px;
  padding-top: max(20px, env(safe-area-inset-top, 0));
  padding-bottom: max(20px, env(safe-area-inset-bottom, 0));
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1080;
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-active .order-review-dialog,
.dialog-fade-leave-active .order-review-dialog {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.dialog-fade-enter-from .order-review-dialog,
.dialog-fade-leave-to .order-review-dialog {
  opacity: 0;
  transform: translateY(20px);
}

.order-review-dialog {
  background: #fff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  max-width: 560px;
  overflow: hidden;
  width: 100%;
}

.order-review-dialog__header {
  align-items: center;
  background: #18181b;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 18px 20px;
}

.order-review-dialog__title {
  align-items: center;
  color: #fff;
  display: flex;
  font-size: 17px;
  font-weight: 700;
  gap: 8px;
  margin: 0;
}

.order-review-dialog__close {
  background: none;
  border: 0;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}

.order-review-dialog__body {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
}

.order-review-dialog__footer {
  border-top: 1px solid #ececf1;
  padding: 14px 20px;
}

/* ──────────────────────────────────────────
 * Mobile bottom sheet wrapper
 * ────────────────────────────────────────── */
.order-review-sheet {
  display: flex;
  flex-direction: column;
  max-height: calc(90vh - 30px);
  max-height: calc(90dvh - 30px);
}

.order-review-sheet__header {
  align-items: center;
  background: #18181b;
  display: flex;
  flex-shrink: 0;
  gap: 12px;
  justify-content: space-between;
  padding: 14px 18px;
}

.order-review-sheet__title {
  align-items: center;
  color: #fff;
  display: flex;
  font-size: 16px;
  font-weight: 700;
  gap: 8px;
  margin: 0;
}

.order-review-sheet__body {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
  -webkit-overflow-scrolling: touch;
}

.order-review-sheet__footer {
  border-top: 1px solid #ececf1;
  flex-shrink: 0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0));
}
</style>
