<template>
  <form class="address-form m-3" @submit.prevent="handleSubmit">
    <div class="address-form__header">
      <h3 class="address-form__title">
        {{ isEditing ? $t("checkout.editAddress") : $t("checkout.newAddress") }}
      </h3>
    </div>

    <div class="address-form__body">
      <div class="address-form__row">
        <div class="address-form__field">
          <label for="addr-name" class="address-form__label">
            {{ $t("checkout.receiverName") }} <span class="required">*</span>
          </label>
          <input
            id="addr-name"
            v-model="form.name"
            type="text"
            class="address-form__input"
            :class="{ 'address-form__input--error': errors.name }"
            :placeholder="$t('checkout.receiverNamePlaceholder')"
            maxlength="50"
          />
          <span v-if="errors.name" class="address-form__error" role="alert">
            {{ errors.name }}
          </span>
        </div>

        <div class="address-form__field">
          <label for="addr-phone" class="address-form__label">
            {{ $t("checkout.phone") }} <span class="required">*</span>
          </label>
          <input
            id="addr-phone"
            v-model="form.phone"
            type="tel"
            class="address-form__input"
            :class="{ 'address-form__input--error': errors.phone }"
            :placeholder="$t('checkout.phonePlaceholder')"
            maxlength="12"
          />
          <span v-if="errors.phone" class="address-form__error" role="alert">
            {{ errors.phone }}
          </span>
        </div>
      </div>

      <div class="address-form__row">
        <div class="address-form__field">
          <label class="address-form__label">
            {{ $t("checkout.province") }} <span class="required">*</span>
          </label>
          <AddressSearchSelect
            v-model="form.province"
            :options="provinceOptions"
            :placeholder="$t('checkout.selectProvince')"
            :error="errors.province"
            @change="onProvinceChange"
          />
        </div>

        <div class="address-form__field">
          <label class="address-form__label">
            {{ $t("checkout.district") }} <span class="required">*</span>
          </label>
          <AddressSearchSelect
            v-model="form.district"
            :options="districtOptions"
            :placeholder="$t('checkout.selectDistrict')"
            :disabled="!form.province"
            :error="errors.district"
            @change="onDistrictChange"
          />
        </div>
      </div>

      <div class="address-form__row">
        <div class="address-form__field">
          <label class="address-form__label">
            {{ $t("checkout.ward") }} <span class="required">*</span>
          </label>
          <AddressSearchSelect
            v-model="form.ward"
            :options="wardOptions"
            :placeholder="$t('checkout.selectWard')"
            :disabled="!form.district"
            :error="errors.ward"
          />
        </div>

        <div class="address-form__field">
          <label for="addr-detail" class="address-form__label">
            {{ $t("checkout.detailAddress") }} <span class="required">*</span>
          </label>
          <input
            id="addr-detail"
            v-model="form.detail"
            type="text"
            class="address-form__input"
            :class="{ 'address-form__input--error': errors.detail }"
            :placeholder="$t('checkout.detailAddressPlaceholder')"
            maxlength="200"
          />
          <span v-if="errors.detail" class="address-form__error" role="alert">
            {{ errors.detail }}
          </span>
        </div>
      </div>

      <div class="address-form__field">
        <label class="address-form__label">{{ $t("checkout.addressLabel") }}</label>
        <div class="address-form__radio-group">
          <label class="address-form__radio-card" :class="{ 'address-form__radio-card--active': form.label === 'home' }">
            <input type="radio" value="home" v-model="form.label" />
            <i class="bi bi-house"></i>
            <span>{{ $t("checkout.home") }}</span>
          </label>
          <label class="address-form__radio-card" :class="{ 'address-form__radio-card--active': form.label === 'office' }">
            <input type="radio" value="office" v-model="form.label" />
            <i class="bi bi-building"></i>
            <span>{{ $t("checkout.office") }}</span>
          </label>
        </div>
      </div>

      <label class="address-form__checkbox-row">
        <input type="checkbox" v-model="form.isDefault" />
        <span>{{ $t("checkout.setAsDefault") }}</span>
      </label>
    </div>

    <div class="address-form__footer">
      <button type="button" class="address-form__btn address-form__btn--cancel" @click="$emit('cancel')">
        {{ $t("checkout.cancel") }}
      </button>
      <button type="submit" class="address-form__btn address-form__btn--save" :disabled="saving">
        <template v-if="saving">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{ $t("checkout.saving") }}
        </template>
        <template v-else>
          <i class="bi bi-check-lg"></i>
          {{ $t("checkout.saveAddress") }}
        </template>
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useAddress } from "@/composables/useAddress";
import AddressSearchSelect from "@/components/Checkout/AddressSearchSelect.vue";

