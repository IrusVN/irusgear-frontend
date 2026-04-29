<template>
  <section class="order-insurance" aria-labelledby="insurance-heading">
    <button
      type="button"
      class="order-insurance__toggle"
      @click="expanded = !expanded"
    >
      <div class="order-insurance__toggle-left">
        <i class="bi bi-shield-plus"></i>
        <span>{{ $t("checkout.orderInsurance") }}</span>
        <span class="order-insurance__price">{{ $t("checkout.insuranceFee") }}</span>
      </div>
      <i :class="expanded ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
    </button>

    <div v-if="expanded" class="order-insurance__body">
      <div class="order-insurance__info">
        <p class="order-insurance__title">{{ $t("checkout.insuranceTitle") }}</p>
        <ul class="order-insurance__list">
          <li><i class="bi bi-check"></i> {{ $t("checkout.insuranceCover1") }}</li>
          <li><i class="bi bi-check"></i> {{ $t("checkout.insuranceCover2") }}</li>
        </ul>
        <p class="order-insurance__fee-note">{{ $t("checkout.insuranceFeeNote") }}</p>
      </div>

      <label class="order-insurance__action">
        <input type="checkbox" v-model="checkoutStore.orderInsurance" />
        <span>{{ $t("checkout.addInsurance") }}</span>
      </label>

      <div v-if="checkoutStore.orderInsurance" class="order-insurance__added">
        <i class="bi bi-check-circle-fill"></i>
        <span>{{ $t("checkout.insuranceAdded") }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useCheckoutStore } from "@/stores/checkoutStore";

const checkoutStore = useCheckoutStore();
const expanded = ref(false);
</script>

<style scoped>
.order-insurance {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  overflow: hidden;
}

.order-insurance__toggle {
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  gap: 8px;
  justify-content: space-between;
  padding: 16px 20px;
  width: 100%;
  color: #18181b;
}

.order-insurance__toggle-left {
  align-items: center;
  display: flex;
  gap: 8px;
  color: #d70018;
}

.order-insurance__price {
  background: #fff7f7;
  border-radius: 6px;
  color: #d70018;
  font-size: 12px;
  padding: 2px 8px;
}

.order-insurance__toggle i:last-child {
  color: #71717a;
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

.order-insurance__action {
  align-items: center;
  cursor: pointer;
  display: flex;
  font-size: 13px;
  font-weight: 600;
  gap: 8px;
  color: #18181b;
}

.order-insurance__action input {
  width: 16px;
  height: 16px;
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
