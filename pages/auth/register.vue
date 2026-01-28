<template>
  <AuthLayout
    :title="$t('register.title')"
    :subtitle="$t('register.haveAccount')"
    :link-text="$t('common.signIn')"
    link-to="/auth/login"
    :divider-text="$t('common.or')"
    :social-text="$t('register.quickRegister')"
    :terms-prefix="$t('register.agreeWith')"
    :terms-link="$t('register.terms')"
    :terms-and="$t('register.and')"
    :policy-link="$t('register.policy')"
    visual-title="Join Our Community"
    visual-description="Create your account and unlock exclusive benefits, personalized recommendations, and seamless shopping experience."
    :stats="[
      { value: '10K+', label: 'members' },
      { value: '500+', label: 'products' },
      { value: '24/7', label: 'support' }
    ]"
  >
    <template #visual-icon>
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    </template>

    <AuthForm :loading="loading" :submit-text="$t('register.register')" @submit="handleRegister">
      <!-- Name Row -->
      <div class="row g-2">
        <div class="col-6">
          <AuthInput v-model="form.lastName" :placeholder="$t('common.lastName')" :error="errors.lastName" @blur="validateField('lastName')" />
        </div>
        <div class="col-6">
          <AuthInput v-model="form.firstName" :placeholder="$t('common.firstName')" :error="errors.firstName" @blur="validateField('firstName')" />
        </div>
      </div>

      <!-- DOB -->
      <div>
        <label class="small fw-medium text-dark mb-1 d-block">{{ $t('register.dob') }}</label>
        <AuthInput v-model="form.dob" type="date" :error="errors.dob" @blur="validateField('dob')" />
      </div>

      <!-- Phone & Email -->
      <div class="row g-2">
        <div class="col-6">
          <AuthInput v-model="form.phone" type="tel" :placeholder="$t('register.enterPhone')" :error="errors.phone" @blur="validateField('phone')" />
        </div>
        <div class="col-6">
          <AuthInput v-model="form.email" type="email" :placeholder="$t('register.enterEmail')" :error="errors.email" @blur="validateField('email')" />
        </div>
      </div>

      <!-- Password Row -->
      <div class="row g-2">
        <div class="col-6">
          <AuthInput v-model="form.password" type="password" :placeholder="$t('register.password')" :error="errors.password" @blur="validateField('password')" />
        </div>
        <div class="col-6">
          <AuthInput v-model="form.confirmPassword" type="password" :placeholder="$t('register.reEnterPassword')" :error="errors.confirmPassword" @blur="validateField('confirmPassword')" />
        </div>
      </div>

      <!-- Promo -->
      <AuthCheckbox v-model="form.receivePromo">{{ $t('register.promo') }}</AuthCheckbox>
    </AuthForm>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useLocalePath, navigateTo } from '#imports'
import { useI18n } from '#imports'
import { registerSchema } from '@/utils/validation/registerSchema'
import { useGlobalToast } from '@/composables/useGlobalToast.js'
import { useAuthStore } from '@/stores/authStore.js'
import AuthLayout from '@/components/Auth/AuthLayout.vue'
import AuthForm from '@/components/Auth/AuthForm.vue'
import AuthInput from '@/components/Auth/AuthInput.vue'
import AuthCheckbox from '@/components/Auth/AuthCheckbox.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const toast = useGlobalToast()
const authStore = useAuthStore()
const loading = ref(false)

useHead({ title: t('page_titles.register') })
definePageMeta({ layout: false })

const form = ref({
  firstName: '', lastName: '', dob: '', phone: '', email: '',
  password: '', confirmPassword: '', receivePromo: false,
})

const errors = reactive({
  firstName: null, lastName: null, dob: null, phone: null,
  email: null, password: null, confirmPassword: null,
})

const validateField = async (field) => {
  try {
    const schema = registerSchema(false, false)
    await schema.validateAt(field, form.value, { context: form.value })
    errors[field] = ''
  } catch (err) {
    errors[field] = err.message
  }
}

const fieldsToWatch = ['firstName', 'lastName', 'dob', 'phone', 'email', 'password', 'confirmPassword']
fieldsToWatch.forEach(field => {
  watch(() => form.value[field], () => validateField(field))
})

const handleRegister = async () => {
  if (loading.value) return
  loading.value = true
  Object.keys(errors).forEach(key => errors[key] = null)

  try {
    const schema = registerSchema(false, false)
    await schema.validate(form.value, { abortEarly: false })

    const payload = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      dob: form.value.dob,
      phoneNumber: form.value.phone,
      email: form.value.email,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword,
      receivePromo: form.value.receivePromo,
      type: 'personal',
    }

    const response = await authStore.register(payload)
    if (response.status === true) {
      toast.success(response.message)
      navigateTo('/auth/login')
    }
  } catch (err) {
    if (err.inner) {
      err.inner.forEach((e) => { errors[e.path] = e.message })
    } else {
      const apiErrors = err.data?.errors
      if (apiErrors) {
        Object.keys(apiErrors).forEach((key) => {
          if (key in errors) errors[key] = apiErrors[key][0]
        })
      } else {
        toast.error(err.message)
      }
    }
  } finally {
    loading.value = false
  }
}
</script>
