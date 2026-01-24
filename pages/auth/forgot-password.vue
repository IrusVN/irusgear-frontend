<template>
    <div class="d-flex align-items-center justify-content-center vh-100">
        <ForgotPasswordModel />
    </div>
</template>
<script setup>
import ForgotPasswordModel from '@/components/Models/ForgotPasswordModel.vue';
import { useI18n } from '#imports';

const { t } = useI18n();
useHead({ title: t('page_titles.forgotPassword') });

definePageMeta({
  layout: false,
});
</script>
