<template>
    <form @submit.prevent="handleResetPassword" class="irus-form h-100 d-flex flex-column">
        <div class="flex-grow-1">
            <div class="irus-input-wrapper mb-3">
                <span class="irus-input-icon">
                    <LockIcon />
                </span>
                <input v-model="password" :type="showPass ? 'text' : 'password'" class="irus-input" :placeholder="$t('restorePassword.newPassword')" @input="clearError('password')" required />
                <button type="button" class="password-toggle" @click="showPass = !showPass">
                    <ShowEye v-if="!showPass" />
                    <HideEye v-else />
                </button>
            </div>
            <div class="text-danger x-small mt-1 ps-1 mb-2" v-if="errors.password">
                {{ errors.password }}
            </div>
            <div class="irus-input-wrapper mb-3">
                <span class="irus-input-icon">
                    <LockIcon />
                </span>
                <input v-model="confirmPassword" :type="showConfirmPass ? 'text' : 'password'" class="irus-input" :placeholder="$t('restorePassword.confirmNewPassword')" @input="clearError('confirmPassword')" required />
                <button type="button" class="password-toggle" @click="showConfirmPass = !showConfirmPass">
                    <ShowEye v-if="!showConfirmPass" />
                    <HideEye v-else />
                </button>
            </div>
            <div class="text-danger x-small mt-1 ps-1 mb-2" v-if="errors.confirmPassword">
                {{ errors.confirmPassword }}
            </div>

            <Transition name="fade-slide">
                <div v-if="generalError" class="alert alert-danger d-flex align-items-center gap-2 mt-2 mb-3 py-2 small" role="alert">
                    <i class="bi bi-exclamation-triangle-fill"></i><span class="flex-grow-1">{{ generalError }}</span>
                </div>
            </Transition>
        </div>

        <div class="mt-4">
            <button type="submit" class="irus-btn irus-btn--primary w-100 mb-3" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
                {{ $t('restorePassword.resetPassword') }}
            </button>

            <button type="button" @click="goBack" class="btn w-100 text-secondary small fw-bold text-decoration-none">
                <i class="bi bi-arrow-left me-1"></i> {{ $t('common.back') }}
            </button>
        </div>

    </form>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/authStore.js'
import { navigateTo, useLocalePath, useI18n } from '#imports'
import LockIcon from '@/components/Icons/LockIcon.vue'
import ShowEye from '@/components/Icons/ShowEye.vue'
import HideEye from '@/components/Icons/HideEye.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const localePath = useLocalePath()
const closeSheet = inject('closeSheet', null)

const password = ref('')
const confirmPassword = ref('')
const showPass = ref(false)
const showConfirmPass = ref(false)
const loading = ref(false)
const generalError = ref('')
const errors = reactive({ password: '', confirmPassword: '' })

const clearError = (f) => { errors[f] = ''; generalError.value = '' }
const goBack = () => { authStore.restoreStep = 2 }

const handleResetPassword = async () => {
    if (loading.value) return
    errors.password = ''; errors.confirmPassword = ''; generalError.value = ''

    if (password.value.length < 6) { errors.password = 'Mật khẩu tối thiểu 6 ký tự'; return }
    if (password.value !== confirmPassword.value) { errors.confirmPassword = 'Mật khẩu không khớp'; return }

    loading.value = true
    try {
        const response = await authStore.resetPassword(password.value, confirmPassword.value)
        if (response.status) {
            toast.success(response.message)
            if (closeSheet) closeSheet()
            navigateTo(localePath('/auth/login'))
        }
    } catch (err) {
        generalError.value = err.data?.message || err.message
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

.password-toggle {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #999;
    display: flex;
    align-items: center;
}

.x-small {
    font-size: 0.75rem;
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
