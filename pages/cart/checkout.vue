<template>
  <section class="checkout-page">
    <div class="container-xl">
      <CheckoutProgress :current-step="2" />

      <div v-if="checkoutLoading" class="checkout-page__loading">
        <div class="checkout-page__loading-inner">
          <div class="checkout-page__skeleton skeleton-title"></div>
          <div class="checkout-page__skeleton skeleton-card"></div>
          <div class="checkout-page__skeleton skeleton-card"></div>
          <div class="checkout-page__skeleton skeleton-card"></div>
        </div>
      </div>

      <div v-else class="checkout-page__layout">
        <div class="checkout-page__form-col">
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
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";
import { useGlobalToast } from "@/composables/useGlobalToast";
import CheckoutProgress from "@/components/Checkout/CheckoutProgress.vue";
import OrderInfoForm from "@/components/Checkout/OrderInfoForm.vue";
import OrderSummaryPanel from "@/components/Checkout/OrderSummaryPanel.vue";
import CheckoutStickyBar from "@/components/Checkout/CheckoutStickyBar.vue";
import OrderReviewDialog from "@/components/Checkout/OrderReviewDialog.vue";

definePageMeta({
  layout: "default",
});

const { t } = useI18n();
const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();
const toast = useGlobalToast();

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
        orderId: response.data.orderId,
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

.checkout-page__layout {
  align-items: start;
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1.7fr) minmax(320px, 0.95fr);
}

.checkout-page__form-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.checkout-page__summary-col {
  min-width: 0;
}

.checkout-page__loading {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 24px;
  padding: 24px;
}

.checkout-page__loading-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.checkout-page__skeleton {
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

@media (max-width: 991.98px) {
  .checkout-page {
    padding-bottom: 160px;
  }

  .checkout-page__layout {
    grid-template-columns: 1fr;
  }

  .checkout-page__summary-col {
    display: none;
  }
}
</style>
