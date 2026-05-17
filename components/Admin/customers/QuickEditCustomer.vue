<template>
  <QuickView
    :model-value="modelValue"
    :title="$t('admin.customers.quickEditTitle')"
    :close-label="$t('common.close')"
    @update:model-value="(v) => emit('update:modelValue', v)"
    @close="emit('close')"
    @open="onOpen"
  >
    <template #body-wrapper>
      <form class="quick-edit__form" @submit.prevent="submit">
        <div class="quick-view__body quick-edit__body">
          <!-- Customer preview chip -->
          <div v-if="customer" class="quick-edit__chip">
            <img
              :src="customer.avatar"
              :alt="customer.name"
              class="quick-edit__avatar"
            />
            <div class="quick-edit__chip-info">
              <strong>{{ customer.name }}</strong>
              <small>{{ customer.customerCode }}</small>
            </div>
          </div>

          <!-- First / Last name -->
          <div class="quick-edit__row">
            <label class="quick-edit__field">
              <span class="quick-edit__label">
                {{ $t('common.firstName') }}
              </span>
              <input
                v-model.trim="form.first_name"
                type="text"
                class="quick-edit__control"
                :class="{ 'is-invalid': errors.first_name }"
                :placeholder="$t('admin.customers.quickEditFirstNamePh')"
                maxlength="50"
                @input="clearError('first_name')"
              />
              <span v-if="errors.first_name" class="quick-edit__error">
                {{ errors.first_name }}
              </span>
            </label>

            <label class="quick-edit__field">
              <span class="quick-edit__label">
                {{ $t('common.lastName') }}
              </span>
              <input
                v-model.trim="form.last_name"
                type="text"
                class="quick-edit__control"
                :class="{ 'is-invalid': errors.last_name }"
                :placeholder="$t('admin.customers.quickEditLastNamePh')"
                maxlength="50"
                @input="clearError('last_name')"
              />
              <span v-if="errors.last_name" class="quick-edit__error">
                {{ errors.last_name }}
              </span>
            </label>
          </div>

          <!-- Email -->
          <label class="quick-edit__field">
            <span class="quick-edit__label">
              Email <em class="quick-edit__req">*</em>
            </span>
            <input
              v-model.trim="form.email"
              type="email"
              class="quick-edit__control"
              :class="{ 'is-invalid': errors.email }"
              :placeholder="$t('admin.customers.quickEditEmailPh')"
              autocomplete="email"
              @input="clearError('email')"
            />
            <span v-if="errors.email" class="quick-edit__error">
              {{ errors.email }}
            </span>
          </label>

          <!-- Phone -->
          <label class="quick-edit__field">
            <span class="quick-edit__label">
              {{ $t('common.phoneNumber') }}
            </span>
            <input
              v-model.trim="form.phone_number"
              type="tel"
              class="quick-edit__control"
              :class="{ 'is-invalid': errors.phone_number }"
              :placeholder="$t('admin.customers.quickEditPhonePh')"
              maxlength="20"
              autocomplete="tel"
              @input="clearError('phone_number')"
            />
            <span v-if="errors.phone_number" class="quick-edit__error">
              {{ errors.phone_number }}
            </span>
          </label>

          <!-- 2 dropdown song song: Status (chặn login) + Email verify -->
          <div class="quick-edit__row">
            <div class="quick-edit__field">
              <span class="quick-edit__label">
                {{ $t('admin.customers.statusLabel').replace(':', '') }}
              </span>
              <QuickSelect
                v-model="form.status"
                :options="statusOptions"
              />
            </div>

            <div class="quick-edit__field">
              <span class="quick-edit__label">
                {{ $t('admin.customers.emailVerifyLabel') }}
              </span>
              <QuickSelect
                v-model="form.email_verified"
                :options="verifyOptions"
              />
            </div>
          </div>

          <span class="quick-edit__hint">
            <i class="bi bi-info-circle-fill" aria-hidden="true"></i>
            <span>{{ $t('admin.customers.quickEditStatusHint') }}</span>
          </span>

          <!-- Section: Reset password (collapse mặc định, chỉ gửi khi user toggle) -->
          <div class="quick-edit__section">
            <button
              type="button"
              class="quick-edit__section-toggle"
              :aria-expanded="showPasswordSection"
              @click="togglePasswordSection"
            >
              <i class="bi bi-key-fill"></i>
              <span>{{ $t('admin.customers.quickEditResetPassword') }}</span>
              <i class="bi bi-chevron-down quick-edit__section-chevron" :class="{ 'is-open': showPasswordSection }"></i>
            </button>

            <div v-if="showPasswordSection" class="quick-edit__section-body">
              <label class="quick-edit__field">
                <span class="quick-edit__label">{{ $t('admin.customers.newPassword') }}</span>
                <span class="quick-edit__password-wrap">
                  <input
                    v-model="form.password"
                    :type="showPasswordPlain ? 'text' : 'password'"
                    class="quick-edit__control"
                    :class="{ 'is-invalid': errors.password }"
                    :placeholder="$t('admin.customers.quickEditPasswordPh')"
                    autocomplete="new-password"
                    @input="clearError('password')"
                  />
                  <button
                    type="button"
                    class="quick-edit__eye"
                    :aria-label="showPasswordPlain ? 'Hide' : 'Show'"
                    @click="showPasswordPlain = !showPasswordPlain"
                  >
                    <i :class="showPasswordPlain ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                  </button>
                </span>
                <span v-if="errors.password" class="quick-edit__error">
                  {{ errors.password }}
                </span>
                <span v-else class="quick-edit__hint">
                  <i class="bi bi-info-circle-fill" aria-hidden="true"></i>
                  <span>{{ $t('admin.customers.quickEditPasswordHint') }}</span>
                </span>
              </label>
            </div>
          </div>

          <!-- Section: Default address. Có địa chỉ → display read-only; chưa có → button thêm. -->
          <div class="quick-edit__section">
            <div class="quick-edit__section-header">
              <i class="bi bi-geo-alt-fill"></i>
              <span>{{ $t('admin.customers.quickEditAddress') }}</span>
            </div>
            <div class="quick-edit__section-body quick-edit__address-body">
              <template v-if="customer?.defaultAddressText">
                <p class="quick-edit__address-text">
                  {{ customer.defaultAddressText }}
                </p>
                <span class="quick-edit__hint">
                  <i class="bi bi-info-circle-fill" aria-hidden="true"></i>
                  <span>{{ $t('admin.customers.quickEditAddressHint') }}</span>
                </span>
              </template>
              <template v-else>
                <p class="quick-edit__address-empty">
                  {{ $t('admin.customers.quickEditAddressEmpty') }}
                </p>
                <button
                  type="button"
                  class="quick-edit__add-address"
                  @click="openAddAddress"
                >
                  <i class="bi bi-plus-lg"></i>
                  <span>{{ $t('admin.customers.quickEditAddAddress') }}</span>
                </button>
              </template>
            </div>
          </div>
        </div>

        <footer class="quick-view__footer quick-edit__footer">
          <button
            type="button"
            class="quick-edit__secondary"
            :disabled="isSubmitting"
            @click="close"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            type="submit"
            class="quick-edit__submit"
            :disabled="isSubmitting"
          >
            <span
              v-if="isSubmitting"
              class="quick-edit__spinner"
              aria-hidden="true"
            ></span>
            <span>{{
              isSubmitting
                ? $t('admin.customers.quickEditSaving')
                : $t('admin.customers.quickEditSave')
            }}</span>
          </button>
        </footer>
      </form>
    </template>
  </QuickView>

  <!-- Nested address picker: dùng UpdateAddress (component hoàn chỉnh có province/
       district/ward picker + UI khớp design) ở chế độ controlled — pass `customer`
       prop để component biết là admin đang tạo address cho người khác (không call
       checkoutStore.saveAddress mặc định). Component sẽ emit `save` với payload
       đã build sẵn — parent xử lý POST admin endpoint. z-index +10 để stack
       trên drawer chính. -->
  <UpdateAddress
    ref="addressDrawerRef"
    v-model="showAddAddress"
    :customer="props.customer"
    :saving="addressSaving"
    :z-index="10040"
    @save="onAddressFormSave"
    @close="onCloseAddAddress"
  />
