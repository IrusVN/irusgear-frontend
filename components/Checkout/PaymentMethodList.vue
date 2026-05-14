<template>
  <div class="payment-method-list">
    <PaymentMethodCard
      v-for="method in methods"
      :key="method.id"
      :method="method.id"
      :name="method.name"
      :description="method.description"
      :selected="selectedMethod === method.id"
      @select="$emit('select', $event)"
    />
  </div>
</template>

<script setup>
import PaymentMethodCard from "@/components/Checkout/PaymentMethodCard.vue";

defineProps({
  methods: {
    type: Array,
    required: true,
  },
  selectedMethod: {
    type: String,
    default: null,
  },
});

defineEmits(["select"]);
</script>

<style scoped>
.payment-method-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
