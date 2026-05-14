<template>
  <div class="delivery-timeslot">
    <p class="delivery-timeslot__label">{{ $t("checkout.deliveryTimeSlot") }}</p>
    <div class="delivery-timeslot__options">
      <label
        v-for="slot in timeSlots"
        :key="slot.id"
        :class="['delivery-timeslot__option', { 'delivery-timeslot__option--selected': checkoutStore.selectedTimeSlot?.id === slot.id }]"
      >
        <input
          type="radio"
          :value="slot"
          v-model="checkoutStore.selectedTimeSlot"
          class="delivery-timeslot__input"
        />
        <div class="delivery-timeslot__content">
          <span class="delivery-timeslot__name">{{ slot.label }}</span>
          <span v-if="slot.extraFee > 0" class="delivery-timeslot__fee">
            +{{ formatMoney(slot.extraFee) }}
          </span>
          <span v-else class="delivery-timeslot__free">{{ $t("checkout.free") }}</span>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup>
import { useCheckoutStore } from "@/stores/checkoutStore";

defineProps({
  deliveryId: {
    type: String,
    required: true,
  },
});

const checkoutStore = useCheckoutStore();

const timeSlots = [
  { id: "morning", label: "Buổi sáng (8h-12h)", extraFee: 20000 },
  { id: "afternoon", label: "Buổi chiều (13h-18h)", extraFee: 0 },
  { id: "evening", label: "Buổi tối (18h-21h)", extraFee: 15000 },
];

const formatMoney = (value) => {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};
</script>

<style scoped>
.delivery-timeslot {
  background: #fafafa;
  border: 1px solid #f0f0f2;
  border-radius: 12px;
  padding: 12px 14px;
  margin-top: 4px;
}

.delivery-timeslot__label {
  color: #71717a;
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 10px;
}

.delivery-timeslot__options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.delivery-timeslot__option {
  border: 1.5px solid #e4e4e7;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  padding: 8px 14px;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.delivery-timeslot__option:hover {
  border-color: #d4d4d8;
}

.delivery-timeslot__option--selected {
  border-color: var(--irus-color-accent);
  background: var(--irus-color-accent-soft);
}

.delivery-timeslot__input {
  display: none;
}

.delivery-timeslot__content {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: center;
}

.delivery-timeslot__name {
  color: #18181b;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.delivery-timeslot__fee {
  color: var(--irus-color-accent);
  font-size: 11px;
  font-weight: 700;
}

.delivery-timeslot__free {
  color: #15803d;
  font-size: 11px;
  font-weight: 700;
}
</style>
