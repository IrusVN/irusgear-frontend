<template>
  <section class="delivery-options" aria-labelledby="delivery-heading">
    <div class="delivery-options__header">
      <h2 id="delivery-heading" class="delivery-options__title">
        <i class="bi bi-truck"></i>
        {{ $t("checkout.deliveryMethod") }}
      </h2>
    </div>

    <!-- No address selected -->
    <div v-if="!checkoutStore.selectedAddressId" class="delivery-options__empty">
      <i class="bi bi-info-circle"></i>
      <span>{{ $t("checkout.selectAddressFirst") }}</span>
    </div>

    <!-- Loading -->
    <div v-else-if="checkoutStore.deliveryLoading" class="delivery-options__loading">
      <div v-for="i in 3" :key="i" class="delivery-options__skeleton"></div>
    </div>

    <!-- Options list -->
    <div v-else class="delivery-options__list">
      <DeliveryOptionCard
        v-for="option in checkoutStore.deliveryOptions"
        :key="option.id"
        :option="option"
        :selected="String(option.id) === String(checkoutStore.selectedDeliveryId)"
        @select="checkoutStore.selectDelivery(option.id)"
      />

      <!-- Time slot picker (when applicable) -->
      <DeliveryTimeSlot
        v-if="checkoutStore.selectedDelivery?.hasTimeSlots"
        :delivery-id="checkoutStore.selectedDeliveryId"
      />
    </div>
  </section>
</template>

<script setup>
import { useCheckoutStore } from "@/stores/checkoutStore";
import DeliveryOptionCard from "@/components/Checkout/DeliveryOptionCard.vue";
import DeliveryTimeSlot from "@/components/Checkout/DeliveryTimeSlot.vue";

const checkoutStore = useCheckoutStore();
</script>

<style scoped>
.delivery-options {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  overflow: hidden;
}

.delivery-options__header {
  border-bottom: 1px solid #f0f0f2;
  padding: 18px 20px 14px;
}

.delivery-options__title {
  align-items: center;
  color: #18181b;
  display: flex;
  font-size: 17px;
  font-weight: 700;
  gap: 8px;
  margin: 0;
}

.delivery-options__title i {
  color: #d70018;
}

.delivery-options__empty {
  align-items: center;
  color: #71717a;
  display: flex;
  font-size: 13px;
  gap: 8px;
  padding: 16px 20px;
}

.delivery-options__loading {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 20px;
}

.delivery-options__skeleton {
  background: linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%);
  background-size: 200% 100%;
  border-radius: 14px;
  height: 76px;
  animation: shimmer 1.5s infinite;
}

.delivery-options__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 20px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
