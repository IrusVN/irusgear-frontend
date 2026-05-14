<template>
  <ProductList />
</template>

<script setup>
import { computed } from "vue";
import { useHead, useI18n } from "#imports";
import ProductList from "@/components/Products/ProductList/ProductList.vue";

definePageMeta({ layout: "default" });

const { t } = useI18n();
useHead({ title: computed(() => t("sidebar.menu.products")) });
</script>
