<template>
  <section class="order-insurance" aria-labelledby="insurance-heading">
    <label class="order-insurance__checkbox-row">
      <input type="checkbox" v-model="checkoutStore.orderInsurance" />
      <i class="bi bi-shield-plus"></i>
      <span class="order-insurance__label">{{ $t("checkout.orderInsurance") }}</span>
      <span class="order-insurance__price">{{ $t("checkout.insuranceFee") }}</span>
    </label>

    <div v-if="checkoutStore.orderInsurance" class="order-insurance__body">
      <div class="order-insurance__info">
        <p class="order-insurance__title">{{ $t("checkout.insuranceTitle") }}</p>
        <ul class="order-insurance__list">
          <li><i class="bi bi-check"></i> {{ $t("checkout.insuranceCover1") }}</li>
          <li><i class="bi bi-check"></i> {{ $t("checkout.insuranceCover2") }}</li>
        </ul>
        <p class="order-insurance__fee-note">{{ $t("checkout.insuranceFeeNote") }}</p>
      </div>

      <div v-if="checkoutStore.orderInsurance" class="order-insurance__added">
        <i class="bi bi-check-circle-fill"></i>
        <span>{{ $t("checkout.insuranceAdded") }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useCheckoutStore } from "@/stores/checkoutStore";

const checkoutStore = useCheckoutStore();
</script>

<style scoped>
.order-insurance {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  overflow: hidden;
}

.order-insurance__checkbox-row {
  align-items: center;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  gap: 8px;
  padding: 16px 20px;
  color: #18181b;
}

.order-insurance__checkbox-row input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #d70018;
}

.order-insurance__label {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
}

.order-insurance__price {
  background: #fff7f7;
  border-radius: 6px;
  color: #d70018;
  font-size: 12px;
  padding: 2px 8px;
}

.order-insurance__body {
  border-top: 1px solid #f0f0f2;
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-insurance__info {
  background: #f7f7f8;
  border-radius: 10px;
  padding: 12px;
}

.order-insurance__title {
  color: #18181b;
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 8px;
}

.order-insurance__list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.order-insurance__list li {
  align-items: center;
  color: #52525b;
  display: flex;
  font-size: 12px;
  gap: 6px;
}

.order-insurance__list li i {
  color: #15803d;
}

.order-insurance__fee-note {
  color: #71717a;
  font-size: 11px;
  margin: 8px 0 0;
}

.order-insurance__added {
  align-items: center;
  background: #f0fdf4;
  border-radius: 8px;
  color: #15803d;
  display: flex;
  font-size: 12px;
  font-weight: 600;
  gap: 6px;
  padding: 8px 12px;
}

.order-insurance__added i {
  font-size: 16px;
}
</style>