const emit = defineEmits(["save", "cancel"]);

const props = defineProps({
  saving: {
    type: Boolean,
    default: false,
  },
});

const checkoutStore = useCheckoutStore();
const { addressForm: storeForm, editingAddressId } = storeToRefs(checkoutStore);

const isEditing = computed(() => !!editingAddressId.value);

const form = computed({
  get: () => checkoutStore.addressForm,
  set: (val) => {
    Object.assign(checkoutStore.addressForm, val);
  },
});

const {
  provinceOptions,
  districtOptions,
  wardOptions,
  onProvinceChange,
  onDistrictChange,
} = useAddress(form.value);

const submitted = ref(false);

const validateField = (name, phone, province, district, ward, detail) => {
  const e = {};
  if (!name || name.length < 2) {
    e.name = "Vui lòng nhập họ tên (2-50 ký tự)";
  }
  if (!phone || !/^0\d{9,11}$/.test(phone)) {
    e.phone = "Số điện thoại không hợp lệ";
  }
  if (!province) {
    e.province = "Vui lòng chọn Tỉnh/Thành phố";
  }
  if (!district) {
    e.district = "Vui lòng chọn Quận/Huyện";
  }
  if (!ward) {
    e.ward = "Vui lòng chọn Phường/Xã";
  }
  if (!detail || detail.length < 5) {
    e.detail = "Vui lòng nhập địa chỉ chi tiết (5-200 ký tự)";
  }
  return e;
};

const errors = computed(() => {
  if (!submitted.value) return {};
  return validateField(
    form.value.name?.trim() || "",
    form.value.phone?.replace(/\s/g, "") || "",
    form.value.province,
    form.value.district,
    form.value.ward,
    form.value.detail?.trim() || "",
  );
});

const handleSubmit = () => {
  submitted.value = true;
  if (Object.keys(errors.value).length === 0) {
    emit("save", { ...form.value });
  }
};
</script>

<style scoped>
.address-form {
  background: #fff;
  border: 1.5px solid var(--irus-color-accent);
  border-radius: 14px;
  overflow: hidden;
}

.address-form__header {
  background: var(--irus-color-accent-soft);
  border-bottom: 1px solid var(--irus-color-accent-soft);
  padding: 14px 18px;
}

.address-form__title {
  color: var(--irus-color-accent);
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}

.address-form__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
}

.address-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.address-form__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.address-form__label {
  color: #52525b;
  font-size: 13px;
  font-weight: 600;
}

.required {
  color: var(--irus-color-accent);
}

.address-form__input {
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  font-size: 14px;
  min-height: 44px;
  padding: 8px 12px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  width: 100%;
}

.address-form__input:focus {
  border-color: var(--irus-color-accent);
  box-shadow: 0 0 0 3px var(--irus-color-accent-soft);
  outline: none;
}

.address-form__input--error {
  border-color: #be123c;
}

.address-form__error {
  color: #be123c;
  font-size: 12px;
}

.address-form__radio-group {
  display: flex;
  gap: 10px;
}

.address-form__radio-card {
  align-items: center;
  border: 1.5px solid #e4e4e7;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  font-size: 13px;
  font-weight: 600;
  gap: 6px;
  padding: 8px 14px;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.address-form__radio-card input {
  display: none;
}

.address-form__radio-card--active {
  border-color: var(--irus-color-accent);
  background: var(--irus-color-accent-soft);
  color: var(--irus-color-accent);
}

.address-form__checkbox-row {
  align-items: center;
  cursor: pointer;
  display: flex;
  font-size: 13px;
  gap: 8px;
  color: #52525b;
}

.address-form__checkbox-row input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.address-form__footer {
  border-top: 1px solid #f0f0f2;
  display: flex;
  gap: 10px;
  padding: 14px 18px;
}

.address-form__btn {
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  min-height: 44px;
  padding: 8px 20px;
  transition: background 0.15s ease;
}

.address-form__btn--cancel {
  background: #f4f4f5;
  border: none;
  color: #52525b;
  flex: 1;
}

.address-form__btn--cancel:hover {
  background: #e4e4e7;
}

.address-form__btn--save {
  background: var(--irus-color-surface-strong);
  border: none;
  color: #fff;
  flex: 2;
}

.address-form__btn--save:hover {
  background: #1a1a1a;
}

.address-form__btn--save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 575.98px) {
  .address-form__row {
    grid-template-columns: 1fr;
  }
}
</style>
