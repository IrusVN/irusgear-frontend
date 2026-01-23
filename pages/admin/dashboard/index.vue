<template>
    <p>Admin Dashboard</p>
</template>

<script setup>
import { computed } from "vue";
import { useI18n, useHead } from "#imports";

definePageMeta({
  layout: 'admin',
});

const { t } = useI18n();
useHead({ title: computed(() => t('page_titles.dashboard')) });
</script>
<style scoped></style>