</template>

<script setup>
import { computed, reactive, ref, useTemplateRef, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useI18n } from '#imports'
import { useAdminStore } from '@/stores/adminStore'
import QuickView from '@/components/Common/QuickView.vue'
import QuickSelect from '@/components/Common/QuickSelect.vue'
import UpdateAddress from '@/components/Profile/UpdateAddress.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  customer: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'close', 'updated'])

const { t } = useI18n()
const admin = useAdminStore()

const isSubmitting = ref(false)

// Map UI label ↔ backend enum value (App\Enums\UserStatus).
// BE dùng giá trị số dạng string ('0'..'3') — không phải 'active'/'inactive'.
// Giữ UI dùng key text cho dễ đọc + dropdown i18n; chỉ convert khi submit/hydrate.
const STATUS_TO_CODE = { inactive: '0', active: '1', pending: '2', banned: '3' }
const CODE_TO_STATUS = { 0: 'inactive', 1: 'active', 2: 'pending', 3: 'banned' }

// Options cho QuickSelect — computed để label tự re-evaluate khi đổi locale.
const statusOptions = computed(() => [
  { value: 'active', label: t('admin.customers.statusActive'), icon: 'bi-check-circle-fill' },
  { value: 'inactive', label: t('admin.customers.statusInactive'), icon: 'bi-pause-circle-fill' },
])

