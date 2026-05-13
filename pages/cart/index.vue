<template>
  <CartPage />
</template>

<script setup>
import CartPage from "@/components/Cart/CartPage.vue";
import { useCartStore } from "@/stores/cartStore";

const cartStore = useCartStore();

await cartStore.fetchCart({ silent: true });
</script>
