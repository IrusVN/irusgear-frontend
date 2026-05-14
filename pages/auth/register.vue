<template>
    <div class="d-flex align-items-center justify-content-center">
        <RegisterModel />
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import RegisterModel from '@/components/Models/RegisterModel.vue';

const { t } = useI18n();
useHead({ title: t('page_titles.register') });

definePageMeta({
  layout: 'auth',
});
</script>
