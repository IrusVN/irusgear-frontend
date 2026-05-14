<template>
    <form @submit.prevent="handleSendEmail" class="irus-form h-100 d-flex flex-column">
        <div class="flex-grow-1">
            <div class="irus-input-wrapper mb-3">
                <span class="irus-input-icon">
                    <EmailIcon />
                </span>
                <input type="email" class="irus-input" :class="{ 'border-danger': errorMessage }" :placeholder="$t('common.emailAddress')" v-model="email" @input="errorMessage = ''" required autofocus />
            </div>

            <div class="alert alert-light border border-dashed rounded-3 p-3 mb-3 d-flex gap-3 bg-light-subtle">
                <i class="bi bi-info-circle text-dark mt-1"></i>
                <p class="small text-secondary mb-0 text-start">
                    {{ $t('restorePassword.forgotPasswordNote') }}
                </p>
            </div>
            <Transition name="fade-slide">
                <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center gap-2 mt-2 mb-3 py-2 small" role="alert">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <span class="flex-grow-1">{{ errorMessage }}</span>
                </div>
            </Transition>
        </div>
        <div class="mt-4">
            <button type="submit" class="irus-btn irus-btn--primary w-100 mb-3" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
                {{ $t('restorePassword.sendCode') }}
            </button>

            <button type="button" @click="goBack" class="btn w-100 text-secondary small fw-bold text-decoration-none">
                <i class="bi bi-arrow-left me-1"></i> {{ $t('common.back') }}
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, inject } from 'vue'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/authStore.js'
import { navigateTo, useLocalePath } from '#imports'
import EmailIcon from '@/components/Icons/EmailIcon.vue'
import * as yup from 'yup'

const email = ref('')
const errorMessage = ref('')
const loading = ref(false)
const authStore = useAuthStore()
const localePath = useLocalePath()
const closeSheet = inject('closeSheet', null)

const goBack = () => {
    if (closeSheet) closeSheet()
    else navigateTo(localePath('/auth/login'))
}

const handleSendEmail = async () => {
    if (loading.value) return
    errorMessage.value = ''
    try {
        await yup.string().email('Email không hợp lệ').required().validate(email.value)
    } catch (err) { errorMessage.value = err.message; return }

    loading.value = true
    try {
        const response = await authStore.forgotPassword(email.value)
        if (response.status) toast.success(response.message)
    } catch (err) {
        errorMessage.value = err.data?.message || err.message 
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.irus-input-wrapper {
    position: relative;
}

.irus-input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
}

.irus-input {
    padding-left: 3rem !important;
}

/* Để chừa chỗ cho icon */
.border-dashed {
    border-style: dashed !important;
    border-color: #dee2e6 !important;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>
