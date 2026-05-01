<template>
  <div class="order-info-form">
    <ExpressCheckout v-if="false"/>

    <AddressSection />

    <DeliveryOptions />

    <VoucherSection />

    <OrderNotes />

    <SecondaryContact />

    <OrderInsurance />

    <TrustBadges />
  </div>
</template>

<script setup>
import ExpressCheckout from "@/components/Checkout/ExpressCheckout.vue";
import AddressSection from "@/components/Checkout/AddressSection.vue";
import DeliveryOptions from "@/components/Checkout/DeliveryOptions.vue";
import VoucherSection from "@/components/Checkout/VoucherSection.vue";
import OrderNotes from "@/components/Checkout/OrderNotes.vue";
import SecondaryContact from "@/components/Checkout/SecondaryContact.vue";
import OrderInsurance from "@/components/Checkout/OrderInsurance.vue";
import TrustBadges from "@/components/Checkout/TrustBadges.vue";
</script>

<style scoped>
.order-info-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