const verifyOptions = computed(() => [
  { value: true, label: t('admin.customers.emailVerifyYes'), icon: 'bi-patch-check-fill' },
  { value: false, label: t('admin.customers.emailVerifyNo'), icon: 'bi-x-circle' },
])

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  status: 'active',
  email_verified: false,
  password: '',
})

const errors = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  password: '',
})

// Password section collapse: mặc định đóng, admin chủ động mở để reset.
const showPasswordSection = ref(false)
const showPasswordPlain = ref(false)

// ── Add Address sub-drawer ──
// Dùng UpdateAddress.vue (component có sẵn đầy đủ province/district/ward picker
// + UI nhất quán với profile). Truyền `customer` prop để switch sang controlled
// mode — component chỉ emit `save`, parent (admin) POST tới admin endpoint thay
// vì checkoutStore.saveAddress (vốn cho user tự sửa của mình).
const showAddAddress = ref(false)
const addressSaving = ref(false)
const addressDrawerRef = useTemplateRef('addressDrawerRef') // dùng để gọi resetForm sau save

const openAddAddress = () => {
  showAddAddress.value = true
}

const onCloseAddAddress = () => {
  // UpdateAddress (controlled) không tự reset — đảm bảo lần mở sau form sạch.
  // Tuy nhiên onOpen của UpdateAddress chỉ load provinces, không reset state cũ
  // → ta gọi resetForm thông qua ref.
  if (addressDrawerRef.value?.resetForm) {
    addressDrawerRef.value.resetForm()
  }
}

const onAddressFormSave = async (payload) => {
  if (!props.customer?.id || addressSaving.value) return

  addressSaving.value = true
  try {
    // Transform shape UpdateAddress emit → shape BE StoreAddressRequest.
    // UpdateAddress trả: { name, phone, province: {value,label}, district, ward, detail, label, isDefault }
    // BE expects: { name, phone, province_code, district_code, ward_code, address_line1, city, country, label, is_default }
    const apiPayload = {
      name: payload.name,
      phone: payload.phone,
      province_code: payload.province?.value || null,
      district_code: payload.district?.value || null,
      ward_code: payload.ward?.value || null,
      address_line1: payload.detail,
      city: payload.province?.label || null,
      country: 'Vietnam',
      label: payload.label || 'home',
      is_default: !!payload.isDefault,
    }

    await admin.create(`customers/${props.customer.id}/addresses`, apiPayload)
    toast.success(t('admin.customers.quickEditAddressCreated'))

    // Reset form trong nested drawer + đóng drawer.
    if (addressDrawerRef.value?.resetForm) {
      addressDrawerRef.value.resetForm()
    }
    showAddAddress.value = false
    emit('updated', null) // null → parent fetch lại từ BE
  } catch (error) {
    toast.error(
      error?.data?.message ||
      error?.message ||
      t('admin.customers.quickEditAddressCreateFailed')
    )
  } finally {
    addressSaving.value = false
  }
}

const togglePasswordSection = () => {
  showPasswordSection.value = !showPasswordSection.value
  if (!showPasswordSection.value) {
    // Đóng section → clear input + error để tránh gửi nhầm
    form.password = ''
    errors.password = ''
    showPasswordPlain.value = false
  }
}

const resetForm = () => {
  form.first_name = ''
  form.last_name = ''
  form.email = ''
  form.phone_number = ''
  form.status = 'active'
  form.email_verified = false
  form.password = ''
  errors.first_name = ''
  errors.last_name = ''
  errors.email = ''
  errors.phone_number = ''
  errors.password = ''
  showPasswordSection.value = false
  showPasswordPlain.value = false
}

