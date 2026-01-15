<template>
    <div>
        <LoginModel />
    </div>
</template>
<script setup>
import LoginModel from '@/components/Models/LoginModel.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
useHead({ title: t('page_titles.login') });
</script>
