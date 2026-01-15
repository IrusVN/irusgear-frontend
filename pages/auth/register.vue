<template>
    <RegisterModel />
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import RegisterModel from '@/components/Models/RegisterModel.vue';

const { t } = useI18n();
useHead({ title: t('page_titles.register') });
</script>