const hydrateFromCustomer = (c) => {
  if (!c) return
  const parts = (c.name || '').trim().split(/\s+/)
  form.first_name = c.first_name || parts.slice(0, -1).join(' ') || parts[0] || ''
  form.last_name = c.last_name || (parts.length > 1 ? parts.slice(-1).join(' ') : '')
  form.email = c.email || ''
  form.phone_number = c.phone_number || c.phone || ''
  // BE có thể trả status dạng code ('1') HOẶC string ('active') — chấp nhận cả 2.
  const raw = c.status
  if (raw == null) form.status = 'active'
  else if (CODE_TO_STATUS[raw] !== undefined) form.status = CODE_TO_STATUS[raw]
  else form.status = String(raw)

  // email_verified: BE trả boolean (xem AdminCustomerResource). Fallback dùng
  // email_verified_at nếu boolean không có (vd: chỗ list cũ chưa map).
  form.email_verified = typeof c.email_verified === 'boolean'
    ? c.email_verified
    : Boolean(c.email_verified_at)
}

const clearError = (field) => {
  errors[field] = ''
}

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const onOpen = () => {
  resetForm()
  hydrateFromCustomer(props.customer)
}

const validate = () => {
  errors.first_name = ''
  errors.last_name = ''
  errors.email = ''
  errors.phone_number = ''

  if (!form.email) {
    errors.email = t('admin.customers.quickEditEmailRequired')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('admin.customers.quickEditEmailInvalid')
  }

  if (form.phone_number && !/^[0-9+\-\s()]{6,20}$/.test(form.phone_number)) {
    errors.phone_number = t('admin.customers.quickEditPhoneInvalid')
  }

  // Password chỉ validate khi section mở VÀ user nhập gì đó.
  // BE rule: min 8, mixedCase + numbers (xem App\Http\Requests\Admin\UpdateUserRequest).
  if (showPasswordSection.value && form.password) {
    if (form.password.length < 8) {
      errors.password = t('admin.customers.quickEditPasswordTooShort')
    } else if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password) || !/\d/.test(form.password)) {
      errors.password = t('admin.customers.quickEditPasswordWeak')
    }
  }

  return !errors.first_name && !errors.last_name && !errors.email && !errors.phone_number && !errors.password
}

const submit = async () => {
  if (isSubmitting.value || !validate()) return
  if (!props.customer?.id) return

  isSubmitting.value = true
  try {
    const payload = {
      first_name: form.first_name || undefined,
      last_name: form.last_name || undefined,
      name: `${form.first_name} ${form.last_name}`.trim() || undefined,
      email: form.email,
      phone_number: form.phone_number || null,
      // Convert 'active'/'inactive'/... → '0'/'1'/... cho khớp UserStatus enum BE.
      status: STATUS_TO_CODE[form.status] ?? form.status,
      // BE (AdminUserService::update) convert flag này → email_verified_at = now()/null.
      email_verified: form.email_verified,
    }

    // Chỉ gửi password nếu section mở VÀ user thực sự nhập — tránh ghi đè rỗng.
    // BE đã có guard `if (empty($data['password'])) unset($data['password'])`,
    // nhưng client side check trước để rõ ràng intent.
    if (showPasswordSection.value && form.password) {
      payload.password = form.password
    }

    const res = await admin.update('users', props.customer.id, payload)
    toast.success(t('admin.customers.quickEditSuccess'))
    emit('updated', res?.data || null)
    close()
  } catch (error) {
    const msg =
      error?.data?.message ||
      error?.response?._data?.message ||
      error?.message ||
      t('admin.customers.quickEditFailed')
    toast.error(msg)
  } finally {
    isSubmitting.value = false
  }
}

// Khi modal đã mở mà customer prop thay đổi (vd: list refetch trong lúc đang xem),
// re-hydrate form để tránh hiển thị data cũ.
watch(
  () => props.customer,
  (c) => {
    if (props.modelValue && c) hydrateFromCustomer(c)
  }
)
</script>

<style scoped>
.quick-edit__form {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.quick-edit__chip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #f6f7f9;
  border-radius: 8px;
}

.quick-edit__avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
  flex: 0 0 auto;
}

.quick-edit__chip-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.quick-edit__chip-info strong {
  font-size: 13px;
  color: #111827;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quick-edit__chip-info small {
  color: #6b7280;
  font-size: 11px;
}

.quick-edit__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.quick-edit__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
}

.quick-edit__label {
  color: #111827;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.35;
}

