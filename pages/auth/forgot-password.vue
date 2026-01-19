<template>
    <ForgotPasswordModel />
</template>
<script setup>
import ForgotPasswordModel from '@/components/Models/ForgotPasswordModel.vue';
import { useI18n } from '#imports';

const { t } = useI18n();
useHead({ title: t('page_titles.forgotPassword') });
</script>
