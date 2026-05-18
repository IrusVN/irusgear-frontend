<template>
  <section class="checkout-page">
    <div class="container-xl">
      <CheckoutProgress :current-step="2" />

      <div v-if="checkoutLoading" class="bg-white border rounded-4 p-4">
        <div class="d-flex flex-column gap-3">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-card"></div>
          <div class="skeleton skeleton-card"></div>
          <div class="skeleton skeleton-card"></div>
        </div>
      </div>

      <div v-else class="d-flex flex-column flex-lg-row gap-4">
        <div class="flex-grow-1 minw-0">
          <OrderInfoForm />
        </div>

        <div class="checkout-page__summary-col">
          <OrderSummaryPanel @submit="handleSubmit" />
        </div>
      </div>
    </div>

    <CheckoutStickyBar @submit="handleSubmit" />

    <OrderReviewDialog
      v-if="checkoutStore.showOrderReview"
      @close="checkoutStore.closeOrderReview()"
      @confirm="handleConfirmOrder"
    />
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "#imports";
import { storeToRefs } from "pinia";
import { toast } from "vue-sonner";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";
import CheckoutProgress from "@/components/Checkout/CheckoutProgress.vue";
import OrderInfoForm from "@/components/Checkout/OrderInfoForm.vue";
import OrderSummaryPanel from "@/components/Checkout/OrderSummaryPanel.vue";
import CheckoutStickyBar from "@/components/Checkout/CheckoutStickyBar.vue";
import OrderReviewDialog from "@/components/Checkout/OrderReviewDialog.vue";

definePageMeta({
  layout: "default",
  middleware: ['auth-guard'],
});

const { t } = useI18n();
const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();

const checkoutLoading = ref(true);

onMounted(async () => {
  checkoutStore.resetCheckout();
  try {
    await Promise.all([
      checkoutStore.fetchAddresses(),
      checkoutStore.fetchAvailableVouchers(),
    ]);
    if (checkoutStore.selectedAddressId) {
      await checkoutStore.fetchDeliveryOptions();
    }
  } catch (e) {
    console.error("Checkout init error:", e);
  } finally {
    checkoutLoading.value = false;
  }
});

const handleSubmit = () => {
  if (!checkoutStore.canSubmit) {
    if (!checkoutStore.agreedToTerms) {
      toast.warning(t("checkout.agreeRequired"));
    }
    return;
  }
  checkoutStore.openOrderReview();
};

const handleConfirmOrder = async () => {
  checkoutStore.closeOrderReview();
  try {
    const response = await checkoutStore.prepareOrder();
    if (response?.data?.nextStep === "payment") {
      checkoutStore.setPreparedOrder({
        sessionId: response.data.sessionId,
        pricing: response.data.pricing,
      });
      await navigateTo("/cart/payment");
    }
  } catch (e) {
    toast.error(e?.data?.message || t("checkout.submitError"));
  }
};
</script>

<style scoped>
.checkout-page {
  padding: 18px 0 120px;
}

.skeleton {
  background: linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%);
  background-size: 200% 100%;
  border-radius: 12px;
  animation: shimmer 1.5s infinite;
}

.skeleton-title {
  height: 32px;
  width: 60%;
}

.skeleton-card {
  height: 100px;
  width: 100%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.checkout-page__summary-col {
  flex-shrink: 0;
  width: 380px;
}

/* Padding-bottom phải đủ chỗ cho sticky bar + (mobile) bottom nav:
   - Tablet (768-991px): sticky bar sát đáy (bottom: 0), cao ~160px
   - Mobile (<768px): sticky bar (bottom: 88px) + mobile-bottom-nav (88px) → cần nhiều space */

/* Tablet: iPad Mini (768), Surface Duo open, iPad Air (820),
   Zenbook Fold (853), Surface Pro 7 (912) — summary panel ẩn, sticky bar sát đáy */
@media (max-width: 991.98px) {
  .checkout-page {
    padding-bottom: 180px;
  }

  .checkout-page__summary-col {
    display: none;
  }
}

/* Mobile lớn: iPhone 14 Pro Max (430), Pixel 7 (412), iPhone XR (414),
   Samsung S20 Ultra (412), Galaxy A51/71 (412) */
@media (max-width: 767.98px) {
  .checkout-page {
    padding-bottom: 250px;
  }
}

/* Mobile trung: iPhone 12 Pro (390), iPhone SE (375), Surface Duo closed (540) */
@media (max-width: 575.98px) {
  .checkout-page {
    padding-bottom: 240px;
  }
}

/* Mobile nhỏ: Samsung S8+ (360), Galaxy Z Fold 5 mở */
@media (max-width: 380px) {
  .checkout-page {
    padding: 14px 0 230px;
  }
}

/* Galaxy Z Fold 5 closed (344px) — extreme narrow */
@media (max-width: 360px) {
  .checkout-page {
    padding: 12px 0 220px;
  }
}
</style>