.quick-edit__req {
  color: var(--irus-color-danger, #d70018);
  font-style: normal;
}

.quick-edit__control {
  width: 100%;
  height: 39px;
  padding: 0 12px;
  color: #111827;
  font-size: 12px;
  font-weight: 500;
  background: #fff;
  border: 1px solid #cfd4dc;
  border-radius: 5px;
  outline: 0;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.quick-edit__control::placeholder {
  color: #c1c6cf;
  font-weight: 500;
}

.quick-edit__control:focus {
  border-color: #98a2b3;
  box-shadow: 0 0 0 3px rgba(152, 162, 179, 0.14);
}

.quick-edit__control.is-invalid {
  border-color: #e45464;
}

/* .quick-edit__select không còn dùng (đã thay native <select> bằng QuickSelect).
   Giữ comment để biết — class này có thể xoá nếu không nơi nào reference. */

.quick-edit__hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.35;
}

.quick-edit__hint i {
  font-size: 11px;
}

.quick-edit__error {
  color: var(--irus-color-danger, #d70018);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.35;
}

/* Collapsible section (password / address) */
.quick-edit__section {
  border-top: 1px solid #edf0f3;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-edit__section-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  margin: -2px -4px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #111827;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease;
}

.quick-edit__section-toggle:hover {
  background: #f6f7f9;
}

.quick-edit__section-toggle > i:first-child {
  color: #6b7280;
}

.quick-edit__section-toggle > span {
  flex: 1;
}

.quick-edit__section-chevron {
  color: #6b7280;
  font-size: 12px;
  transition: transform 0.18s ease;
}

.quick-edit__section-chevron.is-open {
  transform: rotate(180deg);
}

.quick-edit__section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 6px;
  color: #111827;
  font-size: 13px;
  font-weight: 600;
}

.quick-edit__section-header > i {
  color: #6b7280;
}

.quick-edit__section-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 4px;
}

/* Password input + eye toggle */
.quick-edit__password-wrap {
  position: relative;
  display: block;
  width: 100%;
}

.quick-edit__password-wrap .quick-edit__control {
  padding-right: 42px;
}

.quick-edit__eye {
  position: absolute;
  top: 50%;
  right: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  color: #6b7280;
  cursor: pointer;
  background: #f1f2f4;
  border: 0;
  border-radius: 50%;
  transform: translateY(-50%);
  transition: background-color 0.18s ease, color 0.18s ease;
}

.quick-edit__eye:hover {
  background: #e7e9ee;
  color: #111827;
}

.quick-edit__eye i {
  font-size: 11px;
}

/* Address section */
.quick-edit__address-body {
  background: #f9fafb;
  border-radius: 6px;
  padding: 10px 12px;
  gap: 6px;
}

.quick-edit__address-text {
  margin: 0;
  color: #111827;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
}

.quick-edit__address-empty {
  margin: 0;
  color: #9ca3af;
  font-size: 12px;
  font-style: italic;
}

.quick-edit__add-address {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px dashed #cfd4dc;
  border-radius: 6px;
  background: #fff;
  color: var(--irus-color-accent, #e11d48);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  align-self: flex-start;
  margin-top: 4px;
}

.quick-edit__add-address:hover {
  background: var(--irus-color-accent-soft, #fef2f4);
  border-color: var(--irus-color-accent, #e11d48);
}

.quick-edit__add-address i {
  font-size: 13px;
}

.quick-edit__footer {
  display: flex;
  gap: 10px;
}

.quick-edit__secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 38%;
  height: 40px;
  color: #374151;
  cursor: pointer;
  background: #f3f4f6;
  border: 0;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  transition: background-color 0.18s ease, opacity 0.18s ease;
}

.quick-edit__secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.quick-edit__secondary:disabled {
  cursor: not-allowed;
  opacity: 0.68;
}

.quick-edit__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 40px;
  gap: 8px;
  color: #fff;
  cursor: pointer;
  background: var(--irus-color-surface-strong, #111827);
  border: 0;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
  transition: background-color 0.18s ease, opacity 0.18s ease;
}

.quick-edit__submit:hover:not(:disabled) {
  background: #1f2937;
}

.quick-edit__submit:disabled {
  cursor: not-allowed;
  opacity: 0.68;
}

.quick-edit__spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.42);
  border-top-color: #fff;
  border-radius: 50%;
  animation: quick-edit-spin 0.8s linear infinite;
}

@keyframes quick-edit-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .quick-edit__row {
    grid-template-columns: 1fr;
  }
}
</style>
